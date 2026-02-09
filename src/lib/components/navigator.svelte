<script lang="ts">
	import type { MenuVariations } from '$lib/types';
	let { currentPanel }: { currentPanel: MenuVariations } = $props();

	import bookIcon from '$lib/assets/icons/book.svg';
	import layoutIcon from '$lib/assets/icons/layout.svg';
	import galleryIcon from '$lib/assets/icons/gallery.svg';
	import readerIcon from '$lib/assets/icons/reader.svg';
</script>

<div
	id="navigator"
	class="hidden h-fit w-fit flex-col items-center gap-2 rounded-2xl bg-white p-2 md:flex"
>
	<button
		type="button"
		class="aspect-square w-[50px] justify-center rounded-xl p-2"
		onclick={() => (currentPanel = 'book')}
		class:active={currentPanel === 'book'}
	>
		<img src={bookIcon} alt="Book" class="" />
	</button>
	<button
		type="button"
		class="aspect-square w-[50px] justify-center rounded-xl p-2"
		onclick={() => (currentPanel = 'layout')}
		class:active={currentPanel === 'layout'}
	>
		<img src={layoutIcon} alt="Layout" class="" />
	</button>
	<button
		type="button"
		class="aspect-square w-[50px] justify-center rounded-xl p-2"
		onclick={() => (currentPanel = 'gallery')}
		class:active={currentPanel === 'gallery'}
	>
		<img src={galleryIcon} alt="Gallery" class="" />
	</button>
	<button
		type="button"
		class="aspect-square w-[50px] justify-center rounded-xl p-2"
		onclick={() => (currentPanel = 'reader')}
		class:active={currentPanel === 'reader'}
	>
		<img src={readerIcon} alt="Reader" class="" />
	</button>
</div>

<style>
	.active {
		background-color: #e9f6ff;
	}

	.active img {
		opacity: 1;
	}

	.active > img:not(.active) {
		opacity: 0.2;
	}
</style>
