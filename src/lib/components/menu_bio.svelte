<script lang="ts">
	let { currentEdition, gridCols } = $props();
	import { getEditionPages } from '$lib/stores';
</script>

<main
	class="my-4 flex h-auto min-h-0 w-full flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-3xl border-2 border-solid border-neutral-200 bg-neutral-100 p-4 md:h-full md:flex-row md:overflow-hidden"
>
	<div class="h-fit w-full overflow-visible md:h-full md:w-1/2 md:overflow-hidden" id="biography-card">
		{#if currentEdition}
			<div class="flex h-fit flex-col gap-6 overflow-visible md:h-full md:overflow-y-auto">
				<div class="flex flex-col gap-0">
					<h2>{currentEdition.name}</h2>
					<p>{currentEdition.subtitle}</p>
				</div>
				<p class="md:line-clamp-12">{currentEdition.description}</p>
				<div class="flex-col gap-2 md:flex">
					<div class="grid grid-cols-[0.3fr_1fr] gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">title</p>
						<p class="col-span-1">{currentEdition.name}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">isbn</p>
						<p class="col-span-1">{currentEdition.isbn}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">published</p>
						<p class="col-span-1">{currentEdition.publishingDate}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">co-publisher</p>
						<p class="col-span-1">{currentEdition.coPublisher}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">download</p>
						<a href={currentEdition.downloadHref}>
							<p class="col-span-1">{currentEdition.downloadHref}</p>
						</a>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">editors</p>
						<p class="col-span-1">{currentEdition.editors}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">design by</p>
						<p class="col-span-1">{currentEdition.designers}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">contributors</p>
						<p class="col-span-1">{currentEdition.contributors}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">topic</p>
						<p class="col-span-1">{currentEdition.keywords}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-neutral-400 uppercase">part of</p>
						<a href={currentEdition.parentUrl}>
							<p class="col-span-1">{currentEdition.parentProject}</p>
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<!--
	<div class="h-full w-full md:w-1/2" id="timone">
		<div
			class="grid h-fit gap-2 overflow-y-scroll p-0 pb-8 md:h-full md:overflow-hidden md:p-4 md:pb-0"
			style={`grid-template-columns: repeat(${gridCols}, minmax(0, 1fr));`}
		>
			{#await pagesPromise}
				<p class="col-span-full text-sm text-neutral-500">Loading pages...</p>
			{:then pages}
				{#if pages.length === 0}
					<p class="col-span-full text-sm text-neutral-500">No pages found.</p>
				{:else}
					{#each pages as page}
						<enhanced:img
							src={page}
							alt=""
							class="col-span-1 h-auto w-full bg-white object-contain transition-all duration-150 hover:border hover:border-neutral-200"
						/>
					{/each}
				{/if}
			{:catch _error}
				<p class="col-span-full text-sm text-red-500">Could not load pages.</p>
			{/await}
		</div>
	</div>-->
</main>
