<script lang="ts">
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		storePopup,
		initializeStores,
		Modal,
		AppShell,
		type ModalComponent,
		storeHighlightJs
	} from '@skeletonlabs/skeleton';
	import VizSelector from '../components/VizSelector.svelte';
	import Hook from '../components/Hook.svelte';
	import hljs from 'highlight.js/lib/core';
	import python from 'highlight.js/lib/languages/python';
	import 'highlight.js/styles/github-dark.css';

	const modalRegistry: Record<string, ModalComponent> = {
		vizSelectorModal: { ref: VizSelector },
		hookModal: { ref: Hook }
	};
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	storeHighlightJs.set(hljs);
	initializeStores();

	hljs.registerLanguage('python', python);
</script>

<div class="relative w-full h-full">
	<Modal components={modalRegistry} />
	<AppShell>
		<slot />
	</AppShell>
</div>
