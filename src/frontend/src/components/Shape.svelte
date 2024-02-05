<script lang="ts">
	import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
	import { Key, type ComplexShape } from '../lib/proto/interpogate';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let shape: ComplexShape;
	export let numTokens: number;
	export let key: Key[] = [];
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if shape.shapeType.oneofKind === 'classShape'}
	<TreeView padding="py-1 px-2" regionChildren="border-l border-l-4 pl-2" open={true}>
		{#each Object.entries(shape.shapeType.classShape.mapShape) as entry}
			<TreeViewItem>
				<span class="pre py-0 text-sm bg-transparent px-0 -ml-2">{entry[0]}</span>
				<svelte:fragment slot="children">
					<svelte:self
						shape={entry[1]}
						{numTokens}
						on:click
						key={[
							...key,
							{
								keyType: {
									oneofKind: 'classKey',
									classKey: entry[0]
								}
							}
						]}
					/>
				</svelte:fragment>
			</TreeViewItem>
		{/each}
	</TreeView>
{:else if shape.shapeType.oneofKind === 'dictShape'}
	<TreeView padding="py-1 px-2" regionChildren="border-l border-l-4 pl-2" open={true}>
		{#each Object.entries(shape.shapeType.dictShape.mapShape) as entry}
			<TreeViewItem>
				<span class="pre py-0 text-sm bg-transparent px-0 -ml-2">“{entry[0]}”</span>
				<svelte:fragment slot="children">
					<svelte:self
						shape={entry[1]}
						{numTokens}
						on:click
						key={[
							...key,
							{
								keyType: {
									oneofKind: 'dictKey',
									dictKey: entry[0]
								}
							}
						]}
					/>
				</svelte:fragment>
			</TreeViewItem>
		{/each}
	</TreeView>
{:else if shape.shapeType.oneofKind === 'listShape'}
	{#if shape.shapeType.listShape.listShape.length === 0}
		<span class="font-mono bg-surface-900 px-2 italic text-gray-400">empty list...</span>
	{:else}
		<div class="table-container">
			<table class="table variant-filled">
				<tbody>
					{#each shape.shapeType.listShape.listShape as child, i}
						<tr>
							<th class="!py-0 font-mono pl-4 bg-tertiary-800 text-xs">{i}.</th>
							<td class="!py-0 !pl-1"
								><svelte:self
									shape={child}
									{numTokens}
									on:click
									key={[
										...key,
										{
											keyType: {
												oneofKind: 'listKey',
												listKey: i
											}
										}
									]}
								/></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
{:else if shape.shapeType.oneofKind === 'shape'}
	{@const actualShape = shape.shapeType.shape.shape}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		class="font-mono px-2 cursor-pointer"
		on:click={() => dispatch('click', { key, shape: actualShape })}
	>
		{#each actualShape as num, i}
			<span class:text-yellow-400={num === numTokens}>{num}</span
			>{#if i !== shape.shapeType.shape.shape.length - 1}<span class="text-xs px-1">×</span>{/if}
		{/each}
	</span>
{:else if shape.shapeType.oneofKind === 'type'}
	<span class="font-mono px-2">{shape.shapeType.type}</span>
{/if}
