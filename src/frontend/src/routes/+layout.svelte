<script lang="ts">
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		storePopup,
		initializeStores,
		Modal,
		AppShell,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import VizSelector from '../components/VizSelector.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		vizSelectorModal: { ref: VizSelector }
	};
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();
</script>

<Modal components={modalRegistry} />
<AppShell>
	<slot />
</AppShell>
