import concurrent.futures
import os
import sys
from dataclasses import dataclass, field
from typing import Iterator

import grpc
import torch
import torch.multiprocessing as mp
import transformers
from proto.interpogate_pb2 import (
    ExtractModelGraphResponse,
    RunModelForwardRequest,
    RunModelForwardResponse,
    TokenizeRequest,
    TokenizeResponse,
    VocabResponse,
)
from proto.interpogate_pb2_grpc import (
    InterpogateServicer,
    add_InterpogateServicer_to_server,
)

from interpogate import InterpogateService

# No backward passes needed
torch.set_grad_enabled(False)

# Single-threaded in Docker
IN_DOCKER = os.environ.get("IN_DOCKER", False) == "True"
if IN_DOCKER:
    torch.set_num_threads(1)

def batch(iterable, n=1):
    l = len(iterable)
    for ndx in range(0, l, n):
        yield iterable[ndx:min(ndx + n, l)]
    
def run_server_process(
    model: torch.nn.Module,
    tokenizer: transformers.PreTrainedTokenizerBase,
    input_queue: mp.Queue,
    output_queue: mp.Queue
):
    server = InterpogateService(model=model, tokenizer=tokenizer)
    # Run the server indefinitely
    server.run(input_queue=input_queue, output_queue=output_queue)


@dataclass
class Server:
    model: torch.nn.Module
    tokenizer: transformers.PreTrainedTokenizerBase
    model_name: str
    input_queue: mp.Queue = field(init=False)
    output_queue: mp.Queue = field(init=False)
    process: mp.Process = field(init=False)

    def __post_init__(self):
        self.model.share_memory()
        self.input_queue = mp.Queue()
        self.output_queue = mp.Queue()
        self.process = mp.Process(target=run_server_process, args=(self.model, self.tokenizer, self.input_queue, self.output_queue))
        self.process.start()

    def __del__(self):
        # Close out the process
        self.process.terminate()

    def get_tokens(self, text: str) -> TokenizeResponse:
        self.input_queue.put(('get_tokens', text))
        return self.output_queue.get()
    
    def get_vocab(self) -> VocabResponse:
        self.input_queue.put(('get_vocab',))
        return self.output_queue.get()
    
    def extract_model_graph(self) -> ExtractModelGraphResponse:
        self.input_queue.put(('extract_model_graph',))
        return self.output_queue.get()

    def run_model_forward(self, request: RunModelForwardRequest) -> Iterator[RunModelForwardResponse]:
        self.input_queue.put(('run_model_forward', request))
        while True:
            response = self.output_queue.get()
            if response is None:
                break
            yield response

class InterpogateServer(InterpogateServicer):
    def __init__(self, server: Server) -> None:
        self.server = server
        super().__init__()

    def GetTokens(self, request: TokenizeRequest, context) -> TokenizeResponse:
        return self.server.get_tokens(request.text)

    def GetVocab(self, request, context) -> VocabResponse:
        return self.server.get_vocab()
    
    def ExtractModelGraph(self, request, context) -> ExtractModelGraphResponse:
        return self.server.extract_model_graph()

    def RunModelForward(self, request: RunModelForwardRequest, context) -> Iterator[RunModelForwardResponse]:
        return self.server.run_model_forward(request)

def serve(model, tokenizer, model_name):
    server = Server(model, tokenizer, model_name)

    grpc_server = grpc.server(concurrent.futures.ThreadPoolExecutor(max_workers=10))
    add_InterpogateServicer_to_server(InterpogateServer(server), grpc_server)
    grpc_server.add_insecure_port("[::]:50051")
    grpc_server.start()
    print("SERVING AT 50051")
    grpc_server.wait_for_termination()

if __name__ == '__main__':
    if len(sys.argv) == 2:
        model_name = sys.argv[1]
    else:
        # Default to gpt2
        model_name = 'openai-community/gpt2'
    pipe = transformers.pipeline("text-generation", model=model_name, device="cpu")
    model = pipe.model
    tokenizer = pipe.tokenizer

    serve(model, tokenizer, model_name)