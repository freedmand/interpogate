import { get, writable, type Writable } from 'svelte/store';
import type {
	ComplexShape,
	Key,
	ModelNode,
	TokenizeResponse_SuccessResponse,
	Visualization,
	VisualizationMap
} from './proto/interpogate';
import type { VizResponse } from './ai';
import type { NdArray } from 'ndarray';

export interface ForwardPassMeta {
	tokenizeResponse: TokenizeResponse_SuccessResponse;
	nodeShapes: {
		[id: string]: {
			inputShape?: ComplexShape;
			outputShape?: ComplexShape;
		};
	};
}

export const modelNode: Writable<ModelNode | null> = writable(null);
export const vizMap: Writable<{ [vizId: string]: Visualization }> = writable({});
export const vizModelMap: Writable<VisualizationMap> = writable({ visualizationMap: {} });
export const vizId = writable(1);
export const vizResponses: Writable<VizResponse[]> = writable([]);

export const forwardPassMeta: Writable<ForwardPassMeta | null> = writable(null);
export const selectedNumTokens: Writable<number | null> = writable(null);
export const selectedNode: Writable<ModelNode | null> = writable(null);
export const selectedKey: Writable<Key[]> = writable([]);
export const selectedShape: Writable<number[]> = writable([]);

export function startForwardPass(tokenizeResponse: TokenizeResponse_SuccessResponse) {
	forwardPassMeta.set({
		tokenizeResponse,
		nodeShapes: {}
	});
}

export function updateInputShape(nodeId: string, shape: ComplexShape) {
	forwardPassMeta.update((value) => {
		if (value == null) return value;
		if (value.nodeShapes[nodeId] == null) value.nodeShapes[nodeId] = {};
		value.nodeShapes[nodeId].inputShape = shape;
		return value;
	});
}

export function updateOutputShape(nodeId: string, shape: ComplexShape) {
	forwardPassMeta.update((value) => {
		if (value == null) return value;
		if (value.nodeShapes[nodeId] == null) value.nodeShapes[nodeId] = {};
		value.nodeShapes[nodeId].outputShape = shape;
		return value;
	});
}

export function getVizId(): string {
	const value = get(vizId);
	vizId.update((id) => (id += 1));
	return `viz_${value}`;
}

export function registerViz(viz: Visualization) {
	const vizId =
		viz.vizType.oneofKind === 'attentionViz'
			? viz.vizType.attentionViz.id
			: viz.vizType.oneofKind === 'barGraphViz'
				? viz.vizType.barGraphViz.id
				: null;
	const modelNodeId =
		viz.vizType.oneofKind === 'attentionViz'
			? viz.vizType.attentionViz.modelNodeId
			: viz.vizType.oneofKind === 'barGraphViz'
				? viz.vizType.barGraphViz.modelNodeId
				: null;
	if (vizId == null) {
		throw new Error(`Viz id null unexpectedly: ${viz}`);
	}
	vizModelMap.update((map) => {
		if (modelNodeId == null) {
			throw new Error(`Model id null unexpectedly: ${viz}`);
		}

		return {
			...map,
			visualizationMap: {
				...map.visualizationMap,
				[modelNodeId]: {
					visualizations: [...(map.visualizationMap[modelNodeId]?.visualizations ?? []), viz]
				}
			}
		};
	});
	vizMap.update((map) => ({ ...map, [vizId]: viz }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addVizResponse(visualizationId: string, data: NdArray<any>) {
	vizResponses.update((responses) => [
		...responses,
		{
			visualizationId,
			data
		}
	]);
}

export function clearVizResponses() {
	vizResponses.set([]);
}
