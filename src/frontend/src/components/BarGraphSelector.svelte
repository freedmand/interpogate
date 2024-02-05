<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getDims, getSelected } from '../lib/switch';
	import DimSelect from './DimSelect.svelte';

	const dispatch = createEventDispatcher();

	export let expandedShapes: [number, number][];
	export let numTokens: number;

	$: plotDimension =
		getDims(plotDimensionSelected, 1, expandedShapes) ??
		expandedShapes.filter(
			([num, dim]) => num === numTokens && !getSelected(dim, spreadSelected, averageSelected)
		);
	$: spread =
		getDims(spreadSelected, 1, expandedShapes) ??
		expandedShapes.filter(([_, dim]) => !getSelected(dim, plotDimensionSelected, averageSelected));
	$: average = expandedShapes.filter(
		([_, dim]) => !getSelected(dim, plotDimensionSelected, spreadSelected)
	);

	let plotDimensionSelected: number[] = [];
	let spreadSelected: number[] = [];
	let averageSelected: number[] = [];

	$: valid = plotDimension.length === 1 && spread.length <= 1;
</script>

<div class="font-bold uppercase text-sm mb-2">Plot dimension</div>
<div class="flex">
	<DimSelect bind:selected={plotDimensionSelected} shapes={plotDimension} {numTokens} />
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
			type: 'barGraph',
			plotDimension: plotDimension.map((x) => x[1]),
			spread: spread.map((x) => x[1]),
			average: average.map((x) => x[1])
		})}>Add visualization</button
>
