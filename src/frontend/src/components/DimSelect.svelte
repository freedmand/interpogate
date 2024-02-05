<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import Dim from './Dim.svelte';

	export let shapes: [number, number][];
	export let numTokens: number;

	export let selected: number[] = [];
</script>

<ListBox multiple padding="px-0">
	<div class="flex">
		{#each shapes as [num, dim]}
			<ListBoxItem bind:group={selected} name="group" value={dim} active="false">
				<Dim {num} {dim} {numTokens} selected={selected.includes(dim)} />
			</ListBoxItem>
		{/each}
	</div>
</ListBox>
