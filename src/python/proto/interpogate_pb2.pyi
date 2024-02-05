from google.protobuf import empty_pb2 as _empty_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union
DESCRIPTOR: _descriptor.FileDescriptor

class TokenizeRequest(_message.Message):
    __slots__ = ('text',)
    TEXT_FIELD_NUMBER: _ClassVar[int]
    text: str

    def __init__(self, text: _Optional[str]=...) -> None:
        ...

class ErrorResponse(_message.Message):
    __slots__ = ('message',)
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    message: str

    def __init__(self, message: _Optional[str]=...) -> None:
        ...

class TokenizeResponse(_message.Message):
    __slots__ = ('success_response', 'error_response')

    class SuccessResponse(_message.Message):
        __slots__ = ('tokens', 'tokens_special', 'token_ids')
        TOKENS_FIELD_NUMBER: _ClassVar[int]
        TOKENS_SPECIAL_FIELD_NUMBER: _ClassVar[int]
        TOKEN_IDS_FIELD_NUMBER: _ClassVar[int]
        tokens: _containers.RepeatedScalarFieldContainer[str]
        tokens_special: _containers.RepeatedScalarFieldContainer[str]
        token_ids: _containers.RepeatedScalarFieldContainer[int]

        def __init__(self, tokens: _Optional[_Iterable[str]]=..., tokens_special: _Optional[_Iterable[str]]=..., token_ids: _Optional[_Iterable[int]]=...) -> None:
            ...
    SUCCESS_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    ERROR_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    success_response: TokenizeResponse.SuccessResponse
    error_response: ErrorResponse

    def __init__(self, success_response: _Optional[_Union[TokenizeResponse.SuccessResponse, _Mapping]]=..., error_response: _Optional[_Union[ErrorResponse, _Mapping]]=...) -> None:
        ...

class VocabResponse(_message.Message):
    __slots__ = ('success_response', 'error_response')

    class SuccessResponse(_message.Message):
        __slots__ = ('vocab',)
        VOCAB_FIELD_NUMBER: _ClassVar[int]
        vocab: _containers.RepeatedScalarFieldContainer[str]

        def __init__(self, vocab: _Optional[_Iterable[str]]=...) -> None:
            ...
    SUCCESS_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    ERROR_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    success_response: VocabResponse.SuccessResponse
    error_response: ErrorResponse

    def __init__(self, success_response: _Optional[_Union[VocabResponse.SuccessResponse, _Mapping]]=..., error_response: _Optional[_Union[ErrorResponse, _Mapping]]=...) -> None:
        ...

class ModelNodeParam(_message.Message):
    __slots__ = ('name', 'shape', 'dtype')
    NAME_FIELD_NUMBER: _ClassVar[int]
    SHAPE_FIELD_NUMBER: _ClassVar[int]
    DTYPE_FIELD_NUMBER: _ClassVar[int]
    name: str
    shape: Shape
    dtype: str

    def __init__(self, name: _Optional[str]=..., shape: _Optional[_Union[Shape, _Mapping]]=..., dtype: _Optional[str]=...) -> None:
        ...

class Visualization(_message.Message):
    __slots__ = ('attention_viz', 'bar_graph_viz')

    class Spread(_message.Message):
        __slots__ = ('dim', 'spread')
        DIM_FIELD_NUMBER: _ClassVar[int]
        SPREAD_FIELD_NUMBER: _ClassVar[int]
        dim: int
        spread: int

        def __init__(self, dim: _Optional[int]=..., spread: _Optional[int]=...) -> None:
            ...

    class AttentionVisualization(_message.Message):
        __slots__ = ('id', 'modelNodeId', 'key_path', 'attention_x_dim', 'attention_y_dim', 'spread', 'average_dims')
        ID_FIELD_NUMBER: _ClassVar[int]
        MODELNODEID_FIELD_NUMBER: _ClassVar[int]
        KEY_PATH_FIELD_NUMBER: _ClassVar[int]
        ATTENTION_X_DIM_FIELD_NUMBER: _ClassVar[int]
        ATTENTION_Y_DIM_FIELD_NUMBER: _ClassVar[int]
        SPREAD_FIELD_NUMBER: _ClassVar[int]
        AVERAGE_DIMS_FIELD_NUMBER: _ClassVar[int]
        id: str
        modelNodeId: str
        key_path: _containers.RepeatedCompositeFieldContainer[Key]
        attention_x_dim: int
        attention_y_dim: int
        spread: Visualization.Spread
        average_dims: _containers.RepeatedScalarFieldContainer[int]

        def __init__(self, id: _Optional[str]=..., modelNodeId: _Optional[str]=..., key_path: _Optional[_Iterable[_Union[Key, _Mapping]]]=..., attention_x_dim: _Optional[int]=..., attention_y_dim: _Optional[int]=..., spread: _Optional[_Union[Visualization.Spread, _Mapping]]=..., average_dims: _Optional[_Iterable[int]]=...) -> None:
            ...

    class BarGraphVisualization(_message.Message):
        __slots__ = ('id', 'modelNodeId', 'key_path', 'plot_dimension', 'spread', 'average_dims')
        ID_FIELD_NUMBER: _ClassVar[int]
        MODELNODEID_FIELD_NUMBER: _ClassVar[int]
        KEY_PATH_FIELD_NUMBER: _ClassVar[int]
        PLOT_DIMENSION_FIELD_NUMBER: _ClassVar[int]
        SPREAD_FIELD_NUMBER: _ClassVar[int]
        AVERAGE_DIMS_FIELD_NUMBER: _ClassVar[int]
        id: str
        modelNodeId: str
        key_path: _containers.RepeatedCompositeFieldContainer[Key]
        plot_dimension: int
        spread: Visualization.Spread
        average_dims: _containers.RepeatedScalarFieldContainer[int]

        def __init__(self, id: _Optional[str]=..., modelNodeId: _Optional[str]=..., key_path: _Optional[_Iterable[_Union[Key, _Mapping]]]=..., plot_dimension: _Optional[int]=..., spread: _Optional[_Union[Visualization.Spread, _Mapping]]=..., average_dims: _Optional[_Iterable[int]]=...) -> None:
            ...
    ATTENTION_VIZ_FIELD_NUMBER: _ClassVar[int]
    BAR_GRAPH_VIZ_FIELD_NUMBER: _ClassVar[int]
    attention_viz: Visualization.AttentionVisualization
    bar_graph_viz: Visualization.BarGraphVisualization

    def __init__(self, attention_viz: _Optional[_Union[Visualization.AttentionVisualization, _Mapping]]=..., bar_graph_viz: _Optional[_Union[Visualization.BarGraphVisualization, _Mapping]]=...) -> None:
        ...

class ModelNode(_message.Message):
    __slots__ = ('name', 'classname', 'id', 'in_features', 'out_features', 'children', 'params')
    NAME_FIELD_NUMBER: _ClassVar[int]
    CLASSNAME_FIELD_NUMBER: _ClassVar[int]
    ID_FIELD_NUMBER: _ClassVar[int]
    IN_FEATURES_FIELD_NUMBER: _ClassVar[int]
    OUT_FEATURES_FIELD_NUMBER: _ClassVar[int]
    CHILDREN_FIELD_NUMBER: _ClassVar[int]
    PARAMS_FIELD_NUMBER: _ClassVar[int]
    name: str
    classname: str
    id: str
    in_features: int
    out_features: int
    children: _containers.RepeatedCompositeFieldContainer[ModelNode]
    params: _containers.RepeatedCompositeFieldContainer[ModelNodeParam]

    def __init__(self, name: _Optional[str]=..., classname: _Optional[str]=..., id: _Optional[str]=..., in_features: _Optional[int]=..., out_features: _Optional[int]=..., children: _Optional[_Iterable[_Union[ModelNode, _Mapping]]]=..., params: _Optional[_Iterable[_Union[ModelNodeParam, _Mapping]]]=...) -> None:
        ...

class Visualizations(_message.Message):
    __slots__ = ('visualizations',)
    VISUALIZATIONS_FIELD_NUMBER: _ClassVar[int]
    visualizations: _containers.RepeatedCompositeFieldContainer[Visualization]

    def __init__(self, visualizations: _Optional[_Iterable[_Union[Visualization, _Mapping]]]=...) -> None:
        ...

class VisualizationMap(_message.Message):
    __slots__ = ('visualization_map',)

    class VisualizationMapEntry(_message.Message):
        __slots__ = ('key', 'value')
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: Visualizations

        def __init__(self, key: _Optional[str]=..., value: _Optional[_Union[Visualizations, _Mapping]]=...) -> None:
            ...
    VISUALIZATION_MAP_FIELD_NUMBER: _ClassVar[int]
    visualization_map: _containers.MessageMap[str, Visualizations]

    def __init__(self, visualization_map: _Optional[_Mapping[str, Visualizations]]=...) -> None:
        ...

class ExtractModelGraphResponse(_message.Message):
    __slots__ = ('success_response', 'error_response')

    class SuccessResponse(_message.Message):
        __slots__ = ('model_node',)
        MODEL_NODE_FIELD_NUMBER: _ClassVar[int]
        model_node: ModelNode

        def __init__(self, model_node: _Optional[_Union[ModelNode, _Mapping]]=...) -> None:
            ...
    SUCCESS_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    ERROR_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    success_response: ExtractModelGraphResponse.SuccessResponse
    error_response: ErrorResponse

    def __init__(self, success_response: _Optional[_Union[ExtractModelGraphResponse.SuccessResponse, _Mapping]]=..., error_response: _Optional[_Union[ErrorResponse, _Mapping]]=...) -> None:
        ...

class RunModelForwardRequest(_message.Message):
    __slots__ = ('token_ids', 'visualization_map')
    TOKEN_IDS_FIELD_NUMBER: _ClassVar[int]
    VISUALIZATION_MAP_FIELD_NUMBER: _ClassVar[int]
    token_ids: _containers.RepeatedScalarFieldContainer[int]
    visualization_map: VisualizationMap

    def __init__(self, token_ids: _Optional[_Iterable[int]]=..., visualization_map: _Optional[_Union[VisualizationMap, _Mapping]]=...) -> None:
        ...

class Shape(_message.Message):
    __slots__ = ('shape',)
    SHAPE_FIELD_NUMBER: _ClassVar[int]
    shape: _containers.RepeatedScalarFieldContainer[int]

    def __init__(self, shape: _Optional[_Iterable[int]]=...) -> None:
        ...

class ListShape(_message.Message):
    __slots__ = ('list_shape',)
    LIST_SHAPE_FIELD_NUMBER: _ClassVar[int]
    list_shape: _containers.RepeatedCompositeFieldContainer[ComplexShape]

    def __init__(self, list_shape: _Optional[_Iterable[_Union[ComplexShape, _Mapping]]]=...) -> None:
        ...

class MapShape(_message.Message):
    __slots__ = ('map_shape',)

    class MapShapeEntry(_message.Message):
        __slots__ = ('key', 'value')
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: ComplexShape

        def __init__(self, key: _Optional[str]=..., value: _Optional[_Union[ComplexShape, _Mapping]]=...) -> None:
            ...
    MAP_SHAPE_FIELD_NUMBER: _ClassVar[int]
    map_shape: _containers.MessageMap[str, ComplexShape]

    def __init__(self, map_shape: _Optional[_Mapping[str, ComplexShape]]=...) -> None:
        ...

class ComplexShape(_message.Message):
    __slots__ = ('list_shape', 'dict_shape', 'class_shape', 'shape', 'type')
    LIST_SHAPE_FIELD_NUMBER: _ClassVar[int]
    DICT_SHAPE_FIELD_NUMBER: _ClassVar[int]
    CLASS_SHAPE_FIELD_NUMBER: _ClassVar[int]
    SHAPE_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    list_shape: ListShape
    dict_shape: MapShape
    class_shape: MapShape
    shape: Shape
    type: str

    def __init__(self, list_shape: _Optional[_Union[ListShape, _Mapping]]=..., dict_shape: _Optional[_Union[MapShape, _Mapping]]=..., class_shape: _Optional[_Union[MapShape, _Mapping]]=..., shape: _Optional[_Union[Shape, _Mapping]]=..., type: _Optional[str]=...) -> None:
        ...

class Key(_message.Message):
    __slots__ = ('list_key', 'dict_key', 'class_key')
    LIST_KEY_FIELD_NUMBER: _ClassVar[int]
    DICT_KEY_FIELD_NUMBER: _ClassVar[int]
    CLASS_KEY_FIELD_NUMBER: _ClassVar[int]
    list_key: int
    dict_key: str
    class_key: str

    def __init__(self, list_key: _Optional[int]=..., dict_key: _Optional[str]=..., class_key: _Optional[str]=...) -> None:
        ...

class VisualizationResponse(_message.Message):
    __slots__ = ('visualization_id', 'output')
    VISUALIZATION_ID_FIELD_NUMBER: _ClassVar[int]
    OUTPUT_FIELD_NUMBER: _ClassVar[int]
    visualization_id: str
    output: bytes

    def __init__(self, visualization_id: _Optional[str]=..., output: _Optional[bytes]=...) -> None:
        ...

class RunModelForwardResponse(_message.Message):
    __slots__ = ('error_response', 'pre_hook_response', 'post_hook_response', 'done_response')

    class PreHookResponse(_message.Message):
        __slots__ = ('id', 'input_shape')
        ID_FIELD_NUMBER: _ClassVar[int]
        INPUT_SHAPE_FIELD_NUMBER: _ClassVar[int]
        id: str
        input_shape: ComplexShape

        def __init__(self, id: _Optional[str]=..., input_shape: _Optional[_Union[ComplexShape, _Mapping]]=...) -> None:
            ...

    class PostHookResponse(_message.Message):
        __slots__ = ('id', 'input_shape', 'output_shape', 'visualization_responses')
        ID_FIELD_NUMBER: _ClassVar[int]
        INPUT_SHAPE_FIELD_NUMBER: _ClassVar[int]
        OUTPUT_SHAPE_FIELD_NUMBER: _ClassVar[int]
        VISUALIZATION_RESPONSES_FIELD_NUMBER: _ClassVar[int]
        id: str
        input_shape: ComplexShape
        output_shape: ComplexShape
        visualization_responses: _containers.RepeatedCompositeFieldContainer[VisualizationResponse]

        def __init__(self, id: _Optional[str]=..., input_shape: _Optional[_Union[ComplexShape, _Mapping]]=..., output_shape: _Optional[_Union[ComplexShape, _Mapping]]=..., visualization_responses: _Optional[_Iterable[_Union[VisualizationResponse, _Mapping]]]=...) -> None:
            ...

    class DoneResponse(_message.Message):
        __slots__ = ('output',)
        OUTPUT_FIELD_NUMBER: _ClassVar[int]
        output: bytes

        def __init__(self, output: _Optional[bytes]=...) -> None:
            ...
    ERROR_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    PRE_HOOK_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    POST_HOOK_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    DONE_RESPONSE_FIELD_NUMBER: _ClassVar[int]
    error_response: ErrorResponse
    pre_hook_response: RunModelForwardResponse.PreHookResponse
    post_hook_response: RunModelForwardResponse.PostHookResponse
    done_response: RunModelForwardResponse.DoneResponse

    def __init__(self, error_response: _Optional[_Union[ErrorResponse, _Mapping]]=..., pre_hook_response: _Optional[_Union[RunModelForwardResponse.PreHookResponse, _Mapping]]=..., post_hook_response: _Optional[_Union[RunModelForwardResponse.PostHookResponse, _Mapping]]=..., done_response: _Optional[_Union[RunModelForwardResponse.DoneResponse, _Mapping]]=...) -> None:
        ...