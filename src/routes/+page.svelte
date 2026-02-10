<script>
	import Canvas from '$lib/components/canvas.svelte';
	import { allEditions } from '$lib/stores';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<Header></Header>

<Footer></Footer>

<div class="mt-24 h-fit w-full md:fixed md:m-0 md:h-screen">
	<Canvas editions={$allEditions}></Canvas>
</div>
