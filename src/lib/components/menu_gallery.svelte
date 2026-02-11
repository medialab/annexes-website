<script lang="ts">
	let { currentEdition } = $props();

	import arrowLeft from '$lib/assets/icons/arrowLeft.svg';
	import arrowRight from '$lib/assets/icons/arrowRight.svg';

	import testImg from '$lib/assets/test.png';

	function preventAssetCopy(event: Event) {
		event.preventDefault();
	}
</script>

<main class="viewer_main">
	<button
		id="arrow_left"
		type="button"
		class="col-start-1 row-start-2 flex h-full w-full items-center justify-center px-2 md:col-start-auto md:row-start-auto md:px-6"
		data-hover="Previous image"
	>
		<img src={arrowLeft} alt="Arrow Left" class="" />
	</button>
	<div
		id="gallery"
		class="col-span-2 row-start-1 flex h-full min-h-0 w-full items-center justify-center py-4 md:col-span-1 md:row-start-auto"
	>
		<img
			src={testImg}
			alt="Test"
			class="protected-image h-full w-full max-w-full overflow-hidden rounded-2xl object-cover"
			draggable="false"
			oncontextmenu={preventAssetCopy}
			ondragstart={preventAssetCopy}
			oncopy={preventAssetCopy}
			oncut={preventAssetCopy}
			onselectstart={preventAssetCopy}
		/>
	</div>
	<button
		id="arrow_right"
		type="button"
		class="col-start-2 row-start-2 flex h-full w-full items-center justify-center px-2 md:col-start-auto md:row-start-auto md:px-6"
		data-hover="Next image"
	>
		<img src={arrowRight} alt="Arrow Right" class="" />
	</button>
</main>

<style>
	.protected-image {
		-webkit-user-drag: none;
		user-select: none;
		-webkit-user-select: none;
	}
</style>
