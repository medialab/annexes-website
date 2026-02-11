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
	import { asset, resolve } from '$app/paths';

	let { currentEdition } = $props();

	let gridColsNum = $state(5);
	const homeHref = resolve('/');

	function toAssetHref(pathname?: string) {
		if (!pathname) return undefined;
		return asset(pathname.startsWith('/') ? pathname : `/${pathname}`);
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && goto(homeHref)} />

<section
	class="fixed z-10 flex h-screen w-screen items-center justify-center py-4"
	transition:slide={{ duration: 500, easing: cubicOut, axis: 'y' }}
>
	<div
		class="z-2 flex h-full w-full flex-col-reverse justify-center gap-4 px-4 text-[#444444] md:max-w-[60%] md:flex-row md:px-0 xl:max-w-[80%]"
	>
		{#if $currentPanel}
			<Navigator></Navigator>
		{/if}
		<div
			id="viewer"
			class="flex h-full w-full flex-1 flex-col items-start justify-between overflow-y-scroll rounded-3xl border border-solid border-neutral-200 bg-white p-4 pb-0 md:h-full md:items-center md:rounded-2xl md:pb-4"
		>
			<header class="flex h-fit w-full items-center justify-between">
				{#if currentEdition}
					<button
						class="pill blank pointer-events-none hidden border border-dashed! border-neutral-500 bg-neutral-100 text-neutral-500 md:block"
					>
						<p>{currentEdition.name}</p>
					</button>
					<div class="block md:hidden">
						<Button
							label="Download"
							icon={downloadIcon}
							url={toAssetHref(currentEdition?.downloadHref)}
							download={true}
						></Button>
					</div>
				{/if}
				<div class="hidden md:block">
					<Button
						label="Close"
						icon={closeIcon}
						urgency="urgent"
						onClick={() => {
							goto(homeHref);
						}}
					></Button>
				</div>
				<div class="block md:hidden">
					<Button
						icon={closeIcon}
						urgency="urgent"
						onClick={() => {
							goto(homeHref);
						}}
					></Button>
				</div>
			</header>
			{#if $currentPanel === 'book'}
				<MenuBio {currentEdition} gridCols={gridColsNum} />
			{:else if $currentPanel === 'layout'}
				<MenuLayout {currentEdition} />
			{:else if $currentPanel === 'gallery'}
				<MenuGallery {currentEdition} />
			{:else if $currentPanel === 'reader'}
				<MenuReader {currentEdition} />
			{/if}
			<footer class="hidden h-fit w-full items-center justify-between md:flex">
				<Button
					label="Download"
					icon={downloadIcon}
					url={toAssetHref(currentEdition?.downloadHref)}
					download={true}
				></Button>
				{#if $currentPanel === 'book'}
					<div class="flex w-full items-center justify-center">
						<label class="pill w-2/5 gap-3 text-nowrap">
							<p>Cols {gridColsNum}</p>
							<input
								class="h-1.5 w-full appearance-none rounded-full bg-blue-600 outline-none [&::-moz-range-thumb]:h-[0.9rem] [&::-moz-range-thumb]:w-[0.9rem] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-700 [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-blue-600 [&::-webkit-slider-thumb]:h-[0.9rem] [&::-webkit-slider-thumb]:w-[0.9rem] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-700 [&::-webkit-slider-thumb]:bg-blue-400"
								type="range"
								min="1"
								max="10"
								step="1"
								bind:value={gridColsNum}
								aria-label="Number of grid columns"
							/>
						</label>
					</div>
				{/if}
				<Button label="Share" icon={shareIcon} href={homeHref}></Button>
			</footer>
		</div>
	</div>
	<button
		id="bg_drop"
		class="fixed z-0 h-full w-full cursor-alias bg-[#F5F5F5] opacity-80"
		onclick={() => goto(homeHref)}
		aria-label="Close menu"
		tabindex="0"
	></button>
</section>
