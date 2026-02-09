<script lang="ts">
	import { onMount } from 'svelte';
	import DeviceInfo from 'svelte-device-info';
	import { isMobile } from '$lib/stores';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fly, scale, slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Canvas from '$lib/components/canvas.svelte';
	import { allEditions } from '$lib/stores';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();

	onMount(() => {
		const updateMobileStatus = () => {
			isMobile.set(DeviceInfo.isMobile || window.innerWidth < 768);
		};

		updateMobileStatus();
		window.addEventListener('resize', updateMobileStatus);

		return () => {
			window.removeEventListener('resize', updateMobileStatus);
		};
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#key page.url.pathname}
	<main in:scale={{ duration: 200, start: 0.95 }} out:scale={{ duration: 200, start: 0.95 }}>
		{@render children()}
	</main>
{/key}

<Header></Header>

<Footer></Footer>

<div class="mt-24 h-fit w-full md:fixed md:m-0 md:h-screen">
	<Canvas editions={$allEditions}></Canvas>
</div>
