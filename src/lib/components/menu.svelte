<script lang="ts">
	import type { MenuVariations } from '$lib/types';
	import { currentEdition, isMenuOpen } from '$lib/stores';
	import Button from './button.svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let currentPanel = $state<MenuVariations | null>('book');

	import menuIcon from '$lib/assets/icons/burger.svg';
	import closeIcon from '$lib/assets/icons/close.svg';
	import downloadIcon from '$lib/assets/icons/download.svg';
	import shareIcon from '$lib/assets/icons/share.svg';

	import MenuBio from './menu_bio.svelte';
	import MenuLayout from './menu_layout.svelte';
	import MenuGallery from './menu_gallery.svelte';
	import MenuReader from './menu_reader.svelte';
	import Navigator from './navigator.svelte';
</script>

{#if $isMenuOpen}
	<section
		class="fixed z-10 flex h-screen w-screen items-center justify-center bg-[#F5F5F5] py-4"
		transition:slide={{ duration: 500, easing: cubicOut, axis: 'y' }}
	>
		<div class="flex h-full w-full max-w-[1200px] flex-row gap-4 text-[#444444]">
			{#if currentPanel}
				<Navigator {currentPanel}></Navigator>
			{/if}
			<div
				id="viewer"
				class="flex aspect-4/3 h-full w-full flex-col items-center justify-between rounded-2xl bg-white p-4 md:w-auto"
			>
				<header class="flex h-fit w-full items-center justify-between">
					<Button label="Menu" icon={menuIcon} href="/"></Button>
					<Button label="ARTIFICIAL INQUIRIES" href="/"></Button>
					<Button label="Close" icon={closeIcon} href="/" onClick={() => ($isMenuOpen = false)}
					></Button>
				</header>
				{#if currentPanel === 'book'}
					<MenuBio currentEdition={$currentEdition} />
				{:else if currentPanel === 'layout'}
					<MenuLayout currentEdition={$currentEdition} />
				{:else if currentPanel === 'gallery'}
					<MenuGallery currentEdition={$currentEdition} />
				{:else if currentPanel === 'reader'}
					<MenuReader currentEdition={$currentEdition} />
				{/if}
				<footer class="hidden h-fit w-full items-center justify-between md:flex">
					<Button label="Download" icon={downloadIcon} href="/"></Button>
					<Button label="Share" icon={shareIcon} href="/"></Button>
				</footer>
			</div>
		</div>
	</section>
{/if}
