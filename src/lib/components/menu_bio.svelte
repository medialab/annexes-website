<script>
    let {currentEdition} = $props();
</script>

<main class="flex-1 flex flex-row gap-4 min-h-0 w-full my-4 rounded-3xl border-solid border-gray-200 border-2 p-4 bg-gray-100">
    <div class="w-1/2 h-full" id="biography-card">
        {#if currentEdition}
            <div class="flex flex-col gap-6 w h-full overflow-y-scroll">
                <div class="flex flex-col gap-0">
                    <h2>{currentEdition.name}</h2>
                    <p>{currentEdition.subtitle}</p>
                </div>
                <p class="line-clamp-12">{currentEdition.description}</p>
                <div class="flex flex-col gap-2">
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">title</p>
                        <p class="col-span-1">{currentEdition.name}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">isbn</p>
                        <p class="col-span-1">{currentEdition.isbn}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">published</p>
                        <p class="col-span-1">{currentEdition.publishingDate}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">co-publisher</p>
                        <p class="col-span-1">{currentEdition.coPublisher}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">download</p>
                        <a href={currentEdition.downloadHref}>
                            <p class="col-span-1">{currentEdition.downloadHref}</p>
                        </a>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">editors</p>
                        <p class="col-span-1">{currentEdition.editors}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">design by</p>
                        <p class="col-span-1">{currentEdition.designers}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">contributors</p>
                        <p class="col-span-1">{currentEdition.contributors}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">topic</p>
                        <p class="col-span-1">{currentEdition.keywords}</p>
                    </div>
                    <div class="grid grid-cols-[0.3fr_1fr] gap-2 items-center">
                        <p class="uppercase text-gray-400 col-span-1 text-sm">part of</p>
                        <a href={currentEdition.parentUrl}>
                            <p class="col-span-1">{currentEdition.parentProject}</p>
                        </a>
                    </div>
                </div>
            </div>  
        {/if}
    </div>
    <div class="w/1-2 h-full" id="timone">
        <div class="p-4 flex flex-row flex-wrap h-full overflow-y-scroll">

        </div>
    </div>
</main>