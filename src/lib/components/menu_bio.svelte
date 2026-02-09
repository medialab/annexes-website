<script>
	let { currentEdition } = $props();
</script>

<main
	class="my-4 flex min-h-0 w-full flex-1 flex-col gap-4 rounded-3xl border-2 border-solid border-gray-200 bg-gray-100 p-4 md:flex-row"
>
	<div class="h-full w-full md:w-1/2" id="biography-card">
		{#if currentEdition}
			<div class="w flex h-full flex-col gap-6 overflow-y-scroll">
				<div class="flex flex-col gap-0">
					<h2>{currentEdition.name}</h2>
					<p>{currentEdition.subtitle}</p>
				</div>
				<p class="md:line-clamp-12">{currentEdition.description}</p>
				<div class="hidden flex-col gap-2 md:flex">
					<div class="grid grid-cols-[0.3fr_1fr] gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">title</p>
						<p class="col-span-1">{currentEdition.name}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">isbn</p>
						<p class="col-span-1">{currentEdition.isbn}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">published</p>
						<p class="col-span-1">{currentEdition.publishingDate}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">co-publisher</p>
						<p class="col-span-1">{currentEdition.coPublisher}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">download</p>
						<a href={currentEdition.downloadHref}>
							<p class="col-span-1">{currentEdition.downloadHref}</p>
						</a>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">editors</p>
						<p class="col-span-1">{currentEdition.editors}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">design by</p>
						<p class="col-span-1">{currentEdition.designers}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">contributors</p>
						<p class="col-span-1">{currentEdition.contributors}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">topic</p>
						<p class="col-span-1">{currentEdition.keywords}</p>
					</div>
					<div class="grid grid-cols-[0.3fr_1fr] items-center gap-2">
						<p class="col-span-1 text-sm text-gray-400 uppercase">part of</p>
						<a href={currentEdition.parentUrl}>
							<p class="col-span-1">{currentEdition.parentProject}</p>
						</a>
					</div>
				</div>
			</div>
		{/if}
	</div>
	<div class="w/1-2 h-full" id="timone">
		<div class="flex h-full flex-row flex-wrap overflow-y-scroll p-4"></div>
	</div>
</main>
