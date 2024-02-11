<script lang="ts">
	import type { Deck } from '@deck.gl/core/typed';
	import type { ModelLayer } from '../lib/layer';
	import { getTokens, runModelForward, standalone } from '../lib/api';
	import Textarea from './Textarea.svelte';
	import type { Key, TokenizeResponse_SuccessResponse } from '../lib/proto/interpogate';
	import { type NdArray } from 'ndarray';

	import ChatbubbleEllipsesOutline from 'svelte-ionicons/ChatboxEllipsesOutline.svelte';
	import ColorWandOutline from 'svelte-ionicons/ColorWandOutline.svelte';
	import ContractOutline from 'svelte-ionicons/ContractOutline.svelte';
	import ModelResponse from './ModelResponse.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		addVizResponse,
		clearVizResponses,
		forwardPassMeta,
		selectedKey,
		selectedNode,
		selectedNumTokens,
		selectedShape,
		startForwardPass,
		updateInputShape,
		updateOutputShape,
		vizModelMap
	} from '../lib/store';
	import Shape from './Shape.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { loadNpy } from '../lib/ai';

	export let modelLayer: ModelLayer;
	export let deckgl: Deck;
	export let vocab: string[];

	const dispatch = createEventDispatcher();

	type PaneType = 'none' | 'forward' | 'select';
	let pane: PaneType = 'none';

	let modelResponse: NdArray<any> | null = null;
	let selectedTokenIndex = 0;

	function togglePane(paneType: PaneType) {
		if (pane === paneType) {
			pane = 'none';
		} else {
			pane = paneType;
		}
	}

	let value = '';
	let tokenResponse: TokenizeResponse_SuccessResponse = {
		tokenIds: [],
		tokens: [],
		tokensSpecial: []
	};

	let runningForwardPass = false;

	$: vizModelNodeMap = $vizModelMap;

	onMount(async () => {
		if (!standalone) {
			// Get token ids (text doesn't matter since preloaded)
			tokenResponse = (await getTokens('')) ?? {
				tokenIds: [],
				tokens: [],
				tokensSpecial: []
			};
			// Preload forward pass
			forwardPass(tokenResponse);
		}
	});

	export async function forwardPass(tokenResponse: TokenizeResponse_SuccessResponse) {
		if (runningForwardPass) return;

		runningForwardPass = true;
		try {
			// Reset viz
			clearVizResponses();
			modelLayer.layerStates = {};
			deckgl.setProps({ layers: modelLayer.renderLayers() });
			startForwardPass(tokenResponse);

			const startTime = Date.now();
			for await (const response of runModelForward(tokenResponse.tokenIds, vizModelNodeMap)) {
				switch (response.response.oneofKind) {
					case 'preHookResponse':
						modelLayer.layerStates[response.response.preHookResponse.id] = 'running';
						deckgl.setProps({ layers: modelLayer.renderLayers() });
						updateInputShape(
							response.response.preHookResponse.id,
							response.response.preHookResponse.inputShape!
						);
						break;
					case 'postHookResponse':
						const vizResponses = response.response.postHookResponse.visualizationResponses;
						for (const vizResponse of vizResponses) {
							addVizResponse(vizResponse.visualizationId, loadNpy(vizResponse.output));
						}
						modelLayer.layerStates[response.response.postHookResponse.id] = 'complete';
						deckgl.setProps({ layers: modelLayer.renderLayers() });
						updateInputShape(
							response.response.postHookResponse.id,
							response.response.postHookResponse.inputShape!
						);
						updateOutputShape(
							response.response.postHookResponse.id,
							response.response.postHookResponse.outputShape!
						);
						break;
					case 'doneResponse':
						selectedTokenIndex = tokenResponse.tokens.length - 1;
						modelResponse = loadNpy(response.response.doneResponse.output);
						break;
				}
			}
			const endTime = Date.now();
			console.log(`Operation took ${endTime - startTime} seconds`);
		} finally {
			runningForwardPass = false;
		}
	}

	const vizModal: ModalSettings = {
		type: 'component',
		component: 'vizSelectorModal'
	};
	const hookModal: ModalSettings = {
		type: 'component',
		component: 'hookModal'
	};

	const modalStore = getModalStore();
	function showModalVizSelector(detail: { key: Key[]; shape: number[] }) {
		selectedNumTokens.set(forwardInfo?.tokenizeResponse.tokenIds.length ?? null);
		selectedNode.set(modelLayer.selectedModelNode);
		selectedKey.set(detail.key);
		selectedShape.set(detail.shape);
		modalStore.trigger(vizModal);
	}

	function showModalHook() {
		selectedNode.set(modelLayer.selectedModelNode);
		modalStore.trigger(hookModal);
	}

	$: {
		// Ensure select mode is passed through
		modelLayer.selectMode = pane === 'select';
	}

	$: forwardInfo = $forwardPassMeta;
</script>

{#if standalone}
	<h3 class="h3 absolute font-mono left-4 top-3 pointer-events-none">
		<span
			class="bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent box-decoration-clone pointer-events-none select-none"
			>interpogate</span
		>
	</h3>
{/if}

<div
	class="absolute pl-4 bottom-8 z-10 pointer-events-none"
	class:top-16={standalone}
	class:top-4={!standalone}
>
	<div class="flex flex-col max-h-full pointer-events-none [&>*]:pointer-events-auto">
		<div>
			{#if standalone || tokenResponse.tokens.length > 0}
				<button
					type="button"
					class="mb-4 mr-2 btn-icon backdrop-blur-sm [&>*]:outline-none"
					class:variant-ghost-tertiary={pane !== 'forward'}
					class:variant-filled-tertiary={pane === 'forward'}
					on:click={() => togglePane('forward')}
				>
					<ChatbubbleEllipsesOutline />
				</button>
			{/if}
			<button
				type="button"
				class="mb-4 mr-2 btn-icon backdrop-blur-sm [&>*]:outline-none"
				class:variant-ghost-secondary={pane !== 'select'}
				class:variant-filled-secondary={pane === 'select'}
				on:click={() => {
					if (pane === 'select') {
						modelLayer.lockedSelection = false;
						modelLayer.selectedModelNode = null;
						modelLayer.selectedElkNode = null;
					}
					togglePane('select');
				}}
			>
				<ColorWandOutline />
			</button>
			<button
				type="button"
				class="mb-4 mr-2 btn-icon backdrop-blur-sm [&>*]:outline-none variant-outline"
				on:click={() => dispatch('zoomFit')}
			>
				<ContractOutline />
			</button>
		</div>
		{#if pane === 'forward'}
			<div class="card p-4 w-96 variant-ghost-tertiary backdrop-blur-sm min-h-0 overflow-y-auto">
				{#if standalone}
					<button
						disabled={runningForwardPass}
						class="btn variant-filled mb-2"
						on:click={() => forwardPass(tokenResponse)}>Forward pass</button
					>
				{/if}
				<Textarea
					disabled={runningForwardPass}
					bind:value
					placeholder="Enter text here..."
					bind:tokenResponse
					bind:selectedTokenIndex
					selectable={modelResponse != null}
					on:runForward={() => forwardPass(tokenResponse)}
				/>
				{#if modelResponse != null}
					<ModelResponse {modelResponse} {vocab} {selectedTokenIndex} />
				{/if}
			</div>
		{:else if pane === 'select' && modelLayer.selectedModelNode != null}
			<div
				class="card p-4 w-96 variant-ghost-secondary backdrop-blur-sm overflow-y-auto {modelLayer.lockedSelection
					? ''
					: '!pointer-events-none'}"
			>
				<table class="table table-hover text-sm mt-4">
					<tbody>
						<tr>
							<th class="font-bold text-left px-4">Selected layer</th>
							<td>{modelLayer.selectedModelNode.name}</td>
						</tr>
						<tr>
							<th class="font-bold text-left px-4">Path</th>
							<td
								class="font-mono cursor-pointer"
								on:click={(e) => {
									showModalHook();
								}}>{modelLayer.selectedModelNode.path}</td
							>
						</tr>
						<tr>
							<th class="font-bold text-left px-4">Class name</th>
							<td>{modelLayer.selectedModelNode.classname}</td>
						</tr>
						{#if modelLayer.selectedModelNode.inFeatures != null}
							<tr>
								<th class="font-bold text-left px-4"># input features</th>
								<td>{modelLayer.selectedModelNode.inFeatures}</td>
							</tr>
						{/if}
						{#if modelLayer.selectedModelNode.outFeatures != null}
							<tr>
								<th class="font-bold text-left px-4"># output features</th>
								<td>{modelLayer.selectedModelNode.outFeatures}</td>
							</tr>
						{/if}
						{#if modelLayer.selectedModelNode.params.length > 0}
							{#each modelLayer.selectedModelNode.params as param}
								<tr class="!variant-filled">
									<th class="font-bold text-left px-4">Param: {param.name}</th>
									<td>{param.shape?.shape.join(' × ')} ({param.dtype.replace('torch.', '')})</td>
								</tr>
							{/each}
						{/if}
						{#if forwardInfo != null}
							{@const inputShape =
								forwardInfo.nodeShapes[modelLayer.selectedModelNode.id]?.inputShape}
							{@const outputShape =
								forwardInfo.nodeShapes[modelLayer.selectedModelNode.id]?.outputShape}
							{#if inputShape != null}
								<tr class="!bg-slate-600 text-white">
									<th class="font-bold text-left px-4">Input</th>
									<td class="w-full"
										><Shape
											shape={inputShape}
											numTokens={forwardInfo.tokenizeResponse.tokenIds.length}
										/></td
									>
								</tr>
							{/if}
							{#if outputShape != null}
								<tr class="!bg-slate-600 text-white">
									<th class="font-bold text-left px-4"
										>Output
										{#if modelLayer.lockedSelection}
											{#if standalone}
												<span class="text-xs font-normal opacity-50 italic leading-3 inline-block"
													>click on a shape to add a viz</span
												>
											{/if}
										{/if}
									</th>
									<td class="w-full"
										><Shape
											shape={outputShape}
											numTokens={forwardInfo.tokenizeResponse.tokenIds.length}
											on:click={(e) => {
												if (standalone) {
													showModalVizSelector(e.detail);
												}
											}}
										/></td
									>
								</tr>
							{/if}
						{/if}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
