import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';


export class TokenizeRequest extends jspb.Message {
  getText(): string;
  setText(value: string): TokenizeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenizeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TokenizeRequest): TokenizeRequest.AsObject;
  static serializeBinaryToWriter(message: TokenizeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenizeRequest;
  static deserializeBinaryFromReader(message: TokenizeRequest, reader: jspb.BinaryReader): TokenizeRequest;
}

export namespace TokenizeRequest {
  export type AsObject = {
    text: string,
  }
}

export class ErrorResponse extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): ErrorResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorResponse): ErrorResponse.AsObject;
  static serializeBinaryToWriter(message: ErrorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorResponse;
  static deserializeBinaryFromReader(message: ErrorResponse, reader: jspb.BinaryReader): ErrorResponse;
}

export namespace ErrorResponse {
  export type AsObject = {
    message: string,
  }
}

export class TokenizeResponse extends jspb.Message {
  getSuccessResponse(): TokenizeResponse.SuccessResponse | undefined;
  setSuccessResponse(value?: TokenizeResponse.SuccessResponse): TokenizeResponse;
  hasSuccessResponse(): boolean;
  clearSuccessResponse(): TokenizeResponse;

  getErrorResponse(): ErrorResponse | undefined;
  setErrorResponse(value?: ErrorResponse): TokenizeResponse;
  hasErrorResponse(): boolean;
  clearErrorResponse(): TokenizeResponse;

  getResponseCase(): TokenizeResponse.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TokenizeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TokenizeResponse): TokenizeResponse.AsObject;
  static serializeBinaryToWriter(message: TokenizeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TokenizeResponse;
  static deserializeBinaryFromReader(message: TokenizeResponse, reader: jspb.BinaryReader): TokenizeResponse;
}

export namespace TokenizeResponse {
  export type AsObject = {
    successResponse?: TokenizeResponse.SuccessResponse.AsObject,
    errorResponse?: ErrorResponse.AsObject,
  }

  export class SuccessResponse extends jspb.Message {
    getTokensList(): Array<string>;
    setTokensList(value: Array<string>): SuccessResponse;
    clearTokensList(): SuccessResponse;
    addTokens(value: string, index?: number): SuccessResponse;

    getTokensSpecialList(): Array<string>;
    setTokensSpecialList(value: Array<string>): SuccessResponse;
    clearTokensSpecialList(): SuccessResponse;
    addTokensSpecial(value: string, index?: number): SuccessResponse;

    getTokenIdsList(): Array<number>;
    setTokenIdsList(value: Array<number>): SuccessResponse;
    clearTokenIdsList(): SuccessResponse;
    addTokenIds(value: number, index?: number): SuccessResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuccessResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SuccessResponse): SuccessResponse.AsObject;
    static serializeBinaryToWriter(message: SuccessResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuccessResponse;
    static deserializeBinaryFromReader(message: SuccessResponse, reader: jspb.BinaryReader): SuccessResponse;
  }

  export namespace SuccessResponse {
    export type AsObject = {
      tokensList: Array<string>,
      tokensSpecialList: Array<string>,
      tokenIdsList: Array<number>,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    SUCCESS_RESPONSE = 1,
    ERROR_RESPONSE = 2,
  }
}

export class VocabResponse extends jspb.Message {
  getSuccessResponse(): VocabResponse.SuccessResponse | undefined;
  setSuccessResponse(value?: VocabResponse.SuccessResponse): VocabResponse;
  hasSuccessResponse(): boolean;
  clearSuccessResponse(): VocabResponse;

  getErrorResponse(): ErrorResponse | undefined;
  setErrorResponse(value?: ErrorResponse): VocabResponse;
  hasErrorResponse(): boolean;
  clearErrorResponse(): VocabResponse;

  getResponseCase(): VocabResponse.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VocabResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VocabResponse): VocabResponse.AsObject;
  static serializeBinaryToWriter(message: VocabResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VocabResponse;
  static deserializeBinaryFromReader(message: VocabResponse, reader: jspb.BinaryReader): VocabResponse;
}

export namespace VocabResponse {
  export type AsObject = {
    successResponse?: VocabResponse.SuccessResponse.AsObject,
    errorResponse?: ErrorResponse.AsObject,
  }

  export class SuccessResponse extends jspb.Message {
    getVocabList(): Array<string>;
    setVocabList(value: Array<string>): SuccessResponse;
    clearVocabList(): SuccessResponse;
    addVocab(value: string, index?: number): SuccessResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuccessResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SuccessResponse): SuccessResponse.AsObject;
    static serializeBinaryToWriter(message: SuccessResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuccessResponse;
    static deserializeBinaryFromReader(message: SuccessResponse, reader: jspb.BinaryReader): SuccessResponse;
  }

  export namespace SuccessResponse {
    export type AsObject = {
      vocabList: Array<string>,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    SUCCESS_RESPONSE = 1,
    ERROR_RESPONSE = 2,
  }
}

export class ModelNodeParam extends jspb.Message {
  getName(): string;
  setName(value: string): ModelNodeParam;

  getShape(): Shape | undefined;
  setShape(value?: Shape): ModelNodeParam;
  hasShape(): boolean;
  clearShape(): ModelNodeParam;

  getDtype(): string;
  setDtype(value: string): ModelNodeParam;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelNodeParam.AsObject;
  static toObject(includeInstance: boolean, msg: ModelNodeParam): ModelNodeParam.AsObject;
  static serializeBinaryToWriter(message: ModelNodeParam, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelNodeParam;
  static deserializeBinaryFromReader(message: ModelNodeParam, reader: jspb.BinaryReader): ModelNodeParam;
}

export namespace ModelNodeParam {
  export type AsObject = {
    name: string,
    shape?: Shape.AsObject,
    dtype: string,
  }
}

export class Visualization extends jspb.Message {
  getAttentionViz(): Visualization.AttentionVisualization | undefined;
  setAttentionViz(value?: Visualization.AttentionVisualization): Visualization;
  hasAttentionViz(): boolean;
  clearAttentionViz(): Visualization;

  getBarGraphViz(): Visualization.BarGraphVisualization | undefined;
  setBarGraphViz(value?: Visualization.BarGraphVisualization): Visualization;
  hasBarGraphViz(): boolean;
  clearBarGraphViz(): Visualization;

  getViztypeCase(): Visualization.ViztypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Visualization.AsObject;
  static toObject(includeInstance: boolean, msg: Visualization): Visualization.AsObject;
  static serializeBinaryToWriter(message: Visualization, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Visualization;
  static deserializeBinaryFromReader(message: Visualization, reader: jspb.BinaryReader): Visualization;
}

export namespace Visualization {
  export type AsObject = {
    attentionViz?: Visualization.AttentionVisualization.AsObject,
    barGraphViz?: Visualization.BarGraphVisualization.AsObject,
  }

  export class Spread extends jspb.Message {
    getDim(): number;
    setDim(value: number): Spread;

    getSpread(): number;
    setSpread(value: number): Spread;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Spread.AsObject;
    static toObject(includeInstance: boolean, msg: Spread): Spread.AsObject;
    static serializeBinaryToWriter(message: Spread, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Spread;
    static deserializeBinaryFromReader(message: Spread, reader: jspb.BinaryReader): Spread;
  }

  export namespace Spread {
    export type AsObject = {
      dim: number,
      spread: number,
    }
  }


  export class AttentionVisualization extends jspb.Message {
    getId(): string;
    setId(value: string): AttentionVisualization;

    getModelnodeid(): string;
    setModelnodeid(value: string): AttentionVisualization;

    getKeyPathList(): Array<Key>;
    setKeyPathList(value: Array<Key>): AttentionVisualization;
    clearKeyPathList(): AttentionVisualization;
    addKeyPath(value?: Key, index?: number): Key;

    getAttentionXDim(): number;
    setAttentionXDim(value: number): AttentionVisualization;

    getAttentionYDim(): number;
    setAttentionYDim(value: number): AttentionVisualization;

    getSpread(): Visualization.Spread | undefined;
    setSpread(value?: Visualization.Spread): AttentionVisualization;
    hasSpread(): boolean;
    clearSpread(): AttentionVisualization;

    getAverageDimsList(): Array<number>;
    setAverageDimsList(value: Array<number>): AttentionVisualization;
    clearAverageDimsList(): AttentionVisualization;
    addAverageDims(value: number, index?: number): AttentionVisualization;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AttentionVisualization.AsObject;
    static toObject(includeInstance: boolean, msg: AttentionVisualization): AttentionVisualization.AsObject;
    static serializeBinaryToWriter(message: AttentionVisualization, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AttentionVisualization;
    static deserializeBinaryFromReader(message: AttentionVisualization, reader: jspb.BinaryReader): AttentionVisualization;
  }

  export namespace AttentionVisualization {
    export type AsObject = {
      id: string,
      modelnodeid: string,
      keyPathList: Array<Key.AsObject>,
      attentionXDim: number,
      attentionYDim: number,
      spread?: Visualization.Spread.AsObject,
      averageDimsList: Array<number>,
    }

    export enum SpreadCase { 
      _SPREAD_NOT_SET = 0,
      SPREAD = 6,
    }
  }


  export class BarGraphVisualization extends jspb.Message {
    getId(): string;
    setId(value: string): BarGraphVisualization;

    getModelnodeid(): string;
    setModelnodeid(value: string): BarGraphVisualization;

    getKeyPathList(): Array<Key>;
    setKeyPathList(value: Array<Key>): BarGraphVisualization;
    clearKeyPathList(): BarGraphVisualization;
    addKeyPath(value?: Key, index?: number): Key;

    getPlotDimension(): number;
    setPlotDimension(value: number): BarGraphVisualization;

    getSpread(): Visualization.Spread | undefined;
    setSpread(value?: Visualization.Spread): BarGraphVisualization;
    hasSpread(): boolean;
    clearSpread(): BarGraphVisualization;

    getAverageDimsList(): Array<number>;
    setAverageDimsList(value: Array<number>): BarGraphVisualization;
    clearAverageDimsList(): BarGraphVisualization;
    addAverageDims(value: number, index?: number): BarGraphVisualization;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BarGraphVisualization.AsObject;
    static toObject(includeInstance: boolean, msg: BarGraphVisualization): BarGraphVisualization.AsObject;
    static serializeBinaryToWriter(message: BarGraphVisualization, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BarGraphVisualization;
    static deserializeBinaryFromReader(message: BarGraphVisualization, reader: jspb.BinaryReader): BarGraphVisualization;
  }

  export namespace BarGraphVisualization {
    export type AsObject = {
      id: string,
      modelnodeid: string,
      keyPathList: Array<Key.AsObject>,
      plotDimension: number,
      spread?: Visualization.Spread.AsObject,
      averageDimsList: Array<number>,
    }

    export enum SpreadCase { 
      _SPREAD_NOT_SET = 0,
      SPREAD = 5,
    }
  }


  export enum ViztypeCase { 
    VIZTYPE_NOT_SET = 0,
    ATTENTION_VIZ = 1,
    BAR_GRAPH_VIZ = 2,
  }
}

export class ModelNode extends jspb.Message {
  getName(): string;
  setName(value: string): ModelNode;

  getClassname(): string;
  setClassname(value: string): ModelNode;

  getId(): string;
  setId(value: string): ModelNode;

  getInFeatures(): number;
  setInFeatures(value: number): ModelNode;
  hasInFeatures(): boolean;
  clearInFeatures(): ModelNode;

  getOutFeatures(): number;
  setOutFeatures(value: number): ModelNode;
  hasOutFeatures(): boolean;
  clearOutFeatures(): ModelNode;

  getChildrenList(): Array<ModelNode>;
  setChildrenList(value: Array<ModelNode>): ModelNode;
  clearChildrenList(): ModelNode;
  addChildren(value?: ModelNode, index?: number): ModelNode;

  getParamsList(): Array<ModelNodeParam>;
  setParamsList(value: Array<ModelNodeParam>): ModelNode;
  clearParamsList(): ModelNode;
  addParams(value?: ModelNodeParam, index?: number): ModelNodeParam;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModelNode.AsObject;
  static toObject(includeInstance: boolean, msg: ModelNode): ModelNode.AsObject;
  static serializeBinaryToWriter(message: ModelNode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModelNode;
  static deserializeBinaryFromReader(message: ModelNode, reader: jspb.BinaryReader): ModelNode;
}

export namespace ModelNode {
  export type AsObject = {
    name: string,
    classname: string,
    id: string,
    inFeatures?: number,
    outFeatures?: number,
    childrenList: Array<ModelNode.AsObject>,
    paramsList: Array<ModelNodeParam.AsObject>,
  }

  export enum InFeaturesCase { 
    _IN_FEATURES_NOT_SET = 0,
    IN_FEATURES = 4,
  }

  export enum OutFeaturesCase { 
    _OUT_FEATURES_NOT_SET = 0,
    OUT_FEATURES = 5,
  }
}

export class Visualizations extends jspb.Message {
  getVisualizationsList(): Array<Visualization>;
  setVisualizationsList(value: Array<Visualization>): Visualizations;
  clearVisualizationsList(): Visualizations;
  addVisualizations(value?: Visualization, index?: number): Visualization;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Visualizations.AsObject;
  static toObject(includeInstance: boolean, msg: Visualizations): Visualizations.AsObject;
  static serializeBinaryToWriter(message: Visualizations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Visualizations;
  static deserializeBinaryFromReader(message: Visualizations, reader: jspb.BinaryReader): Visualizations;
}

export namespace Visualizations {
  export type AsObject = {
    visualizationsList: Array<Visualization.AsObject>,
  }
}

export class VisualizationMap extends jspb.Message {
  getVisualizationMapMap(): jspb.Map<string, Visualizations>;
  clearVisualizationMapMap(): VisualizationMap;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisualizationMap.AsObject;
  static toObject(includeInstance: boolean, msg: VisualizationMap): VisualizationMap.AsObject;
  static serializeBinaryToWriter(message: VisualizationMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisualizationMap;
  static deserializeBinaryFromReader(message: VisualizationMap, reader: jspb.BinaryReader): VisualizationMap;
}

export namespace VisualizationMap {
  export type AsObject = {
    visualizationMapMap: Array<[string, Visualizations.AsObject]>,
  }
}

export class ExtractModelGraphResponse extends jspb.Message {
  getSuccessResponse(): ExtractModelGraphResponse.SuccessResponse | undefined;
  setSuccessResponse(value?: ExtractModelGraphResponse.SuccessResponse): ExtractModelGraphResponse;
  hasSuccessResponse(): boolean;
  clearSuccessResponse(): ExtractModelGraphResponse;

  getErrorResponse(): ErrorResponse | undefined;
  setErrorResponse(value?: ErrorResponse): ExtractModelGraphResponse;
  hasErrorResponse(): boolean;
  clearErrorResponse(): ExtractModelGraphResponse;

  getResponseCase(): ExtractModelGraphResponse.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractModelGraphResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractModelGraphResponse): ExtractModelGraphResponse.AsObject;
  static serializeBinaryToWriter(message: ExtractModelGraphResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractModelGraphResponse;
  static deserializeBinaryFromReader(message: ExtractModelGraphResponse, reader: jspb.BinaryReader): ExtractModelGraphResponse;
}

export namespace ExtractModelGraphResponse {
  export type AsObject = {
    successResponse?: ExtractModelGraphResponse.SuccessResponse.AsObject,
    errorResponse?: ErrorResponse.AsObject,
  }

  export class SuccessResponse extends jspb.Message {
    getModelNode(): ModelNode | undefined;
    setModelNode(value?: ModelNode): SuccessResponse;
    hasModelNode(): boolean;
    clearModelNode(): SuccessResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SuccessResponse.AsObject;
    static toObject(includeInstance: boolean, msg: SuccessResponse): SuccessResponse.AsObject;
    static serializeBinaryToWriter(message: SuccessResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SuccessResponse;
    static deserializeBinaryFromReader(message: SuccessResponse, reader: jspb.BinaryReader): SuccessResponse;
  }

  export namespace SuccessResponse {
    export type AsObject = {
      modelNode?: ModelNode.AsObject,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    SUCCESS_RESPONSE = 1,
    ERROR_RESPONSE = 2,
  }
}

export class RunModelForwardRequest extends jspb.Message {
  getTokenIdsList(): Array<number>;
  setTokenIdsList(value: Array<number>): RunModelForwardRequest;
  clearTokenIdsList(): RunModelForwardRequest;
  addTokenIds(value: number, index?: number): RunModelForwardRequest;

  getVisualizationMap(): VisualizationMap | undefined;
  setVisualizationMap(value?: VisualizationMap): RunModelForwardRequest;
  hasVisualizationMap(): boolean;
  clearVisualizationMap(): RunModelForwardRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunModelForwardRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RunModelForwardRequest): RunModelForwardRequest.AsObject;
  static serializeBinaryToWriter(message: RunModelForwardRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunModelForwardRequest;
  static deserializeBinaryFromReader(message: RunModelForwardRequest, reader: jspb.BinaryReader): RunModelForwardRequest;
}

export namespace RunModelForwardRequest {
  export type AsObject = {
    tokenIdsList: Array<number>,
    visualizationMap?: VisualizationMap.AsObject,
  }
}

export class Shape extends jspb.Message {
  getShapeList(): Array<number>;
  setShapeList(value: Array<number>): Shape;
  clearShapeList(): Shape;
  addShape(value: number, index?: number): Shape;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Shape.AsObject;
  static toObject(includeInstance: boolean, msg: Shape): Shape.AsObject;
  static serializeBinaryToWriter(message: Shape, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Shape;
  static deserializeBinaryFromReader(message: Shape, reader: jspb.BinaryReader): Shape;
}

export namespace Shape {
  export type AsObject = {
    shapeList: Array<number>,
  }
}

export class ListShape extends jspb.Message {
  getListShapeList(): Array<ComplexShape>;
  setListShapeList(value: Array<ComplexShape>): ListShape;
  clearListShapeList(): ListShape;
  addListShape(value?: ComplexShape, index?: number): ComplexShape;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListShape.AsObject;
  static toObject(includeInstance: boolean, msg: ListShape): ListShape.AsObject;
  static serializeBinaryToWriter(message: ListShape, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListShape;
  static deserializeBinaryFromReader(message: ListShape, reader: jspb.BinaryReader): ListShape;
}

export namespace ListShape {
  export type AsObject = {
    listShapeList: Array<ComplexShape.AsObject>,
  }
}

export class MapShape extends jspb.Message {
  getMapShapeMap(): jspb.Map<string, ComplexShape>;
  clearMapShapeMap(): MapShape;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MapShape.AsObject;
  static toObject(includeInstance: boolean, msg: MapShape): MapShape.AsObject;
  static serializeBinaryToWriter(message: MapShape, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MapShape;
  static deserializeBinaryFromReader(message: MapShape, reader: jspb.BinaryReader): MapShape;
}

export namespace MapShape {
  export type AsObject = {
    mapShapeMap: Array<[string, ComplexShape.AsObject]>,
  }
}

export class ComplexShape extends jspb.Message {
  getListShape(): ListShape | undefined;
  setListShape(value?: ListShape): ComplexShape;
  hasListShape(): boolean;
  clearListShape(): ComplexShape;

  getDictShape(): MapShape | undefined;
  setDictShape(value?: MapShape): ComplexShape;
  hasDictShape(): boolean;
  clearDictShape(): ComplexShape;

  getClassShape(): MapShape | undefined;
  setClassShape(value?: MapShape): ComplexShape;
  hasClassShape(): boolean;
  clearClassShape(): ComplexShape;

  getShape(): Shape | undefined;
  setShape(value?: Shape): ComplexShape;
  hasShape(): boolean;
  clearShape(): ComplexShape;

  getType(): string;
  setType(value: string): ComplexShape;

  getShapetypeCase(): ComplexShape.ShapetypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComplexShape.AsObject;
  static toObject(includeInstance: boolean, msg: ComplexShape): ComplexShape.AsObject;
  static serializeBinaryToWriter(message: ComplexShape, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComplexShape;
  static deserializeBinaryFromReader(message: ComplexShape, reader: jspb.BinaryReader): ComplexShape;
}

export namespace ComplexShape {
  export type AsObject = {
    listShape?: ListShape.AsObject,
    dictShape?: MapShape.AsObject,
    classShape?: MapShape.AsObject,
    shape?: Shape.AsObject,
    type: string,
  }

  export enum ShapetypeCase { 
    SHAPETYPE_NOT_SET = 0,
    LIST_SHAPE = 1,
    DICT_SHAPE = 2,
    CLASS_SHAPE = 3,
    SHAPE = 4,
    TYPE = 5,
  }
}

export class Key extends jspb.Message {
  getListKey(): number;
  setListKey(value: number): Key;

  getDictKey(): string;
  setDictKey(value: string): Key;

  getClassKey(): string;
  setClassKey(value: string): Key;

  getKeytypeCase(): Key.KeytypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Key.AsObject;
  static toObject(includeInstance: boolean, msg: Key): Key.AsObject;
  static serializeBinaryToWriter(message: Key, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Key;
  static deserializeBinaryFromReader(message: Key, reader: jspb.BinaryReader): Key;
}

export namespace Key {
  export type AsObject = {
    listKey: number,
    dictKey: string,
    classKey: string,
  }

  export enum KeytypeCase { 
    KEYTYPE_NOT_SET = 0,
    LIST_KEY = 1,
    DICT_KEY = 2,
    CLASS_KEY = 3,
  }
}

export class VisualizationResponse extends jspb.Message {
  getVisualizationId(): string;
  setVisualizationId(value: string): VisualizationResponse;

  getOutput(): Uint8Array | string;
  getOutput_asU8(): Uint8Array;
  getOutput_asB64(): string;
  setOutput(value: Uint8Array | string): VisualizationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VisualizationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VisualizationResponse): VisualizationResponse.AsObject;
  static serializeBinaryToWriter(message: VisualizationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VisualizationResponse;
  static deserializeBinaryFromReader(message: VisualizationResponse, reader: jspb.BinaryReader): VisualizationResponse;
}

export namespace VisualizationResponse {
  export type AsObject = {
    visualizationId: string,
    output: Uint8Array | string,
  }
}

export class RunModelForwardResponse extends jspb.Message {
  getErrorResponse(): ErrorResponse | undefined;
  setErrorResponse(value?: ErrorResponse): RunModelForwardResponse;
  hasErrorResponse(): boolean;
  clearErrorResponse(): RunModelForwardResponse;

  getPreHookResponse(): RunModelForwardResponse.PreHookResponse | undefined;
  setPreHookResponse(value?: RunModelForwardResponse.PreHookResponse): RunModelForwardResponse;
  hasPreHookResponse(): boolean;
  clearPreHookResponse(): RunModelForwardResponse;

  getPostHookResponse(): RunModelForwardResponse.PostHookResponse | undefined;
  setPostHookResponse(value?: RunModelForwardResponse.PostHookResponse): RunModelForwardResponse;
  hasPostHookResponse(): boolean;
  clearPostHookResponse(): RunModelForwardResponse;

  getDoneResponse(): RunModelForwardResponse.DoneResponse | undefined;
  setDoneResponse(value?: RunModelForwardResponse.DoneResponse): RunModelForwardResponse;
  hasDoneResponse(): boolean;
  clearDoneResponse(): RunModelForwardResponse;

  getResponseCase(): RunModelForwardResponse.ResponseCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RunModelForwardResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RunModelForwardResponse): RunModelForwardResponse.AsObject;
  static serializeBinaryToWriter(message: RunModelForwardResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RunModelForwardResponse;
  static deserializeBinaryFromReader(message: RunModelForwardResponse, reader: jspb.BinaryReader): RunModelForwardResponse;
}

export namespace RunModelForwardResponse {
  export type AsObject = {
    errorResponse?: ErrorResponse.AsObject,
    preHookResponse?: RunModelForwardResponse.PreHookResponse.AsObject,
    postHookResponse?: RunModelForwardResponse.PostHookResponse.AsObject,
    doneResponse?: RunModelForwardResponse.DoneResponse.AsObject,
  }

  export class PreHookResponse extends jspb.Message {
    getId(): string;
    setId(value: string): PreHookResponse;

    getInputShape(): ComplexShape | undefined;
    setInputShape(value?: ComplexShape): PreHookResponse;
    hasInputShape(): boolean;
    clearInputShape(): PreHookResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PreHookResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PreHookResponse): PreHookResponse.AsObject;
    static serializeBinaryToWriter(message: PreHookResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PreHookResponse;
    static deserializeBinaryFromReader(message: PreHookResponse, reader: jspb.BinaryReader): PreHookResponse;
  }

  export namespace PreHookResponse {
    export type AsObject = {
      id: string,
      inputShape?: ComplexShape.AsObject,
    }
  }


  export class PostHookResponse extends jspb.Message {
    getId(): string;
    setId(value: string): PostHookResponse;

    getInputShape(): ComplexShape | undefined;
    setInputShape(value?: ComplexShape): PostHookResponse;
    hasInputShape(): boolean;
    clearInputShape(): PostHookResponse;

    getOutputShape(): ComplexShape | undefined;
    setOutputShape(value?: ComplexShape): PostHookResponse;
    hasOutputShape(): boolean;
    clearOutputShape(): PostHookResponse;

    getVisualizationResponsesList(): Array<VisualizationResponse>;
    setVisualizationResponsesList(value: Array<VisualizationResponse>): PostHookResponse;
    clearVisualizationResponsesList(): PostHookResponse;
    addVisualizationResponses(value?: VisualizationResponse, index?: number): VisualizationResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostHookResponse.AsObject;
    static toObject(includeInstance: boolean, msg: PostHookResponse): PostHookResponse.AsObject;
    static serializeBinaryToWriter(message: PostHookResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostHookResponse;
    static deserializeBinaryFromReader(message: PostHookResponse, reader: jspb.BinaryReader): PostHookResponse;
  }

  export namespace PostHookResponse {
    export type AsObject = {
      id: string,
      inputShape?: ComplexShape.AsObject,
      outputShape?: ComplexShape.AsObject,
      visualizationResponsesList: Array<VisualizationResponse.AsObject>,
    }
  }


  export class DoneResponse extends jspb.Message {
    getOutput(): Uint8Array | string;
    getOutput_asU8(): Uint8Array;
    getOutput_asB64(): string;
    setOutput(value: Uint8Array | string): DoneResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DoneResponse.AsObject;
    static toObject(includeInstance: boolean, msg: DoneResponse): DoneResponse.AsObject;
    static serializeBinaryToWriter(message: DoneResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DoneResponse;
    static deserializeBinaryFromReader(message: DoneResponse, reader: jspb.BinaryReader): DoneResponse;
  }

  export namespace DoneResponse {
    export type AsObject = {
      output: Uint8Array | string,
    }
  }


  export enum ResponseCase { 
    RESPONSE_NOT_SET = 0,
    ERROR_RESPONSE = 1,
    PRE_HOOK_RESPONSE = 2,
    POST_HOOK_RESPONSE = 3,
    DONE_RESPONSE = 4,
  }
}

