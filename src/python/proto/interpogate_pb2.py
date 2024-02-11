"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
_sym_db = _symbol_database.Default()
from google.protobuf import empty_pb2 as google_dot_protobuf_dot_empty__pb2
DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x11interpogate.proto\x1a\x1bgoogle/protobuf/empty.proto"\x1f\n\x0fTokenizeRequest\x12\x0c\n\x04text\x18\x01 \x01(\t" \n\rErrorResponse\x12\x0f\n\x07message\x18\x01 \x01(\t"\xd5\x01\n\x10TokenizeResponse\x12=\n\x10success_response\x18\x01 \x01(\x0b2!.TokenizeResponse.SuccessResponseH\x00\x12(\n\x0eerror_response\x18\x02 \x01(\x0b2\x0e.ErrorResponseH\x00\x1aL\n\x0fSuccessResponse\x12\x0e\n\x06tokens\x18\x01 \x03(\t\x12\x16\n\x0etokens_special\x18\x02 \x03(\t\x12\x11\n\ttoken_ids\x18\x03 \x03(\x05B\n\n\x08Response"\xa3\x01\n\rVocabResponse\x12:\n\x10success_response\x18\x01 \x01(\x0b2\x1e.VocabResponse.SuccessResponseH\x00\x12(\n\x0eerror_response\x18\x02 \x01(\x0b2\x0e.ErrorResponseH\x00\x1a \n\x0fSuccessResponse\x12\r\n\x05vocab\x18\x01 \x03(\tB\n\n\x08Response"D\n\x0eModelNodeParam\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x15\n\x05shape\x18\x02 \x01(\x0b2\x06.Shape\x12\r\n\x05dtype\x18\x03 \x01(\t"\xcb\x04\n\rVisualization\x12>\n\rattention_viz\x18\x01 \x01(\x0b2%.Visualization.AttentionVisualizationH\x00\x12=\n\rbar_graph_viz\x18\x02 \x01(\x0b2$.Visualization.BarGraphVisualizationH\x00\x1a%\n\x06Spread\x12\x0b\n\x03dim\x18\x01 \x01(\x05\x12\x0e\n\x06spread\x18\x02 \x01(\x05\x1a\xd0\x01\n\x16AttentionVisualization\x12\n\n\x02id\x18\x01 \x01(\t\x12\x13\n\x0bmodelNodeId\x18\x02 \x01(\t\x12\x16\n\x08key_path\x18\x03 \x03(\x0b2\x04.Key\x12\x17\n\x0fattention_x_dim\x18\x04 \x01(\x05\x12\x17\n\x0fattention_y_dim\x18\x05 \x01(\x05\x12*\n\x06spread\x18\x06 \x01(\x0b2\x15.Visualization.SpreadH\x00\x88\x01\x01\x12\x14\n\x0caverage_dims\x18\x07 \x03(\x05B\t\n\x07_spread\x1a\xb5\x01\n\x15BarGraphVisualization\x12\n\n\x02id\x18\x01 \x01(\t\x12\x13\n\x0bmodelNodeId\x18\x02 \x01(\t\x12\x16\n\x08key_path\x18\x03 \x03(\x0b2\x04.Key\x12\x16\n\x0eplot_dimension\x18\x04 \x01(\x05\x12*\n\x06spread\x18\x05 \x01(\x0b2\x15.Visualization.SpreadH\x00\x88\x01\x01\x12\x14\n\x0caverage_dims\x18\x06 \x03(\x05B\t\n\x07_spreadB\t\n\x07VizType"\xdb\x01\n\tModelNode\x12\x0c\n\x04name\x18\x01 \x01(\t\x12\x0c\n\x04path\x18\x02 \x01(\t\x12\x11\n\tclassname\x18\x03 \x01(\t\x12\n\n\x02id\x18\x04 \x01(\t\x12\x18\n\x0bin_features\x18\x05 \x01(\x05H\x00\x88\x01\x01\x12\x19\n\x0cout_features\x18\x06 \x01(\x05H\x01\x88\x01\x01\x12\x1c\n\x08children\x18\x07 \x03(\x0b2\n.ModelNode\x12\x1f\n\x06params\x18\x08 \x03(\x0b2\x0f.ModelNodeParamB\x0e\n\x0c_in_featuresB\x0f\n\r_out_features"8\n\x0eVisualizations\x12&\n\x0evisualizations\x18\x01 \x03(\x0b2\x0e.Visualization"\xa0\x01\n\x10VisualizationMap\x12B\n\x11visualization_map\x18\x01 \x03(\x0b2\'.VisualizationMap.VisualizationMapEntry\x1aH\n\x15VisualizationMapEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\x1e\n\x05value\x18\x02 \x01(\x0b2\x0f.Visualizations:\x028\x01"\xcc\x01\n\x19ExtractModelGraphResponse\x12F\n\x10success_response\x18\x01 \x01(\x0b2*.ExtractModelGraphResponse.SuccessResponseH\x00\x12(\n\x0eerror_response\x18\x02 \x01(\x0b2\x0e.ErrorResponseH\x00\x1a1\n\x0fSuccessResponse\x12\x1e\n\nmodel_node\x18\x01 \x01(\x0b2\n.ModelNodeB\n\n\x08Response"Y\n\x16RunModelForwardRequest\x12\x11\n\ttoken_ids\x18\x01 \x03(\x05\x12,\n\x11visualization_map\x18\x02 \x01(\x0b2\x11.VisualizationMap"\x16\n\x05Shape\x12\r\n\x05shape\x18\x01 \x03(\x05".\n\tListShape\x12!\n\nlist_shape\x18\x01 \x03(\x0b2\r.ComplexShape"v\n\x08MapShape\x12*\n\tmap_shape\x18\x01 \x03(\x0b2\x17.MapShape.MapShapeEntry\x1a>\n\rMapShapeEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\x1c\n\x05value\x18\x02 \x01(\x0b2\r.ComplexShape:\x028\x01"\xa9\x01\n\x0cComplexShape\x12 \n\nlist_shape\x18\x01 \x01(\x0b2\n.ListShapeH\x00\x12\x1f\n\ndict_shape\x18\x02 \x01(\x0b2\t.MapShapeH\x00\x12 \n\x0bclass_shape\x18\x03 \x01(\x0b2\t.MapShapeH\x00\x12\x17\n\x05shape\x18\x04 \x01(\x0b2\x06.ShapeH\x00\x12\x0e\n\x04type\x18\x05 \x01(\tH\x00B\x0b\n\tShapeType"M\n\x03Key\x12\x12\n\x08list_key\x18\x01 \x01(\x05H\x00\x12\x12\n\x08dict_key\x18\x02 \x01(\tH\x00\x12\x13\n\tclass_key\x18\x03 \x01(\tH\x00B\t\n\x07KeyType"A\n\x15VisualizationResponse\x12\x18\n\x10visualization_id\x18\x01 \x01(\t\x12\x0e\n\x06output\x18\x02 \x01(\x0c"\x8b\x05\n\x17RunModelForwardResponse\x12(\n\x0eerror_response\x18\x01 \x01(\x0b2\x0e.ErrorResponseH\x00\x12D\n\x10success_response\x18\x02 \x01(\x0b2(.RunModelForwardResponse.SuccessResponseH\x00\x1aA\n\x0fPreHookResponse\x12\n\n\x02id\x18\x01 \x01(\t\x12"\n\x0binput_shape\x18\x02 \x01(\x0b2\r.ComplexShape\x1a\xa0\x01\n\x10PostHookResponse\x12\n\n\x02id\x18\x01 \x01(\t\x12"\n\x0binput_shape\x18\x02 \x01(\x0b2\r.ComplexShape\x12#\n\x0coutput_shape\x18\x03 \x01(\x0b2\r.ComplexShape\x127\n\x17visualization_responses\x18\x04 \x03(\x0b2\x16.VisualizationResponse\x1a\x1e\n\x0cDoneResponse\x12\x0e\n\x06output\x18\x01 \x01(\x0c\x1a\xed\x01\n\x0fSuccessResponse\x12E\n\x11pre_hook_response\x18\x01 \x01(\x0b2(.RunModelForwardResponse.PreHookResponseH\x00\x12G\n\x12post_hook_response\x18\x02 \x01(\x0b2).RunModelForwardResponse.PostHookResponseH\x00\x12>\n\rdone_response\x18\x03 \x01(\x0b2%.RunModelForwardResponse.DoneResponseH\x00B\n\n\x08ResponseB\n\n\x08Response"\x88\x03\n\x11PreloadedResponse\x12?\n\x0bmodel_graph\x18\x01 \x01(\x0b2*.ExtractModelGraphResponse.SuccessResponse\x122\n\x05vocab\x18\x02 \x01(\x0b2\x1e.VocabResponse.SuccessResponseH\x00\x88\x01\x01\x12B\n\x0cforward_pass\x18\x03 \x01(\x0b2\'.PreloadedResponse.PreloadedForwardPassH\x01\x88\x01\x01\x1a\x9e\x01\n\x14PreloadedForwardPass\x126\n\x06tokens\x18\x01 \x01(\x0b2!.TokenizeResponse.SuccessResponseH\x00\x88\x01\x01\x12C\n\x11forward_responses\x18\x02 \x03(\x0b2(.RunModelForwardResponse.SuccessResponseB\t\n\x07_tokensB\x08\n\x06_vocabB\x0f\n\r_forward_pass2\x8a\x02\n\x0bInterpogate\x122\n\tGetTokens\x12\x10.TokenizeRequest\x1a\x11.TokenizeResponse"\x00\x124\n\x08GetVocab\x12\x16.google.protobuf.Empty\x1a\x0e.VocabResponse"\x00\x12I\n\x11ExtractModelGraph\x12\x16.google.protobuf.Empty\x1a\x1a.ExtractModelGraphResponse"\x00\x12F\n\x0fRunModelForward\x12\x17.RunModelForwardRequest\x1a\x18.RunModelForwardResponse0\x01b\x06proto3')
_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'interpogate_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
    DESCRIPTOR._options = None
    _globals['_VISUALIZATIONMAP_VISUALIZATIONMAPENTRY']._options = None
    _globals['_VISUALIZATIONMAP_VISUALIZATIONMAPENTRY']._serialized_options = b'8\x01'
    _globals['_MAPSHAPE_MAPSHAPEENTRY']._options = None
    _globals['_MAPSHAPE_MAPSHAPEENTRY']._serialized_options = b'8\x01'
    _globals['_TOKENIZEREQUEST']._serialized_start = 50
    _globals['_TOKENIZEREQUEST']._serialized_end = 81
    _globals['_ERRORRESPONSE']._serialized_start = 83
    _globals['_ERRORRESPONSE']._serialized_end = 115
    _globals['_TOKENIZERESPONSE']._serialized_start = 118
    _globals['_TOKENIZERESPONSE']._serialized_end = 331
    _globals['_TOKENIZERESPONSE_SUCCESSRESPONSE']._serialized_start = 243
    _globals['_TOKENIZERESPONSE_SUCCESSRESPONSE']._serialized_end = 319
    _globals['_VOCABRESPONSE']._serialized_start = 334
    _globals['_VOCABRESPONSE']._serialized_end = 497
    _globals['_VOCABRESPONSE_SUCCESSRESPONSE']._serialized_start = 453
    _globals['_VOCABRESPONSE_SUCCESSRESPONSE']._serialized_end = 485
    _globals['_MODELNODEPARAM']._serialized_start = 499
    _globals['_MODELNODEPARAM']._serialized_end = 567
    _globals['_VISUALIZATION']._serialized_start = 570
    _globals['_VISUALIZATION']._serialized_end = 1157
    _globals['_VISUALIZATION_SPREAD']._serialized_start = 714
    _globals['_VISUALIZATION_SPREAD']._serialized_end = 751
    _globals['_VISUALIZATION_ATTENTIONVISUALIZATION']._serialized_start = 754
    _globals['_VISUALIZATION_ATTENTIONVISUALIZATION']._serialized_end = 962
    _globals['_VISUALIZATION_BARGRAPHVISUALIZATION']._serialized_start = 965
    _globals['_VISUALIZATION_BARGRAPHVISUALIZATION']._serialized_end = 1146
    _globals['_MODELNODE']._serialized_start = 1160
    _globals['_MODELNODE']._serialized_end = 1379
    _globals['_VISUALIZATIONS']._serialized_start = 1381
    _globals['_VISUALIZATIONS']._serialized_end = 1437
    _globals['_VISUALIZATIONMAP']._serialized_start = 1440
    _globals['_VISUALIZATIONMAP']._serialized_end = 1600
    _globals['_VISUALIZATIONMAP_VISUALIZATIONMAPENTRY']._serialized_start = 1528
    _globals['_VISUALIZATIONMAP_VISUALIZATIONMAPENTRY']._serialized_end = 1600
    _globals['_EXTRACTMODELGRAPHRESPONSE']._serialized_start = 1603
    _globals['_EXTRACTMODELGRAPHRESPONSE']._serialized_end = 1807
    _globals['_EXTRACTMODELGRAPHRESPONSE_SUCCESSRESPONSE']._serialized_start = 1746
    _globals['_EXTRACTMODELGRAPHRESPONSE_SUCCESSRESPONSE']._serialized_end = 1795
    _globals['_RUNMODELFORWARDREQUEST']._serialized_start = 1809
    _globals['_RUNMODELFORWARDREQUEST']._serialized_end = 1898
    _globals['_SHAPE']._serialized_start = 1900
    _globals['_SHAPE']._serialized_end = 1922
    _globals['_LISTSHAPE']._serialized_start = 1924
    _globals['_LISTSHAPE']._serialized_end = 1970
    _globals['_MAPSHAPE']._serialized_start = 1972
    _globals['_MAPSHAPE']._serialized_end = 2090
    _globals['_MAPSHAPE_MAPSHAPEENTRY']._serialized_start = 2028
    _globals['_MAPSHAPE_MAPSHAPEENTRY']._serialized_end = 2090
    _globals['_COMPLEXSHAPE']._serialized_start = 2093
    _globals['_COMPLEXSHAPE']._serialized_end = 2262
    _globals['_KEY']._serialized_start = 2264
    _globals['_KEY']._serialized_end = 2341
    _globals['_VISUALIZATIONRESPONSE']._serialized_start = 2343
    _globals['_VISUALIZATIONRESPONSE']._serialized_end = 2408
    _globals['_RUNMODELFORWARDRESPONSE']._serialized_start = 2411
    _globals['_RUNMODELFORWARDRESPONSE']._serialized_end = 3062
    _globals['_RUNMODELFORWARDRESPONSE_PREHOOKRESPONSE']._serialized_start = 2550
    _globals['_RUNMODELFORWARDRESPONSE_PREHOOKRESPONSE']._serialized_end = 2615
    _globals['_RUNMODELFORWARDRESPONSE_POSTHOOKRESPONSE']._serialized_start = 2618
    _globals['_RUNMODELFORWARDRESPONSE_POSTHOOKRESPONSE']._serialized_end = 2778
    _globals['_RUNMODELFORWARDRESPONSE_DONERESPONSE']._serialized_start = 2780
    _globals['_RUNMODELFORWARDRESPONSE_DONERESPONSE']._serialized_end = 2810
    _globals['_RUNMODELFORWARDRESPONSE_SUCCESSRESPONSE']._serialized_start = 2813
    _globals['_RUNMODELFORWARDRESPONSE_SUCCESSRESPONSE']._serialized_end = 3050
    _globals['_PRELOADEDRESPONSE']._serialized_start = 3065
    _globals['_PRELOADEDRESPONSE']._serialized_end = 3457
    _globals['_PRELOADEDRESPONSE_PRELOADEDFORWARDPASS']._serialized_start = 3272
    _globals['_PRELOADEDRESPONSE_PRELOADEDFORWARDPASS']._serialized_end = 3430
    _globals['_INTERPOGATE']._serialized_start = 3460
    _globals['_INTERPOGATE']._serialized_end = 3726