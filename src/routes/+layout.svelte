<script lang="ts">
	import { onMount } from 'svelte';
	import DeviceInfo from 'svelte-device-info';
	import { isMobile } from '$lib/stores';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Canvas from '$lib/components/canvas.svelte';
	import { allEditions } from '$lib/stores';
	import CursorPill from '$lib/components/cursor_pill.svelte';

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

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:site_name" content="editions annexes" />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="fr_FR" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

{#key page.url.pathname}
	<main in:slide={{ duration: 500, delay: 100 }} out:slide={{ duration: 300 }} class="relative z-20">
		{@render children()}
	</main>
{/key}

<div class="relative z-10 h-dvh w-full overflow-y-scroll md:fixed md:m-0">
	<Canvas editions={$allEditions}></Canvas>
</div>

<CursorPill></CursorPill>
