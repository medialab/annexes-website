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

	let gridColsNum = $state(5);
</script>

<section
	class="fixed z-10 flex h-screen w-screen items-center justify-center bg-[#F5F5F5] py-4"
	transition:slide={{ duration: 500, easing: cubicOut, axis: 'y' }}
>
	<div
		class="flex h-full w-full flex-col-reverse justify-center gap-4 px-4 text-[#444444] md:max-w-[60%] md:flex-row md:px-0 xl:max-w-[80%]"
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
						class="pill pointer-events-none hidden border border-dashed! border-neutral-500 bg-neutral-100 text-neutral-500 md:block"
					>
						<p>{currentEdition.name}</p>
					</button>
					<div class="block md:hidden">
						<Button
							label="Download"
							icon={downloadIcon}
							url={currentEdition?.downloadHref}
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
							goto('/');
						}}
					></Button>
				</div>
				<div class="block md:hidden">
					<Button
						icon={closeIcon}
						urgency="urgent"
						onClick={() => {
							goto('/');
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
					url={currentEdition?.downloadHref}
					download={true}
				></Button>
				{#if $currentPanel === 'book'}
					<label class="pill slider-pill">
						<p>Cols {gridColsNum}</p>
						<input
							class="slider-range"
							type="range"
							min="1"
							max="10"
							step="1"
							bind:value={gridColsNum}
							aria-label="Number of grid columns"
						/>
					</label>
				{/if}
				<Button label="Share" icon={shareIcon} href="/"></Button>
			</footer>
		</div>
	</div>
</section>

<style>
	.slider-pill {
		gap: 0.75rem;
	}

	.slider-range {
		appearance: none;
		-webkit-appearance: none;
		width: 8rem;
		height: 0.375rem;
		border-radius: 9999px;
		background: #2563eb;
		outline: none;
	}

	.slider-range::-webkit-slider-thumb {
		appearance: none;
		-webkit-appearance: none;
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 9999px;
		border: 2px solid #1d4ed8;
		background: #60a5fa;
		cursor: pointer;
	}

	.slider-range::-moz-range-track {
		height: 0.375rem;
		border-radius: 9999px;
		background: #2563eb;
	}

	.slider-range::-moz-range-thumb {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 9999px;
		border: 2px solid #1d4ed8;
		background: #60a5fa;
		cursor: pointer;
	}
</style>
