<script>
	let { currentEdition } = $props();

	import arrowLeft from '$lib/assets/icons/arrowLeft.svg';
	import arrowRight from '$lib/assets/icons/arrowRight.svg';

	import testImg from '$lib/assets/test.png';
</script>

<main
	class="my-4 grid h-fit min-h-0 w-full grid-cols-[0.1fr_1fr_0.1fr] items-center gap-4 rounded-3xl border-2 border-solid border-neutral-200 bg-neutral-100 p-4"
>
	<button id="arrow_left" class="col-span-1 h-full w-fit px-6">
		<img src={arrowLeft} alt="Arrow Left" class="" />
	</button>
	<div id="gallery" class="bg-red col-span-1 aspect-4/3 h-auto w-full overflow-hidden rounded-2xl">
		<img src={testImg} alt="Test" class="h-full w-full place-self-center object-cover" />
	</div>
	<button id="arrow_right" class="col-span-1 h-full w-fit px-6">
		<img src={arrowRight} alt="Arrow Right" class="" />
	</button>
</main>
