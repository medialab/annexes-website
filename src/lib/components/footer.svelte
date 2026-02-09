<script lang="ts">
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import type { Edition, DropItem } from '$lib/types';
	import { currentEdition, isFooterOpen, isFooterHovered } from '$lib/stores';
	import { goto } from '$app/navigation';
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

	function handleDragEnter() {
		$isFooterOpen = true;
		$isFooterHovered = true;
	}

	function handleDragLeave() {
		$isFooterHovered = false;
	}

	function openMenu(edition: Edition) {
		console.log('edition dropped:', edition);
		$isFooterOpen = false;
		goto(`/editions/${edition.name}`);
		currentEdition.set(edition);
		clearDropzone();
	}
</script>

<footer
	class="fixed right-4 bottom-6 left-4 z-2 hidden h-fit items-center justify-center gap-3 rounded-2xl bg-white/95 p-2 backdrop-blur transition-all duration-300 ease-in-out md:right-auto md:left-1/2 md:flex md:w-full md:max-w-[60%] md:-translate-x-1/2"
	class:open={$isFooterOpen === true}
	use:droppable={{
		container: dropContainer,
		callbacks: {
			onDrop: handleDrop,
			onDragEnter: handleDragEnter,
			onDragLeave: handleDragLeave
		}
	}}
>
	<div
		class=" min-h-[44px] border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 {$isFooterOpen
			? 'h-[300px] w-full!'
			: ''} pill transition-all duration-300 ease-in-out {$isFooterHovered
			? 'animate-pulse !border-dashed !border-blue-500 !bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.15)] ring-1 ring-blue-300/60'
			: ''}"
		aria-label="Footer drop zone"
	>
		{#if !$isFooterOpen}
			<p>Drop here a book</p>
		{:else}
			<p>Drop iiiiiiiiiit</p>
		{/if}
	</div>
</footer>
