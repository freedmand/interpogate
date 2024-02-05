import type { ElkLabel, ElkNode, LayoutOptions } from 'elkjs';
import type { ModelNode, Visualization, VisualizationMap } from './proto/interpogate';
import type { State } from './layer';
import type { Color } from '@deck.gl/core/typed';

export const ATTENTION_SIZE = 100;
export const ATTENTION_GAP = 25;

class GraphElkContext {
	constructor(
		public vizModelMap: VisualizationMap = { visualizationMap: {} },
		public nodeId = 0,
		public edgeId = 0,
		readonly idMap: { [key: string]: ModelNode } = {}
	) {}

	newNodeId(): string {
		return `n${this.nodeId++}`;
	}

	newEdgeId(): string {
		return `e${this.edgeId++}`;
	}
}

const FONT_SIZE = 11;

function getLabel(text: string): ElkLabel {
	return {
		text,
		width: text.length * FONT_SIZE,
		height: 2 * FONT_SIZE
	};
}

function nodeToElk(modelNode: ModelNode, prevNodes: ElkNode[], ctx: GraphElkContext): ElkNode {
	const nodeId = `${modelNode.id}`;
	const label = getLabel(`${modelNode.name} (${modelNode.classname})`);
	const elkNode: ElkNode = {
		id: nodeId,
		labels: [label],
		layoutOptions: getLayoutOptions(modelNode),
		width: label.width,
		height: label.height
	};
	if (prevNodes.length > 0) {
		elkNode.edges = prevNodes.map((prevNode) => ({
			id: ctx.newEdgeId(),
			sources: [prevNode.id],
			targets: [nodeId]
		}));
	}
	if (modelNode.children != null) {
		elkNode.children = sequentialNodesToElk(modelNode.children, ctx);
	}

	const visualizations = ctx.vizModelMap.visualizationMap[modelNode.id]?.visualizations;
	if (visualizations != null && visualizations.length > 0) {
		if (elkNode.children == null) {
			elkNode.children = [];
		}
		for (const visualization of visualizations) {
			if (visualization.vizType.oneofKind === 'attentionViz') {
				const viz = visualization.vizType.attentionViz;
				const spread = viz.spread?.spread ?? 1;
				elkNode.children.push({
					id: viz.id,
					width: ATTENTION_SIZE * spread + ATTENTION_GAP * (spread - 1),
					height: ATTENTION_SIZE
				});
			}
		}
	}

	ctx.idMap[elkNode.id] = modelNode;
	return elkNode;
}

function sequentialNodesToElk(modelNodes: ModelNode[], ctx: GraphElkContext): ElkNode[] {
	let prevNode: ElkNode | null = null;
	const children: ElkNode[] = [];
	for (const modelNode of modelNodes) {
		const childNode = nodeToElk(modelNode, prevNode ? [prevNode] : [], ctx);
		children.push(childNode);
		prevNode = childNode;
	}
	return children;
}

export function modelToElk(
	model: ModelNode,
	vizModelMap: VisualizationMap
): [ElkNode, { [key: string]: ModelNode }] {
	const ctx = new GraphElkContext(vizModelMap);
	return [
		{
			id: 'toplevel_root',
			children: [nodeToElk(model, [], ctx)],
			layoutOptions: {
				'elk.direction': 'DOWN',
				algorithm: 'layered',
				edgeRouting: 'ORTHOGONAL'
			}
		},
		ctx.idMap
	];
}

export interface TextObject {
	type: 'text';
	text: string;
	width: number;
	height: number;
	x: number;
	y: number;
}

export interface RectObject {
	type: 'rect';
	x: number;
	y: number;
	width: number;
	height: number;
	fill: Color;
	value: number;
	s_i: number;
	x_i: number;
	y_i: number;
}

export interface BoxObject {
	type: 'box';
	x: number;
	y: number;
	width: number;
	height: number;
	elkNode: ElkNode;
	layerState?: State;
	visualizations: Visualization[];
}

interface Point {
	x: number;
	y: number;
}

export interface EdgeObject {
	type: 'edge';
	points: Point[];
	sources: string[];
	targets: string[];
	layerState?: State;
}

export type DrawObject = TextObject | BoxObject | EdgeObject | RectObject;

function offsetPoint(point: Point, xOffset: number, yOffset: number): Point {
	return {
		x: point.x + xOffset,
		y: point.y + yOffset
	};
}

export function renderedElkToDrawObjects(
	renderedElk: ElkNode,
	root = true,
	objects: DrawObject[] = [],
	xOffset = 0,
	yOffset = 0
): DrawObject[] {
	const x = renderedElk.x ?? 0;
	const y = renderedElk.y ?? 0;

	if (!root) {
		for (const label of renderedElk.labels ?? []) {
			if (
				label.text != null &&
				label.width != null &&
				label.height != null &&
				label.x != null &&
				label.y != null
			) {
				// Push label object
				objects.push({
					type: 'text',
					text: label.text,
					width: label.width,
					height: label.height,
					x: xOffset + x + label.x,
					y: yOffset + y + label.y
				});
			}
		}

		if (
			renderedElk.x != null &&
			renderedElk.y != null &&
			renderedElk.width != null &&
			renderedElk.height != null
		) {
			// Push box object
			objects.push({
				type: 'box',
				x: xOffset + x,
				y: yOffset + y,
				width: renderedElk.width,
				height: renderedElk.height,
				elkNode: renderedElk,
				visualizations: []
			});
		}
	}

	for (const edge of renderedElk.edges ?? []) {
		for (const section of edge.sections ?? []) {
			objects.push({
				type: 'edge',
				points: [
					offsetPoint(section.startPoint, xOffset, yOffset),
					...(section.bendPoints ?? []).map((point) => offsetPoint(point, xOffset, yOffset)),
					offsetPoint(section.endPoint, xOffset, yOffset)
				],
				sources: edge.sources,
				targets: edge.targets
			});
		}
	}

	for (const child of renderedElk.children ?? []) {
		renderedElkToDrawObjects(child, false, objects, xOffset + x, yOffset + y);
	}

	return objects;
}

export function getLayoutOptions(modelNode: ModelNode): LayoutOptions {
	const options: LayoutOptions = {
		'nodeLabels.placement': '[H_CENTER, V_TOP, INSIDE]',
		'elk.padding': '[top=4.0,left=5.0,bottom=4.0,right=5.0]',
		contentAlignment: '[V_TOP, H_LEFT]'
	};
	if (modelNode.classname === 'ModuleList') {
		options['elk.direction'] = 'RIGHT';
		options['wrapping.strategy'] = 'SINGLE_EDGE';
		options['aspectRatio'] = `${(1 + Math.sqrt(5)) / 2}`; // golden ratio
	} else {
		options['elk.direction'] = 'DOWN';
	}
	return options;
}
