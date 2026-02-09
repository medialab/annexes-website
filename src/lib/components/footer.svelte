<script lang="ts">
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import type { Edition, DropItem } from '$lib/types';
	import { isMenuOpen, currentEdition } from '$lib/stores';

	const dropContainer = 'footer-dropzone';
	let dropped = $state<DropItem[]>([]);

	function handleDrop(state: DragDropState<Edition>) {
		const { draggedItem } = state;
		if (draggedItem) {
			openMenu(draggedItem);
		}
	}

	function clearDropzone() {
		dropped = [];
	}

	let isFooterOpen = $state(false);

	function openMenu(edition: Edition) {
		console.log('edition dropped:', edition);
		isMenuOpen.set(true);
		isFooterOpen = false;
		currentEdition.set(edition);
		clearDropzone();
	}
</script>

<footer
	class="fixed right-4 bottom-6 left-4 z-2 hidden h-fit items-center justify-center gap-3 rounded-2xl bg-white/95 p-2 backdrop-blur transition-all duration-300 ease-in-out md:right-auto md:left-1/2 md:flex md:w-full md:max-w-[1200px] md:-translate-x-1/2"
	class:open={isFooterOpen}
	use:droppable={{
		container: dropContainer,
		callbacks: {
			onDrop: handleDrop,
			onDragEnter: () => (isFooterOpen = true),
			onDragLeave: () => (isFooterOpen = false)
		},
		attributes: {
			dragOverClass:
				'!border-blue-500 !border-dashed !bg-blue-50 ring-1 ring-blue-300/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
		}
	}}
>
	<div
		class=" min-h-[44px] border-2 border-dashed border-gray-200 bg-gray-50 px-6 {isFooterOpen
			? 'h-[170px] w-full!'
			: ''} pill transition-all duration-300 ease-in-out"
		aria-label="Footer drop zone"
	>
		{#if !isFooterOpen}
			<p>Drop here a book</p>
		{:else}
			<p>Drop iiiiiiiiiit</p>
		{/if}
	</div>
</footer>
