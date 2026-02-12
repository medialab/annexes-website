<script lang="ts">
	import { droppable, type DragDropState } from '@thisux/sveltednd';
	import type { Edition } from '$lib/types';
	import { isFooterOpen, isFooterHovered, hideFooter } from '$lib/stores';
	import { DND_FOOTER_CONTAINER, openPanel } from '$lib/stores';
	import { slide } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { page } from '$app/state';

	const dropContainer = DND_FOOTER_CONTAINER;

	function isEdition(value: unknown): value is Edition {
		if (!value || typeof value !== 'object') return false;
		const candidate = value as Partial<Edition>;
		return typeof candidate.id === 'string' && typeof candidate.name === 'string';
	}

	function handleDrop(state: DragDropState<Edition>) {
		const { draggedItem } = state;
		if (!isEdition(draggedItem)) return;

		openPanel(draggedItem);
	}

	function handleDragEnter() {
		$isFooterOpen = true;
		$isFooterHovered = true;
	}

	function handleDragLeave() {
		$isFooterHovered = false;
	}
</script>

{#if $hideFooter}
	<!-- Test -->
{:else}
	<footer
		class="fixed right-4 bottom-6 left-4 z-30 hidden h-fit items-center justify-center gap-3 rounded-2xl bg-white/95 p-2 backdrop-blur transition-all duration-300 ease-in-out md:right-auto md:left-1/2 md:flex md:w-full md:max-w-[60%] md:-translate-x-1/2"
		class:open={$isFooterOpen === true}
		use:droppable={{
			container: dropContainer,
			callbacks: {
				onDrop: handleDrop,
				onDragEnter: handleDragEnter,
				onDragLeave: handleDragLeave
			}
		}}
		transition:slide={{ duration: 300, axis: 'y', easing: cubicInOut }}
	>
		<div
			class=" min-h-[44px] border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 {$isFooterOpen
				? 'h-[300px] w-full!'
				: ''} pill transition-all duration-300 ease-in-out {$isFooterHovered
				? 'animate-pulse !border-dashed !border-blue-500 !bg-blue-50 shadow-[0_0_0_3px_rgba(59,130,246,0.15)] ring-1 ring-blue-300/60'
				: ''}"
		>
			{#if !$isFooterOpen}
				<p>Drop here a book</p>
			{:else}
				<p>Drop it like it's hot</p>
			{/if}
		</div>
	</footer>
{/if}
