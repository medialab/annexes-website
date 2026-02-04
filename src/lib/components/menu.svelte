<script lang="ts">
    import type { Edition, MenuVariations } from '$lib/types';
    import { currentEdition, isMenuOpen } from '$lib/stores';
    import Button from './button.svelte';
    import { slide } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let currentPanel = $state<MenuVariations | null>("book");

    import bookIcon from "$lib/assets/icons/book.svg";
    import layoutIcon from "$lib/assets/icons/layout.svg";
    import galleryIcon from "$lib/assets/icons/gallery.svg";
    import readerIcon from "$lib/assets/icons/reader.svg";
    import menuIcon from "$lib/assets/icons/burger.svg";
    import closeIcon from "$lib/assets/icons/close.svg";
    import downloadIcon from "$lib/assets/icons/download.svg";
    import shareIcon from "$lib/assets/icons/share.svg";
 
</script>

{#if $isMenuOpen}
<section class="flex fixed justify-center items-center h-screen w-screen bg-white/50 z-10 " transition:slide={{ duration: 500, easing: cubicOut }}>
    <div class="flex flex-row gap-4 max-w-[1200px]">
        <div id="navigator" class="flex flex-col p-2 rounded-2xl gap-2 bg-white h-fit">
            <button type="button" class="rounded-xl aspect-square max-w-[50px] p-2" onclick={() => currentPanel = 'book'} class:active={currentPanel === 'book'}>
                <img src={bookIcon} alt="Book" />
            </button>
            <button type="button" class="rounded-xl aspect-square max-w-[50px] p-2" onclick={() => currentPanel = 'layout'} class:active={currentPanel === 'layout'}>
                <img src={layoutIcon} alt="Layout" />
            </button>
            <button type="button" class="rounded-xl aspect-square max-w-[50px] p-2" onclick={() => currentPanel = 'gallery'} class:active={currentPanel === 'gallery'}>
                <img src={galleryIcon} alt="Gallery" />
            </button>
            <button type="button" class="rounded-xl aspect-square max-w-[50px] p-2" onclick={() => currentPanel = 'reader'} class:active={currentPanel === 'reader'}>
                <img src={readerIcon} alt="Reader" />
            </button>
        </div>
        <div id="viewer" class="flex flex-col rounded-2xl justify-between items-center gap-4 w-full  aspect-[4/3] bg-white p-4">
                
                    <header class="w-full h-fit flex justify-between items-center">
                            <Button label="Menu" icon={menuIcon} href="/"></Button>
                            <Button label="ARTIFICIAL INQUIRIES" href="/"></Button>
                            <Button label="Close" icon={closeIcon} href="/"></Button>
                    </header>
                    <main class="w-full h-full">
                    {#if currentPanel === 'book'}
                        <div class="flex flex-col gap-6 w-1/2 h-full overflow-y-scroll bg-gray-100 p-4 rounded-3xl border-solid border-gray-200 border-2">
                            <div class="flex flex-col gap-0">
                                <h2>Artificial Inquiries</h2>
                                <p>Annex of Ecologies of LLM Practices</p>
                            </div>
                            <p class="line-clamp-12">The booming rise of large language models (LLMs) such as ChatGPT has sparked a rush to produce discourse about these technologies. The quick crystallisation of a shared outlook around a few key themes has narrowed the scope of potential interrogations. Public and scientific debates focus on technical issues: algorithmic bias, confabulation, and intellectual property violations. However, the problems and consequences associated with their actual use – for both their users and their professional contexts – remain largely unexplored. This asymmetry fuels a mechanical view of technological development and its effects, as if the technical analysis of these systems were enough to predict their social impact. Moreover, these discourses present AI as a monolithic and disruptive entity, dismissing the possibility that it may be aligned with existing practices and that its effects may vary depending on situations encountered in one’s job...</p>
                            <div class="flex flex-col gap-2">
                                <div class="grid grid-cols-[0.3fr_1fr] gap-2">
                                    <p class="uppercase text-gray-400 col-span-1">title</p>
                                    <p class="col-span-1">Artificial Inquiries</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col w-1/2">

                        </div>
                    {/if}
                    </main>
                    <footer class="w-full h-fit flex justify-between items-center">
                        <Button label="Download" icon={downloadIcon} href="/"></Button>
                        <Button label="Share" icon={shareIcon} href="/"></Button>
                    </footer>
                
        </div>
    </div>
</section>
{/if}

<style>
    .active {
        background-color: #E9F6FF;
    }

    .active img {
        opacity: 1;
    }

    .active > img:not(.active) {
        opacity: 0.2;
    }
</style>