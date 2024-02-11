<script lang="ts">
	import { RadioGroup, RadioItem, getModalStore } from '@skeletonlabs/skeleton';
	import { count, keyPathToString } from '../lib/ai';
	import {
		getVizId,
		registerViz,
		selectedKey,
		selectedNode,
		selectedNumTokens,
		selectedShape
	} from '../lib/store';
	import { KeyOutline } from 'svelte-ionicons';
	import AttentionSelector from './AttentionSelector.svelte';
	import BarGraphSelector from './BarGraphSelector.svelte';
	import { vizSelectionToViz, type VisualizationSelection } from '../lib/viz';

	const modalStore = getModalStore();

	let vizType = 'attention';

	$: shape = $selectedShape;
	$: numTokens = $selectedNumTokens!;
	$: modelNode = $selectedNode!;
	$: key = $selectedKey;

	$: attentionValid = shape.length >= 2 && count(shape, numTokens) >= 2;

	$: {
		if (!attentionValid && vizType === 'attention') {
			vizType = 'bargraph';
		}
	}

	$: expandedShapes = shape.map<[number, number]>((x, i) => [x, i]);

	function addViz(viz: VisualizationSelection) {
		registerViz(vizSelectionToViz(viz, modelNode, key, shape, getVizId()));
		modalStore.close();
	}
</script>

<div class="card p-4 variant-glass-surface flex flex-col text-surface-900">
	<div class="font-bold uppercase text-sm mb-2">Visualizer</div>
	<div>
		<span class="pre !py-1 text-xs !px-2 inline-flex rounded"
			><KeyOutline size="16" /><span class="pl-1"
				>{modelNode.name} ({modelNode.classname}) — output.{keyPathToString(key)}</span
			></span
		>
	</div>
	<div class="my-4">
		<div class="font-bold uppercase text-sm -mb-1">Viz type</div>
		<RadioGroup>
			<RadioItem bind:group={vizType} name="justify" value="attention" disabled={!attentionValid}>
				<div class="font-mono mb-1">Attention</div>
				<div class="w-12 h-12 bg-surface-500 relative mx-auto border-4 border-surface-500">
					<div class="absolute w-1/3 h-1/3 left-0 top-2/3 rounded bg-surface-300"></div>
					<div class="absolute w-1/3 h-1/3 left-1/3 top-1/3 rounded bg-surface-300"></div>
					<div class="absolute w-1/3 h-1/3 left-2/3 top-0 rounded bg-surface-300"></div>
				</div>
			</RadioItem>
			<RadioItem bind:group={vizType} name="justify" value="bargraph">
				<div>
					<div class="font-mono mb-1">Bar graph<br />(not yet supported)</div>
					<div class="w-12 h-12 bg-surface-500 relative mx-auto border-4 border-surface-500">
						<div
							class="absolute w-1/3 h-2/3 left-0 top-1/3 rounded-t-sm border border-surface-500 bg-surface-300"
						></div>
						<div
							class="absolute w-1/3 h-1/3 left-1/3 top-2/3 rounded-t-sm border border-surface-500 bg-surface-300"
						></div>
						<div
							class="absolute w-1/3 h-full left-2/3 top-0 rounded-t-sm border border-surface-500 bg-surface-300"
						></div>
					</div>
				</div>
			</RadioItem>
		</RadioGroup>
	</div>

	{#if vizType === 'attention'}
		<AttentionSelector {expandedShapes} {numTokens} on:addViz={(e) => addViz(e.detail)} />
	{:else if vizType === 'bargraph'}
		<BarGraphSelector {expandedShapes} {numTokens} on:addViz={(e) => addViz(e.detail)} />
	{/if}
</div>
