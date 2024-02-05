<script lang="ts">
	import type { NdArray } from 'ndarray';
	import { sortedSoftmax, type LogitProb } from '../lib/ai';
	import ModelResults from './ModelResults.svelte';

	export let modelResponse: NdArray<any>;
	export let vocab: string[];

	export let selectedTokenIndex: number;

	function getSortedSoftmax(index: number): LogitProb[] {
		return sortedSoftmax(
			Array.from(new Array(modelResponse.shape[2])).map(
				(_, i) => modelResponse.get(0, index, i) as number
			),
			vocab
		);
	}
</script>

<ModelResults logitProbs={getSortedSoftmax(selectedTokenIndex)} />
