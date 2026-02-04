<script lang="ts">
    //@ts-expect-error sveltednd types are not working
	import { droppable, type DragDropState } from '@thisux/sveltednd';
    import type { Edition, DropItem } from '$lib/types';
    import { isMenuOpen, currentEdition } from '$lib/stores';

	

	const dropContainer = 'footer-dropzone';
	let dropped = $state<DropItem[]>([]);

	function labelFor(item: DropItem, index: number) {
		if (typeof item === 'string') return item;
		return item.label ?? item.name ?? item.title ?? `Item ${index + 1}`;
	}

	function handleDrop(state: DragDropState<DropItem>) {
		const { draggedItem, targetContainer } = state;
		if (!targetContainer || draggedItem == null) return;
		dropped = [...dropped, draggedItem];
	}

	function clearDropzone() {
		dropped = [];
	}

    let isFooterOpen = $state(false);

    function openMenu(edition:Edition) {
        isMenuOpen.set(true);
        isFooterOpen=false;
        clearDropzone();
        currentEdition.set(edition);
    }
</script>

<footer
	class="max-w-[1200px] transition-all duration-300 ease-in-out w-full place-self-center bottom-6 fixed bg-white/95 z-2 backdrop-blur flex gap-3 p-2 rounded-2xl justify-center items-center h-fit md:mx-0 mx-2"
    class:open={isFooterOpen}
    use:droppable={{
			container: dropContainer,
			callbacks: { onDrop: () => openMenu(dropped[0] as Edition), onDragEnter: () => isFooterOpen = true, onDragLeave: () => isFooterOpen = false },
			attributes: {
				dragOverClass:
					'!border-blue-500 !border-dashed !bg-blue-50 ring-1 ring-blue-300/60 shadow-[0_0_0_3px_rgba(59,130,246,0.15)]'
			}
		}}
>
	<div
		class=" min-h-[44px] px-6 border-dashed border-2 border-gray-200 bg-gray-50 {isFooterOpen ? 'h-[170px] w-full!' : ''} transition-all duration-300 ease-in-out pill"
		
		aria-label="Footer drop zone"
	>
		{#if !isFooterOpen}
			<p>Drop here a book</p>
		{:else}
			<p>Drop iiiiiiiiiit</p>
		{/if}
	</div>
</footer>
