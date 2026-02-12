<script lang="ts">
	import { getEditionPages } from '$lib/stores';
	import { isMobile } from '$lib/stores';

	import arrowLeft from '$lib/assets/icons/arrowLeft.svg';
	import arrowRight from '$lib/assets/icons/arrowRight.svg';

	let { currentEdition } = $props();

	let currentPage = $state(0);
	const pagesPromise = $derived(getEditionPages(currentEdition?.name ?? ''));

	function nextPage(totalPages: number) {
		if (currentPage + 1 < totalPages) currentPage += 1;
	}

	function prevPage() {
		if (currentPage - 1 >= 0) currentPage -= 1;
	}

	function preventAssetCopy(event: Event) {
		event.preventDefault();
	}

	$effect(() => {
		currentEdition?.name;
		currentPage = 0;
	});
</script>

<main class="viewer_main my-auto h-fit">
	{#await pagesPromise}
		<div class="col-span-3 flex items-center justify-center">
			<p class="text-sm text-neutral-500">Loading pages...</p>
		</div>
	{:then pages}
		{@const pagesPerView = $isMobile ? 1 : 2}
		{@const visiblePages = pages.slice(currentPage, currentPage + pagesPerView)}
		<button
			id="arrow_left"
			class="col-start-1 row-start-2 flex h-full w-full items-center justify-center px-2 py-4 disabled:opacity-30 md:col-start-auto md:row-start-auto md:px-6 md:py-0"
			onclick={prevPage}
			disabled={currentPage <= 0}
			data-hover="Previous page"
		>
			<img src={arrowLeft} alt="Arrow Left" class="" />
		</button>

		<div
			id="gallery"
			class="col-span-2 flex h-fit min-h-0 w-full items-stretch justify-center md:col-span-1 md:h-full"
		>
			{#if pages.length === 0}
				<p class="text-sm text-neutral-500">No pages found.</p>
			{:else}
				<div class="grid h-fit min-h-0 w-full grid-cols-1 items-stretch md:h-full md:grid-cols-2">
					{#each visiblePages as page}
						<div
							class="col-span-1 flex h-fit min-h-0 w-full items-center justify-center overflow-hidden md:h-full md:bg-transparent md:py-4"
						>
							<img
								src={page}
								alt=""
								loading="lazy"
								decoding="async"
								class="protected-image h-fit w-full overflow-clip rounded-2xl border-2 border-solid border-neutral-100 object-contain md:h-full md:border-0"
								draggable="false"
								oncontextmenu={preventAssetCopy}
								ondragstart={preventAssetCopy}
								oncopy={preventAssetCopy}
								oncut={preventAssetCopy}
								onselectstart={preventAssetCopy}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<button
			id="arrow_right"
			class="col-start-2 row-start-2 flex h-full w-full items-center justify-center px-2 disabled:opacity-30 md:col-start-auto md:row-start-auto md:px-6"
			onclick={() => nextPage(pages.length)}
			disabled={currentPage + 1 >= pages.length}
			data-hover="Next page"
		>
			<img src={arrowRight} alt="Arrow Right" class="" />
		</button>
	{:catch _error}
		<div class="col-span-3 flex items-center justify-center">
			<p class="text-sm text-red-500">Could not load pages.</p>
		</div>
	{/await}
</main>

<style>
	.protected-image {
		-webkit-user-drag: none;
		user-select: none;
		-webkit-user-select: none;
	}
</style>
