<script lang="ts">
	import type { MenuVariations } from '$lib/types';
	import { currentPanel } from '$lib/stores';

	import bookIcon from '$lib/assets/icons/book.svg';
	import layoutIcon from '$lib/assets/icons/layout.svg';
	import galleryIcon from '$lib/assets/icons/gallery.svg';
	import readerIcon from '$lib/assets/icons/reader.svg';

	const navItems: { panel: MenuVariations; icon: string; label: string }[] = [
		{ panel: 'book', icon: bookIcon, label: 'Book' },
		{ panel: 'layout', icon: layoutIcon, label: 'Layout' },
		{ panel: 'gallery', icon: galleryIcon, label: 'Gallery' },
		{ panel: 'reader', icon: readerIcon, label: 'Reader' }
	];
</script>

<div
	id="navigator"
	class="left-4 flex flex-row items-center justify-between rounded-2xl border-neutral-200 bg-white p-2 md:relative md:inset-auto md:mx-0 md:h-fit md:w-fit md:flex-col md:items-center md:justify-center md:gap-2 md:border md:border-solid"
>
	{#each navItems as item}
		<button
			type="button"
			class="nav-button aspect-square w-[50px] justify-center rounded-xl p-2"
			onclick={() => ($currentPanel = item.panel)}
			class:active={$currentPanel === item.panel}
			aria-label={item.label}
			title={item.label}
		>
			<img src={item.icon} alt={item.label} />
		</button>
	{/each}
</div>

<style>
	.nav-button {
		transition: background-color 150ms ease-in-out;
	}

	.nav-button img {
		transition: filter 150ms ease-in-out;
	}

	.nav-button:is(:hover, .active) {
		background-color: #e9f6ff;
	}

	.nav-button:is(:hover, .active) img {
		filter: brightness(0) saturate(100%) hue-rotate(195deg) saturate(600%) brightness(65%);
	}
</style>
