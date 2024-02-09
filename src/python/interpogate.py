import base64
import html
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import torch
import transformers
from proto.interpogate_pb2 import (
    ExtractModelGraphResponse,
    PreloadedResponse,
    RunModelForwardRequest,
    RunModelForwardResponse,
    TokenizeResponse,
    VocabResponse,
)
from server import InterpogateService

client_html_file = str(Path(__file__).parent / 'static' / 'index.html')

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
