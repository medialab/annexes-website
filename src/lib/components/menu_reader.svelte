<script lang="ts">
    let {currentEdition} = $props();

    import arrowLeft from "$lib/assets/icons/arrowLeft.svg";
    import arrowRight from "$lib/assets/icons/arrowRight.svg";

    import { onMount } from "svelte";

    let canvasEl: HTMLCanvasElement;
    let galleryEl: HTMLDivElement;
    let currentPage = $state(1);
    let totalPages = $state(0);
    let pdfUrl = "/editions/test.pdf";

    async function renderPdfToCanvas(url: string, startPage: number) {
        if (!canvasEl) return;
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument(url).promise;
        totalPages = pdf.numPages;

        const ctx = canvasEl.getContext("2d")!;
        const dpr = window.devicePixelRatio || 1;
        const qualityMultiplier = 1.5; // Tweak this for balance between quality and performance
        const cHeight = galleryEl.clientHeight || 800;
        
        const page1 = await pdf.getPage(startPage);
        const viewport1 = page1.getViewport({ scale: 1 });
 
        const baseScale = cHeight / viewport1.height;
        const renderScale = baseScale * dpr * qualityMultiplier;

        const scaledViewport1 = page1.getViewport({ scale: renderScale });
        
        let totalWidth = scaledViewport1.width;
        let p2 = null;
        let scaledViewport2 = null;

        if (startPage + 1 <= totalPages) {
            p2 = await pdf.getPage(startPage + 1);
            scaledViewport2 = p2.getViewport({ scale: renderScale });
            totalWidth += scaledViewport2.width;
        }

        canvasEl.width = totalWidth;
        canvasEl.height = cHeight * dpr * qualityMultiplier;

        await page1.render({
            canvas: canvasEl,
            canvasContext: ctx,
            viewport: scaledViewport1,
        }).promise;

        if (p2 && scaledViewport2) {
            ctx.save();
            ctx.translate(scaledViewport1.width, 0);
            await p2.render({
                canvas: canvasEl,
                canvasContext: ctx,
                viewport: scaledViewport2,
            }).promise;
            ctx.restore();
        }
    }

    $effect(() => {
        if (currentPage) {
            renderPdfToCanvas(pdfUrl, currentPage);
        }
    });

    function nextPage() {
        if (currentPage + 2 <= totalPages) currentPage += 2;
    }

    function prevPage() {
        if (currentPage - 2 >= 1) currentPage -= 2;
    }

    onMount(() => {
        renderPdfToCanvas(pdfUrl, currentPage);
        const resizeObserver = new ResizeObserver(() => {
            renderPdfToCanvas(pdfUrl, currentPage);
        });
        resizeObserver.observe(galleryEl);
        return () => resizeObserver.disconnect();
    });
</script>


<main class="grid gap-4 min-h-0 w-full h-full my-4 rounded-3xl p-4 bg-gray-100 grid-cols-[0.1fr_1fr_0.1fr]">
    <button id="arrow_left" class="h-full w-fit px-6 col-span-1 disabled:opacity-30" onclick={prevPage} disabled={currentPage <= 1}>
        <img src={arrowLeft} alt="Arrow Left" class=""/>
    </button>
    <div id="gallery" bind:this={galleryEl} class="bg-red col-span-1 w-full h-full rounded-2xl overflow-hidden flex justify-center items-center">
        <canvas bind:this={canvasEl} class="h-full w-auto shadow-xl"></canvas>
    </div>
    <button id="arrow_right" class="h-full w-fit px-6 col-span-1 disabled:opacity-30" onclick={nextPage} disabled={currentPage + 2 > totalPages}>
        <img src={arrowRight} alt="Arrow Right" class=""/>
    </button>
</main>