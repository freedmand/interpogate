<script lang="ts">
	import { popup, Table, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getTokens } from '../lib/api';
	import type { TokenizeResponse_SuccessResponse } from '../lib/proto/interpogate';
	import { onMount } from 'svelte';
	import { normalizeToken } from '../lib/ai';
	import { createEventDispatcher } from 'svelte';

	export let value: string;
	export let placeholder = '';
	export let disabled = false;
	export let selectedTokenIndex: number;
	export let selectable = false;

	let textarea: HTMLTextAreaElement;
	export let tokenResponse: TokenizeResponse_SuccessResponse;

	const dispatch = createEventDispatcher();

	$: popupHovers = tokenResponse.tokens.map<PopupSettings>((_, i) => ({
		event: 'hover',
		target: `popupHover-${i}`,
		placement: 'top',
		middleware: {
			hide: {}
		}
	}));

	onMount(() => {
		changed();
	});

	function changed() {
		textarea.style.height = `0px`;
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	$: getTokens(value).then((response) => {
		tokenResponse = response;
	});
</script>

<textarea
	class="resize-none w-full p-2"
	bind:this={textarea}
	on:input={changed}
	bind:value
	{disabled}
	{placeholder}
	on:keydown={(e) => {
		if (e.code === 'Enter' && (e.ctrlKey || e.metaKey)) {
			dispatch('runForward');
		}
	}}
></textarea>
<div>
	{#each tokenResponse.tokens as token, i}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span
			on:click={() => (selectedTokenIndex = i)}
			class="chip variant-ghost whitespace-pre p-0.5 m-0.5 font-mono [&>*]:pointer-events-none"
			class:variant-ghost={!selectable || selectedTokenIndex !== i}
			class:variant-filled={selectable && selectedTokenIndex === i}
			use:popup={popupHovers[i]}>{token}</span
		>
		<div
			class="card variant-glass transition-none duration-0 text-sm border-tertiary-500"
			data-popup="popupHover-{i}"
		>
			<table class="table table-compact variant-glass font-mono border">
				<tbody>
					<tr class="my-0">
						<th class="px-2">ID</th>
						<td>{tokenResponse.tokenIds[i]}</td>
					</tr>
					<tr class="my-0">
						<th class="px-2">Token</th>
						<td><pre class="pre p-0.5 inline-block">{token}</pre></td>
					</tr>
					<tr class="my-0">
						<th class="px-2">_Token</th>
						<td
							><pre class="pre p-0.5 inline-block">{normalizeToken(
									tokenResponse.tokensSpecial[i]
								)}</pre></td
						>
					</tr>
				</tbody>
			</table>
		</div>
	{/each}
</div>
