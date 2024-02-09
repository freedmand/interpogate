import { CompositeLayer, type Color, type LayersList, type Position } from '@deck.gl/core/typed';
import {
	ATTENTION_GAP,
	ATTENTION_SIZE,
	type BoxObject,
	type DrawObject,
	type EdgeObject,
	type RectObject,
	type TextObject
} from './graph';
import { PathLayer, PolygonLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers/typed';
import type { ModelNode, Visualization, VisualizationMap } from './proto/interpogate';
import type { ElkNode } from 'elkjs';
import type { VizResponse } from './ai';

export type State = 'clear' | 'running' | 'complete';

const STATE_PRIORITY: { [key in State]: number } = {
	clear: 0,
	running: 1,
	complete: 2
};

export interface Bezier {
	s: Position;
	c: Position;
	e: Position;
	angles: [number, number, number];
}

function colorClamp(value: number): number {
	return Math.min(Math.max(Math.round(value), 0), 255);
}

const COMPONENT_MULTIPLIER = [0.5, 0.6, 1.4, 1.2];

export function selectedColor(selected: boolean, color: Color): Color {
	if (!selected) return color;
	return color.map((x, i) => colorClamp(x * COMPONENT_MULTIPLIER[i])) as Color;
}

const EDGE_COLORS: { [key in State]: Color } = {
	running: [100, 100, 240, 200], // purple
	complete: [100, 140, 100, 200], // green
	clear: [100, 100, 100, 200] // gray
};

const ARROW_COLORS: { [key in State]: Color } = {
	running: [100, 100, 240, 255], // purple
	complete: [100, 140, 100, 255], // green
	clear: [100, 100, 100, 255] // gray
};

const FILL_COLORS: { [key in State]: Color } = {
	running: [160, 160, 200, 50], // purple
	complete: [160, 200, 160, 50], // green
	clear: [160, 160, 160, 50] // gray
};

const TEXT_OFFSET_X = 0;
const TEXT_OFFSET_Y = -4;
const ARROW_SIZE = 9;
const ARROW_ANGLE_OFFSET = Math.PI;
const ARROW_ANGLE = 35;

export class ModelLayer extends CompositeLayer {
	constructor(
		readonly id: string,
		readonly drawObjects: DrawObject[],
		readonly modelIdMap: { [key: string]: ModelNode },
		public layerStates: { [id: string]: State } = {},
		public selectedModelNode: ModelNode | null = null,
		public selectedElkNode: ElkNode | null = null,
		public selectMode = false,
		public lockedSelection = false,
		public vizResponses: VizResponse[] = [],
		public vizModelMap: VisualizationMap = { visualizationMap: {} },
		public vizMap: { [vizId: string]: Visualization } = {}
	) {
		super({ id });
	}

	getEdgeLayerState(edgeObject: EdgeObject): State {
		const layerStates = [...edgeObject.sources, ...edgeObject.targets].map<[State, number]>((x) => {
			const layerState = this.layerStates[this.modelIdMap[x].id] ?? 'clear';
			const priority = STATE_PRIORITY[layerState];
			return [layerState, priority];
		});
		if (layerStates.length === 0) return 'clear';
		return layerStates.sort((a, b) => a[1] - b[1])[0][0];
	}

	renderLayers(): LayersList {
		const textObjects: TextObject[] = this.drawObjects.filter<TextObject>(
			(x): x is TextObject => x.type === 'text'
		);
		const boxObjects: BoxObject[] = this.drawObjects
			.filter((x): x is BoxObject => x.type === 'box')
			.map((boxObject) => ({
				...boxObject,
				layerState: this.layerStates?.[this.modelIdMap[boxObject.elkNode.id]?.id] ?? 'clear',
				visualizations:
					this.vizModelMap.visualizationMap?.[boxObject.elkNode.id]?.visualizations ?? []
			}));
		const edgeObjects: EdgeObject[] = this.drawObjects
			.filter((x): x is EdgeObject => x.type === 'edge')
			.map((edgeObject) => ({
				...edgeObject,
				layerState: this.getEdgeLayerState(edgeObject)
			}));

		// Build box object mapping
		const visualizationBoxObjectMap: { [vizId: string]: BoxObject } = {};
		for (const boxObject of boxObjects) {
			if (this.vizMap[boxObject.elkNode.id]) {
				visualizationBoxObjectMap[boxObject.elkNode.id] = boxObject;
			}
		}
		const vizRects: RectObject[] = [];
		for (const vizResponse of this.vizResponses) {
			// Draw attention viz
			const box = visualizationBoxObjectMap[vizResponse.visualizationId];
			if (box == null) {
				throw new Error(`Expected box to be non-null for ${vizResponse}`);
			}
			const data = vizResponse.data;
			for (let stride = 0; stride < data.shape[0]; stride++) {
				for (let x = 0; x < data.shape[1]; x++) {
					for (let y = 0; y < data.shape[2]; y++) {
						const value = data.get(stride, x, data.shape[2] - y - 1) as number;
						vizRects.push({
							type: 'rect',
							x:
								box.x +
								stride * (ATTENTION_SIZE + ATTENTION_GAP) +
								(x * ATTENTION_SIZE) / data.shape[1],
							y: box.y + (y * ATTENTION_SIZE) / data.shape[2],
							width: ATTENTION_SIZE / data.shape[1],
							height: ATTENTION_SIZE / data.shape[2],
							fill: [
								255 - Math.floor(255 * value),
								255 - Math.floor(100 * value),
								255 - Math.floor(255 * value),
								255
							],
							value,
							s_i: stride,
							x_i: x,
							y_i: data.shape[2] - y - 1
						});
					}
				}
			}
		}

		return [
			new PolygonLayer({
				id: `${this.id}_box`,
				data: boxObjects,
				pickable: true,
				// onHover: (info) => console.log(info),
				getWidth: 1,
				lineWidthMinPixels: 1,
				getPolygon: (d: BoxObject) => [
					// Boxes
					[d.x, d.y],
					[d.x + d.width, d.y],
					[d.x + d.width, d.y + d.height],
					[d.x, d.y + d.height],
					[d.x, d.y]
				],
				getLineColor: (d: BoxObject) =>
					selectedColor(
						this.selectMode && this.selectedElkNode?.id === d.elkNode.id,
						EDGE_COLORS[d.layerState ?? 'clear']
					),
				getFillColor: (d: BoxObject) =>
					selectedColor(
						this.selectMode && this.selectedElkNode?.id === d.elkNode.id,
						FILL_COLORS[d.layerState ?? 'clear']
					)
			}),
			// Viz rects
			new PolygonLayer({
				id: `${this.id}_vizrects`,
				data: vizRects,
				pickable: true,
				getWidth: 0,
				getPolygon: (d: RectObject) => [
					// Boxes
					[d.x, d.y],
					[d.x + d.width, d.y],
					[d.x + d.width, d.y + d.height],
					[d.x, d.y + d.height],
					[d.x, d.y]
				],
				getFillColor: (d: RectObject) => d.fill
			}),
			new PathLayer({
				// Arrow lines
				id: `${this.id}_arrowline`,
				data: edgeObjects,
				getWidth: 1,
				getPath: (d: EdgeObject) => d.points.map<[number, number]>((point) => [point.x, point.y]),
				getColor: (d: EdgeObject) => ARROW_COLORS[d.layerState ?? 'clear']
			}),
			new SolidPolygonLayer({
				// Arrow heads
				id: `${this.id}_arrowhead`,
				data: edgeObjects,
				getWidth: 1,
				getPolygon: (d: EdgeObject) => {
					if (d.points.length < 2) return [];
					const penultimatePoint = d.points[d.points.length - 2];
					const lastPoint = d.points[d.points.length - 1];

					const angle = Math.atan(
						(lastPoint.y - penultimatePoint.y) / (lastPoint.x - penultimatePoint.x)
					);

					// Draw arrow
					return [
						[lastPoint.x, lastPoint.y],
						[
							lastPoint.x +
								ARROW_SIZE * Math.cos((ARROW_ANGLE * Math.PI) / 180 + angle + ARROW_ANGLE_OFFSET),
							lastPoint.y +
								ARROW_SIZE * Math.sin((ARROW_ANGLE * Math.PI) / 180 + angle + ARROW_ANGLE_OFFSET)
						],
						[
							lastPoint.x +
								ARROW_SIZE * Math.cos((-ARROW_ANGLE * Math.PI) / 180 + angle + ARROW_ANGLE_OFFSET),
							lastPoint.y +
								ARROW_SIZE * Math.sin((-ARROW_ANGLE * Math.PI) / 180 + angle + ARROW_ANGLE_OFFSET)
						],
						[lastPoint.x, lastPoint.y]
					];
				},
				getFillColor: (d: EdgeObject) => ARROW_COLORS[d.layerState ?? 'clear']
			}),
			new TextLayer({
				// Labels
				id: `${this.id}_label`,
				data: textObjects,
				getSize: 12,
				getPosition: (d: TextObject) => [
					d.x + d.width / 2 + TEXT_OFFSET_X,
					d.y + d.height / 2 + TEXT_OFFSET_Y
				],
				getText: (d: TextObject) => d.text,
				sizeUnits: 'meters',
				fontFamily: 'Berkeley Mono, Berkeley Mono Trial, monospace'
			})
		];
	}
}
