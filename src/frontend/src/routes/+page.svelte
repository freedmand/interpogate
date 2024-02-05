<script lang="ts">
	import { COORDINATE_SYSTEM, Deck, OrthographicView } from '@deck.gl/core/typed';
	import Elk from 'elkjs/lib/elk.bundled';
	import { onDestroy, onMount } from 'svelte';
	import {
		modelToElk,
		renderedElkToDrawObjects,
		type BoxObject,
		type DrawObject,
		type RectObject
	} from '../lib/graph';
	import { ModelLayer } from '../lib/layer';
	import { extractModelGraph, getVocab } from '../lib/api';
	import App from '../components/App.svelte';
	import { calculateZoomFitViewState, getBounds } from '../lib/geo';
	import { forwardPassMeta, modelNode, vizMap, vizModelMap, vizResponses } from '../lib/store';
	import type { ModelNode, VisualizationMap } from '../lib/proto/interpogate';
	import { get } from 'svelte/store';

	let canvasElem: HTMLDivElement;

	let modelLayer: ModelLayer | null = null;
	let deckgl: Deck | null = null;
	let vocab: string[] | null = null;
	let drawObjects: DrawObject[];

	let screenWidth: number;
	let screenHeight: number;

	onMount(async () => {
		deckgl = new Deck({
			parent: canvasElem,
			width: '100%',
			height: '100%',
			initialViewState: {
				coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
				target: [0, 0],
				zoom: 1
			},
			layers: [],
			views: new OrthographicView({}),
			controller: { keyboard: false, doubleClickZoom: false },
			getTooltip: (info) => {
				if (modelLayer?.lockedSelection) return null;
				const object: BoxObject | RectObject | null = info.object;
				if (object != null && modelLayer != null) {
					if (object.type === 'box') {
						modelLayer.selectedModelNode = modelLayer.modelIdMap[object.elkNode.id];
						modelLayer.selectedElkNode = object.elkNode;
					} else {
						// Viz box
						const fp = get(forwardPassMeta);
						if (fp != null) {
							const tokens = fp.tokenizeResponse.tokens;
							return `x token: ${tokens[object.x_i]}\ny token: ${tokens[object.y_i]}\nvalue: ${object.value.toFixed(2)}`;
						}
					}
				} else if (modelLayer != null) {
					modelLayer.selectedModelNode = null;
					modelLayer.selectedElkNode = null;
				}
				return null;
			},
			onClick: (info) => {
				if (modelLayer == null || !modelLayer.selectMode) {
					return;
				}
				const object: BoxObject | RectObject | null = info.object;
				if (object != null) {
					if (object.type === 'box') {
						if (object.elkNode.id !== modelLayer.selectedElkNode?.id) {
							modelLayer.selectedModelNode = modelLayer.modelIdMap[object.elkNode.id];
							modelLayer.selectedElkNode = object.elkNode;
						}
						modelLayer.lockedSelection = !modelLayer.lockedSelection;
					}
				} else {
					modelLayer.selectedModelNode = null;
					modelLayer.selectedElkNode = null;
					modelLayer.lockedSelection = false;
				}
			}
		});

		vocab = await getVocab();

		const modelResponse = await extractModelGraph();
		modelNode.set(modelResponse.modelNode!);
	});

	onDestroy(() => {
		if (deckgl != null) {
			deckgl.finalize();
		}
	});

	$: node = $modelNode;

	async function updateDeck(deck: Deck, node: ModelNode, vizModelNodeMap: VisualizationMap) {
		const elk = new Elk({});
		const [elkModel, modelIdMap] = modelToElk(node, vizModelNodeMap);
		const renderedElk = await elk.layout(elkModel);
		drawObjects = renderedElkToDrawObjects(renderedElk);
		modelLayer = new ModelLayer('model', drawObjects, modelIdMap);

		let newViewState: any = {};
		const bounds = getBounds(drawObjects);
		if (bounds.xMin != null && bounds.xMax != null && bounds.yMin != null && bounds.yMax != null) {
			newViewState = calculateZoomFitViewState(
				bounds.xMin,
				bounds.xMax,
				bounds.yMin,
				bounds.yMax,
				screenWidth,
				screenHeight
			);
		}

		deck.setProps({
			initialViewState: {
				...newViewState
			}
		});
	}

	$: vizModelNodeMap = $vizModelMap;
	$: vizResponseList = $vizResponses;
	$: vizDict = $vizMap;

	$: {
		if (modelLayer != null) {
			modelLayer.vizModelMap = vizModelNodeMap;
			modelLayer.vizResponses = vizResponseList;
			modelLayer.vizMap = vizDict;
		}
	}

	$: {
		if (deckgl != null && node != null) {
			updateDeck(deckgl, node, vizModelNodeMap);
		}
	}

	$: {
		if (modelLayer != null && deckgl != null) {
			// Trigger updates
			deckgl.setProps({ layers: modelLayer.renderLayers() });
		}
	}

	let zoomUpdate = 0;

	function zoomFit() {
		if (deckgl == null) return;
		const bounds = getBounds(drawObjects);
		if (bounds.xMin != null && bounds.xMax != null && bounds.yMin != null && bounds.yMax != null) {
			deckgl.setProps({
				initialViewState: {
					...calculateZoomFitViewState(
						bounds.xMin,
						bounds.xMax,
						bounds.yMin,
						bounds.yMax,
						screenWidth,
						screenHeight
					),
					transitionDuration: 200,
					forceUpdate: zoomUpdate++ // used to force a state change with deck's differ
				}
			});
		}
	}
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

{#if modelLayer != null && deckgl != null && vocab != null}
	<App {modelLayer} {deckgl} {vocab} on:zoomFit={zoomFit} />
{/if}

<div class="canvas" bind:this={canvasElem} />
