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

    import MenuBio from "./menu_bio.svelte";
    import MenuLayout from "./menu_layout.svelte";
    import MenuGallery from "./menu_gallery.svelte";
    import MenuReader from "./menu_reader.svelte";
 
</script>

{#if $isMenuOpen}
<section class="flex fixed justify-center items-center h-screen w-screen bg-[#F5F5F5] z-10 py-4 " transition:slide={{ duration: 500, easing: cubicOut }}>
        <div class="flex flex-row gap-4 max-w-[1200px] w-full h-full text-[#444444]">
            <div id="navigator" class="flex flex-col items-center p-2 rounded-2xl gap-2 bg-white h-fit w-fit ">
                <button type="button" class="rounded-xl aspect-square p-2 w-[50px] justify-center" onclick={() => currentPanel = 'book'} class:active={currentPanel === 'book'}>
                    <img src={bookIcon} alt="Book" class=""/>
                </button>
                <button type="button" class="rounded-xl aspect-square p-2 w-[50px] justify-center" onclick={() => currentPanel = 'layout'} class:active={currentPanel === 'layout'}>
                    <img src={layoutIcon} alt="Layout" class=""/>
                </button>
                <button type="button" class="rounded-xl aspect-square p-2 w-[50px] justify-center" onclick={() => currentPanel = 'gallery'} class:active={currentPanel === 'gallery'}>
                    <img src={galleryIcon} alt="Gallery" class=""/>
                </button>
                <button type="button" class="rounded-xl aspect-square p-2 w-[50px] justify-center" onclick={() => currentPanel = 'reader'} class:active={currentPanel === 'reader'}>
                    <img src={readerIcon} alt="Reader" class=""/>
                </button>
            </div>
            <div id="viewer" class="flex flex-col rounded-2xl justify-between items-center w-auto aspect-4/3 bg-white p-4 h-full">
                <header class="w-full h-fit flex justify-between items-center">
                        <Button label="Menu" icon={menuIcon} href="/"></Button>
                        <Button label="ARTIFICIAL INQUIRIES" href="/"></Button>
                        <Button label="Close" icon={closeIcon} href="/"></Button>
                </header>
                {#if currentPanel === 'book'}
                    <MenuBio currentEdition={$currentEdition} />
                {:else if currentPanel === 'layout'}
                    <MenuLayout currentEdition={$currentEdition} />
                {:else if currentPanel === 'gallery'}
                    <MenuGallery currentEdition={$currentEdition} />
                {:else if currentPanel === 'reader'}
                    <MenuReader currentEdition={$currentEdition} />
                {/if}
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