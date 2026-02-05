<script>
    let {currentEdition} = $props();

    import arrowLeft from "$lib/assets/icons/arrowLeft.svg";
    import arrowRight from "$lib/assets/icons/arrowRight.svg";

    import testImg from "$lib/assets/test.png";
</script>

<main class="grid gap-4 min-h-0 w-full h-full my-4 rounded-3xl p-4 bg-gray-100 grid-cols-[0.1fr_1fr_0.1fr]">
    <button id="arrow_left" class="h-full w-fit px-6 col-span-1">
        <img src={arrowLeft} alt="Arrow Left" class=""/>
    </button>
    <div id="gallery" class="bg-red col-span-1 w-full h-full rounded-2xl overflow-hidden">
        <img src={testImg} alt="Test Image" class="w-full h-full object-cover"/>
    </div>
    <button id="arrow_right" class="h-full w-fit px-6 col-span-1">
        <img src={arrowRight} alt="Arrow Right" class=""/>
    </button>
</main>