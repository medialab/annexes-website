<script lang="ts">
	import { currentPanel } from '$lib/stores';
	import Button from './button.svelte';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	import closeIcon from '$lib/assets/icons/close.svg';
	import downloadIcon from '$lib/assets/icons/download.svg';
	import shareIcon from '$lib/assets/icons/share.svg';

	import MenuBio from './menu_bio.svelte';
	import MenuLayout from './menu_layout.svelte';
	import MenuGallery from './menu_gallery.svelte';
	import MenuReader from './menu_reader.svelte';
	import Navigator from './navigator.svelte';
	import { goto } from '$app/navigation';

	let { currentEdition } = $props();
</script>

<section
	class="fixed z-10 flex h-screen w-screen items-center justify-center bg-[#F5F5F5] py-4"
	transition:slide={{ duration: 500, easing: cubicOut, axis: 'y' }}
>
	<div
		class="flex h-full w-full max-w-[60%] flex-row justify-center gap-4 text-[#444444] xl:max-w-[80%]"
	>
		{#if $currentPanel}
			<Navigator></Navigator>
		{/if}
		<div
			id="viewer"
			class="flex h-full w-full flex-1 flex-col items-center justify-between rounded-2xl bg-white p-4"
		>
			<header class="flex h-fit w-full items-center justify-between">
				{#if currentEdition}
					<button
						class="pill pointer-events-none border border-dashed! border-neutral-500 bg-neutral-100 text-neutral-500"
					>
						<p>{currentEdition.name}</p>
					</button>
				{/if}
				<Button
					label="Close"
					icon={closeIcon}
					urgency="urgent"
					onClick={() => {
						goto('/');
					}}
				></Button>
			</header>
			{#if $currentPanel === 'book'}
				<MenuBio {currentEdition} />
			{:else if $currentPanel === 'layout'}
				<MenuLayout {currentEdition} />
			{:else if $currentPanel === 'gallery'}
				<MenuGallery {currentEdition} />
			{:else if $currentPanel === 'reader'}
				<MenuReader {currentEdition} />
			{/if}
			<footer class="hidden h-fit w-full items-center justify-between md:flex">
				<Button label="Download" icon={downloadIcon} href="/"></Button>
				<Button label="Share" icon={shareIcon} href="/"></Button>
			</footer>
		</div>
	</div>
</section>
