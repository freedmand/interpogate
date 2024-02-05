<script lang="ts">
	export let num: number;
	export let dim: number;
	export let numTokens: number;
	export let selected = false;
</script>

<span
	class="chip variant-filled mx-1 flex flex-col !py-0.5"
	class:bg-secondary-800={selected}
	class:text-yellow-400={num === numTokens}
>
	<div class="align-middle">{num}</div>
	<div class="text-[10px] align-middle !mx-0 font-mono">DIM {dim}</div>
</span>
