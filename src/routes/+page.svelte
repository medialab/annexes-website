<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Canvas from '$lib/components/canvas.svelte';
	import Menu from '$lib/components/menu.svelte';

	let { data } = $props();
</script>

<Header></Header>
<Menu></Menu>

<div class="mt-24 h-fit w-full md:fixed md:m-0 md:h-screen">
	<Canvas editions={data.editions}></Canvas>
</div>

<Footer></Footer>
