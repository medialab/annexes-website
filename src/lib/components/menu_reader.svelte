<script lang="ts">
	import { getEditionPages } from '$lib/stores';
	import { isMobile } from '$lib/stores';
	import { preventDefault } from '$lib/utils';

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

	$effect(() => {
		currentEdition?.name;
		currentPage = 0;
	});
</script>

<main class="viewer_main mx-auto my-auto h-fit w-fit md:h-full">
	{#await pagesPromise}
		<div class="col-span-3 flex h-full items-center justify-center">
			<p class="text-sm text-neutral-500">Loading pages...</p>
		</div>
	{:then pages}
		{@const pagesPerView = $isMobile ? 1 : 2}
		{@const visiblePages = pages.slice(currentPage, currentPage + pagesPerView)}
		<button
			id="arrow_left"
			class="z-[3] col-start-1 row-start-2 flex h-fit w-full items-center justify-center bg-white px-2 py-4 disabled:text-neutral-200 md:col-start-auto md:row-start-auto md:bg-transparent md:px-6 md:py-0"
			onclick={prevPage}
			disabled={currentPage <= 0}
			data-hover="Previous page"
		>
			<img src={arrowLeft} alt="Arrow Left" class="" />
		</button>

		<div
			id="gallery"
			class="z-[0] col-span-2 flex h-full min-h-0 w-fit items-stretch justify-center md:col-span-1 md:w-full"
		>
			{#if pages.length === 0}
				<p class="text-sm text-neutral-500">No pages found.</p>
			{:else}
				<div class="grid h-full min-h-0 w-fit grid-cols-1 items-stretch md:w-full md:grid-cols-2">
					{#each visiblePages as page}
						<div
							class="col-span-1 flex h-full min-h-0 w-fit items-center justify-center overflow-clip md:bg-transparent md:py-4"
						>
							<img
								src={page}
								alt=""
								loading="lazy"
								decoding="async"
								class="protected-image z-[0] h-full w-auto overflow-clip rounded-2xl border-2 border-solid border-neutral-100 object-contain md:w-full md:rounded-none md:border-0"
								draggable="false"
								oncontextmenu={preventDefault}
								ondragstart={preventDefault}
								oncopy={preventDefault}
								oncut={preventDefault}
								onselectstart={preventDefault}
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<button
			id="arrow_right"
			class="z-[3] col-start-2 row-start-2 flex h-full w-full items-center justify-center bg-white px-2 disabled:text-neutral-200 md:col-start-auto md:row-start-auto md:bg-transparent md:px-6"
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
