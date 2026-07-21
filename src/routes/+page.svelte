<script lang="ts">
	import { browser } from '$app/environment';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { page } from '$app/state';
	import { asset } from '$app/paths';
	import { allEditions, restCursorText, copyText, currentEdition } from '$lib/stores';
	import Canvas from '$lib/components/canvas.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { homeHref } from '$lib/stores';

	function handleDescriptionClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains('brand-link')) {
			copyText('annexes@medialab.com');
		}
	}

	function handleDescriptionKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains('brand-link') && e.key === 'Enter') {
			copyText('annexes@medialab.com');
		}
	}
	import { locale, translate } from '$lib/i18n';
	import { SITE_ORIGIN, SITE_BASE_PATH } from '$lib/config';

	let isPageReady = $state(false);
	let prefersReducedMotion = $state(false);

	onMount(() => {
		if (!browser) return;
		setTimeout(() => {
			isPageReady = true;
		}, 400);
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<div
	class="relative z-10 h-dvh h-screen w-full cursor-help overflow-y-scroll md:fixed md:m-0"
	class:showing={isPageReady}
	class:not-showing={!isPageReady}
	data-hover={$restCursorText}
	onclick={() => copyText('axel.meunier@sciencespo.fr, donato.ricci@sciencespo.fr')}
	onkeydown={(e) => e.key === 'Enter' && copyText('axel.meunier@sciencespo.fr, donato.ricci@sciencespo.fr')}
	role="button"
	tabindex="0"
>
	{#if $allEditions && $allEditions.length > 0}
		<Canvas editions={$allEditions}></Canvas>
	{:else}
		<div class="flex h-full items-center justify-center">
			<p class="text-neutral-400">missing data</p>
		</div>
	{/if}
</div>

<main
	class="fixed -z-10 flex h-dvh h-screen w-dvw w-screen items-center justify-center"
	id="about_text"
	class:opacized={$currentEdition !== null}
>
	<div
		class="z-10 flex h-full w-full flex-col items-start justify-start gap-4 overflow-visible bg-neutral-100 p-4 py-30 text-neutral-200 md:h-fit md:w-4/5 md:justify-center md:overflow-hidden md:py-0"
		role="presentation"
		onclick={handleDescriptionClick}
		onkeydown={handleDescriptionKeydown}
	>
		<div in:fly={{ y: 50, duration: 300, easing: cubicInOut, delay: 0 }}
			out:fly={{ y: 50, duration: 300, easing: cubicInOut, delay: 200 }}>
		{#key $locale}
			{@const brand = `<span class="brand-link cursor-pointer text-neutral-500" role="button" tabindex="0">éditions annexes</span>`}
			{@const msg = translate($locale, 'home.dropMessage')}
			{@const linkHtml = `<span class="brand-link cursor-pointer text-neutral-500" role="button" tabindex="0">${msg}</span>`}
			<h1 class="">
				{@html translate($locale, 'home.description.p1', { brand })}
				{@html translate($locale, 'home.description.p2', { brand })}
			</h1>
			<h2>
				{@html translate($locale, 'home.collaboration', { link: linkHtml })}
			</h2>
		{/key}
		</div>
	</div>

	<button
		class="absolute z-0 h-full w-full cursor-alias"
		aria-label="Close"
		onclick={() => goto(homeHref)}
		onkeydown={(e) => e.key === 'Escape' && goto(homeHref)}
	></button>
</main>

<style>
	.showing {
		transition: opacity 1s ease-in-out;
		opacity: 1;
	}

	.not-showing {
		opacity: 0;
		transition: opacity 1s ease-in-out;
	}

	.opacized {
		opacity: 0.1;
		transition:
			opacity 0.6s ease-in-out,
			filter 0.6s ease-in-out;
		filter: blur(10px);
	}

	:not(.opacized) {
		transition:
			opacity 0.6s ease-in-out,
			filter 0.6s ease-in-out;
		filter: blur(0);
	}
</style>
