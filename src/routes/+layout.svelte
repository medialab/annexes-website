<script lang="ts">
	import { onMount } from 'svelte';
	import DeviceInfo from 'svelte-device-info';
	import { isMobile } from '$lib/stores';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

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
{@render children()}
