<script lang="ts">
	let { currentEdition } = $props();

	import arrowLeft from '$lib/assets/icons/arrowLeft.svg';
	import arrowRight from '$lib/assets/icons/arrowRight.svg';

	import { onMount } from 'svelte';

	let canvasEl: HTMLCanvasElement;
	let galleryEl: HTMLDivElement;
	let currentPage = $state(1);
	let totalPages = $state(0);
	let pdfUrl = '/editions/test.pdf';

	let pdfDocument: any = null;
	let renderTask: any = null;

	async function loadPdf(url: string) {
		const pdfjsLib = await import('pdfjs-dist');
		pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

		pdfDocument = await pdfjsLib.getDocument(url).promise;
		totalPages = pdfDocument.numPages;
		renderPdfToCanvas(currentPage);
	}

	async function renderPdfToCanvas(startPage: number) {
		if (!canvasEl || !pdfDocument) return;

		if (renderTask) {
			renderTask.cancel();
			renderTask = null;
		}

		try {
			const ctx = canvasEl.getContext('2d')!;
			const dpr = window.devicePixelRatio || 1;
			const qualityMultiplier = 1.5;
			const cHeight = galleryEl.clientHeight || 800;

			const page1 = await pdfDocument.getPage(startPage);
			const viewport1Raw = page1.getViewport({ scale: 1 });
			const scale1 = (cHeight / viewport1Raw.height) * dpr * qualityMultiplier;
			const scaledViewport1 = page1.getViewport({ scale: scale1 });

			let totalWidth = scaledViewport1.width;
			let p2 = null;
			let scaledViewport2 = null;

			if (startPage + 1 <= totalPages) {
				p2 = await pdfDocument.getPage(startPage + 1);
				const viewport2Raw = p2.getViewport({ scale: 1 });
				const scale2 = (cHeight / viewport2Raw.height) * dpr * qualityMultiplier;
				scaledViewport2 = p2.getViewport({ scale: scale2 });
				totalWidth += scaledViewport2.width;
			}

			canvasEl.width = totalWidth;
			canvasEl.height = cHeight * dpr * qualityMultiplier;

			renderTask = page1.render({
				canvas: canvasEl,
				canvasContext: ctx,
				viewport: scaledViewport1
			});
			await renderTask.promise;

			if (p2 && scaledViewport2) {
				ctx.save();
				ctx.translate(scaledViewport1.width, 0);
				renderTask = p2.render({
					canvas: canvasEl,
					canvasContext: ctx,
					viewport: scaledViewport2
				});
				await renderTask.promise;
				ctx.restore();
			}
			renderTask = null;
		} catch (error: any) {
			if (error.name === 'RenderingCancelledException') {
				// Rendering cancelled, ignore
			} else {
				console.error('Error rendering PDF:', error);
			}
		}
	}

	$effect(() => {
		if (currentPage && pdfDocument) {
			renderPdfToCanvas(currentPage);
		}
	});

	function nextPage() {
		if (currentPage + 2 <= totalPages) currentPage += 2;
	}

	function prevPage() {
		if (currentPage - 2 >= 1) currentPage -= 2;
	}

	onMount(() => {
		loadPdf(pdfUrl);
		const resizeObserver = new ResizeObserver(() => {
			if (pdfDocument) renderPdfToCanvas(currentPage);
		});
		resizeObserver.observe(galleryEl);
		return () => resizeObserver.disconnect();
	});
</script>

<main
	class="my-4 grid h-full min-h-0 w-full grid-cols-[0.1fr_1fr_0.1fr] gap-4 rounded-3xl bg-neutral-100 p-4"
>
	<button
		id="arrow_left"
		class="col-span-1 h-full w-fit px-6 disabled:opacity-30"
		onclick={prevPage}
		disabled={currentPage <= 1}
	>
		<img src={arrowLeft} alt="Arrow Left" class="" />
	</button>
	<div
		id="gallery"
		bind:this={galleryEl}
		class="bg-red col-span-1 flex h-full w-full items-center justify-center overflow-hidden rounded-2xl"
	>
		<canvas bind:this={canvasEl} class="h-full w-auto shadow-xl"></canvas>
	</div>
	<button
		id="arrow_right"
		class="col-span-1 h-full w-fit px-6 disabled:opacity-30"
		onclick={nextPage}
		disabled={currentPage + 2 > totalPages}
	>
		<img src={arrowRight} alt="Arrow Right" class="" />
	</button>
</main>
