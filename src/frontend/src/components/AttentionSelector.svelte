<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getDims, getSelected } from '../lib/switch';
	import DimSelect from './DimSelect.svelte';

	export let expandedShapes: [number, number][];
	export let numTokens: number;

	const dispatch = createEventDispatcher();

	$: attentionX =
		getDims(attentionXSelected, 1, expandedShapes) ??
		expandedShapes.filter(
			([num, dim]) =>
				num === numTokens && !getSelected(dim, attentionYSelected, spreadSelected, averageSelected)
		);
	$: attentionY =
		getDims(attentionYSelected, 1, expandedShapes) ??
		expandedShapes.filter(
			([num, dim]) =>
				num === numTokens && !getSelected(dim, attentionXSelected, spreadSelected, averageSelected)
		);
	$: spread =
		getDims(spreadSelected, 1, expandedShapes) ??
		expandedShapes.filter(
			([_, dim]) => !getSelected(dim, attentionXSelected, attentionYSelected, averageSelected)
		);
	$: average = expandedShapes.filter(
		([_, dim]) => !getSelected(dim, attentionXSelected, attentionYSelected, spreadSelected)
	);

	let attentionXSelected: number[] = [];
	let attentionYSelected: number[] = [];
	let spreadSelected: number[] = [];
	let averageSelected: number[] = [];

	$: valid = attentionX.length === 1 && attentionY.length === 1 && spread.length <= 1;
</script>

<div class="font-bold uppercase text-sm mb-2">Attention x</div>
<div class="flex">
	<DimSelect bind:selected={attentionXSelected} shapes={attentionX} {numTokens} />
</div>
<div class="font-bold uppercase text-sm mb-2 mt-4">Attention y</div>
<div class="flex">
	<DimSelect bind:selected={attentionYSelected} shapes={attentionY} {numTokens} />
</div>
<div class="font-bold uppercase text-sm mb-2 mt-4">Spread dimension (optional)</div>
<div class="flex">
	<DimSelect bind:selected={spreadSelected} shapes={spread} {numTokens} />
</div>
<div class="font-bold uppercase text-sm mb-2 mt-4">Average dimensions (remaning)</div>
<div class="flex">
	<DimSelect bind:selected={averageSelected} shapes={average} {numTokens} />
</div>
<button
	disabled={!valid}
	type="button"
	class="btn mt-4"
	class:variant-filled={!valid}
	class:variant-filled-success={valid}
	on:click={() =>
		dispatch('addViz', {
			type: 'attention',
			attentionX: attentionX.map((x) => x[1]),
			attentionY: attentionY.map((x) => x[1]),
			spread: spread.map((x) => x[1]),
			average: average.map((x) => x[1])
		})}>Add visualization</button
>
