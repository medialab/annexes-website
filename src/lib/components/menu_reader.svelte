<script lang="ts">
	import { getEditionPages } from '$lib/stores';

	import arrowLeft from '$lib/assets/icons/arrowLeft.svg';
	import arrowRight from '$lib/assets/icons/arrowRight.svg';

	let { currentEdition } = $props();

	let currentPage = $state(0);
	const pagesPromise = $derived(getEditionPages(currentEdition?.name ?? ''));

	function nextPage(totalPages: number) {
		if (currentPage + 2 < totalPages) currentPage += 2;
	}

	function prevPage() {
		if (currentPage - 2 >= 0) currentPage -= 2;
	}

	$effect(() => {
		currentEdition?.name;
		currentPage = 0;
	});
</script>

<main
	class="my-4 grid h-full min-h-0 w-full grid-cols-[0.1fr_1fr_0.1fr] gap-4 rounded-3xl bg-neutral-100 p-4 md:h-fit"
>
	{#await pagesPromise}
		<div class="col-span-3 flex items-center justify-center">
			<p class="text-sm text-neutral-500">Loading pages...</p>
		</div>
	{:then pages}
		{@const visiblePages = pages.slice(currentPage, currentPage + 2)}

		<button
			id="arrow_left"
			class="col-span-1 h-full w-fit px-6 disabled:opacity-30"
			onclick={prevPage}
			disabled={currentPage <= 0}
		>
			<img src={arrowLeft} alt="Arrow Left" class="" />
		</button>

		<div
			id="gallery"
			class="col-span-1 flex h-full w-full items-center justify-center overflow-hidden rounded-2xl"
		>
			{#if pages.length === 0}
				<p class="text-sm text-neutral-500">No pages found.</p>
			{:else}
				<div class="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
					{#each visiblePages as page}
						<div class="flex h-full w-full items-center justify-center overflow-hidden rounded-md">
							<enhanced:img src={page} alt="" class="h-full w-auto object-contain shadow-xl" />
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<button
			id="arrow_right"
			class="col-span-1 h-full w-fit px-6 disabled:opacity-30"
			onclick={() => nextPage(pages.length)}
			disabled={currentPage + 2 >= pages.length}
		>
			<img src={arrowRight} alt="Arrow Right" class="" />
		</button>
	{:catch _error}
		<div class="col-span-3 flex items-center justify-center">
			<p class="text-sm text-red-500">Could not load pages.</p>
		</div>
	{/await}
</main>
