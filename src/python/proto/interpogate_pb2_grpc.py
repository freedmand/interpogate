"""Client and server classes corresponding to protobuf-defined services."""
import grpc
from google.protobuf import empty_pb2 as google_dot_protobuf_dot_empty__pb2
from . import interpogate_pb2 as interpogate__pb2

class InterpogateStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.GetTokens = channel.unary_unary('/Interpogate/GetTokens', request_serializer=interpogate__pb2.TokenizeRequest.SerializeToString, response_deserializer=interpogate__pb2.TokenizeResponse.FromString)
        self.GetVocab = channel.unary_unary('/Interpogate/GetVocab', request_serializer=google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString, response_deserializer=interpogate__pb2.VocabResponse.FromString)
        self.ExtractModelGraph = channel.unary_unary('/Interpogate/ExtractModelGraph', request_serializer=google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString, response_deserializer=interpogate__pb2.ExtractModelGraphResponse.FromString)
        self.RunModelForward = channel.unary_stream('/Interpogate/RunModelForward', request_serializer=interpogate__pb2.RunModelForwardRequest.SerializeToString, response_deserializer=interpogate__pb2.RunModelForwardResponse.FromString)

class InterpogateServicer(object):
    """Missing associated documentation comment in .proto file."""

    def GetTokens(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetVocab(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def ExtractModelGraph(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def RunModelForward(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

def add_InterpogateServicer_to_server(servicer, server):
    rpc_method_handlers = {'GetTokens': grpc.unary_unary_rpc_method_handler(servicer.GetTokens, request_deserializer=interpogate__pb2.TokenizeRequest.FromString, response_serializer=interpogate__pb2.TokenizeResponse.SerializeToString), 'GetVocab': grpc.unary_unary_rpc_method_handler(servicer.GetVocab, request_deserializer=google_dot_protobuf_dot_empty__pb2.Empty.FromString, response_serializer=interpogate__pb2.VocabResponse.SerializeToString), 'ExtractModelGraph': grpc.unary_unary_rpc_method_handler(servicer.ExtractModelGraph, request_deserializer=google_dot_protobuf_dot_empty__pb2.Empty.FromString, response_serializer=interpogate__pb2.ExtractModelGraphResponse.SerializeToString), 'RunModelForward': grpc.unary_stream_rpc_method_handler(servicer.RunModelForward, request_deserializer=interpogate__pb2.RunModelForwardRequest.FromString, response_serializer=interpogate__pb2.RunModelForwardResponse.SerializeToString)}
    generic_handler = grpc.method_handlers_generic_handler('Interpogate', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))

class Interpogate(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def GetTokens(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Interpogate/GetTokens', interpogate__pb2.TokenizeRequest.SerializeToString, interpogate__pb2.TokenizeResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetVocab(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Interpogate/GetVocab', google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString, interpogate__pb2.VocabResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def ExtractModelGraph(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_unary(request, target, '/Interpogate/ExtractModelGraph', google_dot_protobuf_dot_empty__pb2.Empty.SerializeToString, interpogate__pb2.ExtractModelGraphResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def RunModelForward(request, target, options=(), channel_credentials=None, call_credentials=None, insecure=False, compression=None, wait_for_ready=None, timeout=None, metadata=None):
        return grpc.experimental.unary_stream(request, target, '/Interpogate/RunModelForward', interpogate__pb2.RunModelForwardRequest.SerializeToString, interpogate__pb2.RunModelForwardResponse.FromString, options, channel_credentials, insecure, call_credentials, compression, wait_for_ready, timeout, metadata)