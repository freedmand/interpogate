<script lang="ts">
	import { Table, tableMapperValues, type TableSource } from '@skeletonlabs/skeleton';
	import { normalizeToken, type LogitProb } from '../lib/ai';

	export let logitProbs: LogitProb[];

	$: table = {
		head: ['token', 'prob', 'logit', 'index'],
		body: tableMapperValues(
			logitProbs.slice(0, 6).map((x) => ({
				token: normalizeToken(x.token),
				prob: `${(x.prob * 100).toFixed(2)}%`,
				logit: x.logit.toFixed(2),
				position: x.position
			})),
			['token', 'prob', 'logit', 'position']
		)
	};
</script>

<div class="mt-4 border border-tertiary-500 font-mono">
	<Table source={table} regionBody="variant-filled" regionHead="bg-surface-500 text-sm" />
</div>
