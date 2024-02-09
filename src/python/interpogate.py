from __future__ import annotations

import base64
import html
import os
import sys
import traceback
import typing
from dataclasses import dataclass, field
from io import BytesIO
from pathlib import Path
from typing import Iterator, Optional

import numpy as np
import torch
from proto.interpogate_pb2 import (
    ComplexShape,
    ErrorResponse,
    ExtractModelGraphResponse,
    Key,
    ListShape,
    MapShape,
    ModelNode,
    ModelNodeParam,
    PreloadedResponse,
    RunModelForwardRequest,
    RunModelForwardResponse,
    Shape,
    TokenizeResponse,
    Visualization,
    VisualizationResponse,
    VocabResponse,
)

if typing.TYPE_CHECKING:
    import torch.multiprocessing as mp
    import transformers
    from torch.utils.hooks import RemovableHandle

client_html_file = str(Path(__file__).parent / 'static' / 'index.html')

LOG_PATH = 'logs'

# Fix pickling proto
sys.path.append(str(Path(__file__).parent / 'proto'))

def get_error_message(e) -> str:
    return f"{traceback.format_exc()}\n\n{e}"

class Unbuffered(object):
    def __init__(self, stream):
        self.stream = stream

    def write(self, data):
        self.stream.write(data)
        self.stream.flush()

    def writelines(self, datas):
        self.stream.writelines(datas)
        self.stream.flush()

    def __getattr__(self, attr):
        return getattr(self.stream, attr)

def get_np_bytes(data):
    numpy_buffer = BytesIO()
    np.save(numpy_buffer, data, allow_pickle=False)
    numpy_buffer.seek(0) 
    return numpy_buffer.read()

def accessor(data, key: list[Key]):
    if key:
        head, rest = key[0], key[1:]
        key_type = head.WhichOneof("KeyType")
        if key_type == "list_key":
            return accessor(data[head.list_key], rest)
        elif key_type == "dict_key":
            return accessor(data[head.dict_key], rest)
        elif key_type == "class_key":
            return accessor(getattr(data, head.class_key), rest)
        else:
            raise ValueError(f"Invalid key type for {head}")
    return data

def calculate_attention_viz(output, request: Visualization.AttentionVisualization):
    data = accessor(output, request.key_path)
    data = data.mean(dim=tuple(request.average_dims), keepdim=True)
    if request.HasField("spread"):
        result = data.permute((request.spread.dim, request.attention_x_dim, request.attention_y_dim, *list(request.average_dims)))
        if len(result.shape) > 3:
            result = result.mean(dim=tuple(range(3, len(result.shape))))
    else:
        result = data.permute((request.attention_x_dim, request.attention_y_dim, *list(request.average_dims)))
        if len(result.shape) > 2:
            result = result.mean(dim=tuple(range(2, len(result.shape))))
        result = result.unsqueeze(0)
    return VisualizationResponse(visualization_id=request.id, output=get_np_bytes(result))

def calculate_visualization(output, request: Visualization):
    viz_type = request.WhichOneof("VizType")
    if viz_type == "attention_viz":
        return calculate_attention_viz(output, request.attention_viz)
    else:
        raise Exception("Only attention viz support for now")

def get_shape(x) -> ComplexShape:
    if hasattr(x, 'shape'):
        return ComplexShape(shape=Shape(shape=list(x.shape)))
    elif isinstance(x, dict):
        return ComplexShape(dict_shape=MapShape(map_shape={k: get_shape(v) for k, v in x.items()}))
    elif isinstance(x, tuple) or isinstance(x, list):
        return ComplexShape(list_shape=ListShape(list_shape=[get_shape(elem) for elem in x]))
    elif hasattr(x, '__dict__'):
        return ComplexShape(class_shape=MapShape(map_shape={k: get_shape(v) for k, v in vars(x).items()}))
    else:
        return ComplexShape(type=str(type(x)))

@dataclass
class InterpogateService:
    model: torch.nn.Module
    tokenizer: transformers.PreTrainedTokenizerBase

    hooks: list[RemovableHandle] = field(default_factory=list)
    model_id_map: dict[torch.nn.Module, str] = field(default_factory=dict)
    id_incrementer = 1

    def initialize_logging(self):
        pid = os.getpid()
        log_path = Path(LOG_PATH)
        log_path.mkdir(parents=True, exist_ok=True)
        sys.stdout = Unbuffered(open(log_path / f'{pid}.out', "a"))
        sys.stderr = Unbuffered(open(log_path / f'{pid}_error.out', "a"))

    def run(self, input_queue: mp.Queue, output_queue: mp.Queue):
        self.initialize_logging()

        while True:
            args = input_queue.get()

            if args[0] == 'get_tokens':
                output_queue.put(self.get_tokens(*args[1:]))
            elif args[0] == 'get_vocab':
                resp = self.get_vocab(*args[1:])
                output_queue.put(self.get_vocab(*args[1:]))
            elif args[0] == 'extract_model_graph':
                output_queue.put(self.extract_model_graph(*args[1:]))
            elif args[0] == 'run_model_forward':
                self.run_model_forward(output_queue.put, *args[1:])
                output_queue.put(None)
            else:
                raise Exception(f"Invalid args: {args}")

    def remove_hooks(self):
        for hook in self.hooks:
            hook.remove()
        self.hooks = []

    def get_tokens(self, text: str) -> TokenizeResponse:
        try:
            tokens_raw = self.tokenizer(text, return_offsets_mapping=True)
            token_ids: list[int] = tokens_raw['input_ids']
            offsets: list[tuple[int, int]] = tokens_raw['offset_mapping']
            tokens_special: list[str] = self.tokenizer.convert_ids_to_tokens(token_ids)
            tokens = [text[start:end] for start, end in offsets]

            return TokenizeResponse(
                success_response=TokenizeResponse.SuccessResponse(
                    tokens=tokens, tokens_special=tokens_special, token_ids=token_ids
                )
            )
        except Exception as e:
            return TokenizeResponse(
                error_response=ErrorResponse(message=get_error_message(e))
            )

    def get_vocab(self) -> VocabResponse:
        try:
            vocab = sorted([(k, v) for k, v in self.tokenizer.get_vocab().items()], key=lambda x: x[1])
            for i in range(len(vocab)):
                assert vocab[i][1] == i, f"Missing vocab indices (wanted {i} got {vocab[i]})"
            
            return VocabResponse(success_response=VocabResponse.SuccessResponse(vocab=[item[0] for item in vocab]))
        except Exception as e:
            return VocabResponse(
                error_response=ErrorResponse(message=get_error_message(e))
            )

    def model_to_model_graph(self, model: torch.nn.Module, name='root') -> ModelNode:
        props = {}
        props['name'] = name
        props['classname'] = model.__class__.__name__
        if model in self.model_id_map:
            props['id'] = f'{self.model_id_map[model]}'
        else:
            props['id'] = f'{self.id_incrementer}'
            self.model_id_map[model] = self.id_incrementer
            self.id_incrementer += 1
        if hasattr(model, 'in_features'):
            props['in_features'] = model.in_features
        if hasattr(model, 'out_features'):
            props['out_features'] = model.out_features
        props['params'] = [ModelNodeParam(name=name, shape=Shape(shape=list(parameter.shape)), dtype=str(parameter.dtype)) for name, parameter in model.named_parameters(recurse=False)]
        props['children'] = [self.model_to_model_graph(child, name) for name, child in model.named_children()]

        return ModelNode(**props)
    
    def get_all_modules(self, model: torch.nn.Module, depth=None) -> Iterator[torch.nn.Module]:
        result = [model]
        if depth is None or depth > 0:
            for _, child in model.named_children():
                result += self.get_all_modules(child, None if depth is None else depth - 1)
        return result
    
    def run_model_forward(self, callback, request: RunModelForwardRequest) -> None:
        try:
            # Clear any hooks lingering around (shouldn't be any)
            self.remove_hooks()

            def pre_hook(model, input):
                # Not working because yield isn't evaluated in parent scope
                try:
                    if model in self.model_id_map:
                        callback(RunModelForwardResponse(success_response=RunModelForwardResponse.SuccessResponse(pre_hook_response=RunModelForwardResponse.PreHookResponse(id=f'{self.model_id_map[model]}', input_shape=get_shape(input)))))
                except Exception as e:
                    callback(RunModelForwardResponse(error_response=ErrorResponse(message=get_error_message(e))))

            def post_hook(model, input, output):
                try:
                    if model in self.model_id_map:
                        # Check for visualizations
                        visualization_requests = []
                        visualization_map_raw = request.visualization_map.visualization_map.get(f"{self.model_id_map[model]}", None)
                        if visualization_map_raw:
                            visualization_requests = visualization_map_raw.visualizations
                        visualization_responses = [calculate_visualization(output, request) for request in visualization_requests]

                        callback(RunModelForwardResponse(success_response=RunModelForwardResponse.SuccessResponse(post_hook_response=RunModelForwardResponse.PostHookResponse(id=f'{self.model_id_map[model]}', input_shape=get_shape(input), output_shape=get_shape(output), visualization_responses=visualization_responses))))
                except Exception as e:
                    callback(RunModelForwardResponse(error_response=ErrorResponse(message=get_error_message(e))))

            for module in self.get_all_modules(self.model, depth=None):
                self.hooks.append(module.register_forward_pre_hook(pre_hook))
                self.hooks.append(module.register_forward_hook(post_hook))
            
            output = self.model(input_ids=torch.tensor([request.token_ids]), output_attentions=True).logits.numpy(force=True)
            output_bytes = get_np_bytes(output)

            callback(RunModelForwardResponse(success_response=RunModelForwardResponse.SuccessResponse(done_response=RunModelForwardResponse.DoneResponse(output=output_bytes))))
        except Exception as e:
            callback(RunModelForwardResponse(error_response=ErrorResponse(message=get_error_message(e))))
        finally:
            self.remove_hooks()

    def extract_model_graph(self) -> ExtractModelGraphResponse:
        try:
            return ExtractModelGraphResponse(
                success_response=ExtractModelGraphResponse.SuccessResponse(model_node=self.model_to_model_graph(self.model))
            )
        except Exception as e:
            return ExtractModelGraphResponse(
                error_response=ErrorResponse(message=get_error_message(e))
            )

@dataclass
class Interpogate:
    model: torch.nn.Module
    tokenizer: transformers.PreTrainedTokenizerBase
    service: InterpogateService = field(init=False)
    model_graph: ExtractModelGraphResponse.SuccessResponse = field(init=False)
    vocab: VocabResponse.SuccessResponse = field(init=False)
    forward_pass: Optional[tuple[TokenizeResponse.SuccessResponse, list[RunModelForwardResponse.SuccessResponse]]] = None

    def assert_response(self, response):
        if response.HasField("error_response"):
            raise Exception(response.error_response.message)
        return response.success_response

    def __post_init__(self):
        self.service = InterpogateService(self.model, self.tokenizer)
        self.model_graph = self.assert_response(self.service.extract_model_graph())
        self.vocab = self.assert_response(self.service.get_vocab())
    
    def forward(self, text: str):
        tokenize_response: TokenizeResponse.SuccessResponse = self.assert_response(self.service.get_tokens(text))

        forward_pass: list[RunModelForwardResponse.SuccessResponse] = []
        def callback(resp):
            forward_pass.append(self.assert_response(resp))

        self.service.run_model_forward(callback, RunModelForwardRequest(token_ids = tokenize_response.token_ids))
        self.forward_pass = (tokenize_response, forward_pass)
    
    def get_preloaded_response(self) -> PreloadedResponse:
        if self.forward_pass is None:
            return PreloadedResponse(model_graph=self.model_graph, vocab=self.vocab)
        else:
            return PreloadedResponse(model_graph=self.model_graph, vocab=self.vocab, forward_pass=PreloadedResponse.PreloadedForwardPass(tokens=self.forward_pass[0], forward_responses=self.forward_pass[1]))

    def get_preloaded_response_b64_str(self) -> str:
        return base64.b64encode(self.get_preloaded_response().SerializeToString()).decode()
    
    def get_preloaded_html(self) -> str:
        with open(client_html_file, 'r') as f:
            client_html = f.read()
        return client_html.replace('__PRELOADED_PLACEHOLDER__', self.get_preloaded_response_b64_str())
    
    def get_iframe(self, width="100%", height=400):
        width = html.escape(f"{width}")
        height = html.escape(f"{height}")
        srcdoc = html.escape(self.get_preloaded_html())

        iframe_html = f'<iframe width="{width}" height="{height}" srcdoc="{srcdoc}" frameborder="0"></iframe>'
        return iframe_html
