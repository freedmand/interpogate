import type { Key, ModelNode, Visualization, Visualization_Spread } from './proto/interpogate';

export type VisualizationSelection =
	| AttentionVisualizationSelection
	| BarGraphVisualizationSelection;

export interface AttentionVisualizationSelection {
	type: 'attention';
	attentionX: number[];
	attentionY: number[];
	spread: number[];
	average: number[];
}

export interface BarGraphVisualizationSelection {
	type: 'barGraph';
	plotDimension: number[];
	spread: number[];
	average: number[];
}

function ensureOne<T>(input: T[]): T {
	if (input.length !== 1) {
		throw new Error(`Expected ${input} to only be 1-dimensional`);
	}
	return input[0];
}

function getSpread(spread: number[], shape: number[]): Visualization_Spread | undefined {
	if (spread.length === 0) return undefined;
	const dim = ensureOne(spread);
	return {
		dim,
		spread: shape[dim]
	};
}

export function vizSelectionToViz(
	vizSelection: VisualizationSelection,
	modelNode: ModelNode,
	key: Key[],
	shape: number[],
	vizId: string
): Visualization {
	switch (vizSelection.type) {
		case 'attention':
			return {
				vizType: {
					oneofKind: 'attentionViz',
					attentionViz: {
						id: vizId,
						modelNodeId: modelNode.id,
						keyPath: key,
						attentionXDim: ensureOne(vizSelection.attentionX),
						attentionYDim: ensureOne(vizSelection.attentionY),
						spread: getSpread(vizSelection.spread, shape),
						averageDims: vizSelection.average
					}
				}
			};
		case 'barGraph':
			return {
				vizType: {
					oneofKind: 'barGraphViz',
					barGraphViz: {
						id: vizId,
						modelNodeId: modelNode.id,
						keyPath: key,
						plotDimension: ensureOne(vizSelection.plotDimension),
						spread: getSpread(vizSelection.spread, shape),
						averageDims: vizSelection.average
					}
				}
			};
	}
}
