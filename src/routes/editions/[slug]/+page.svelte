<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	import { page } from '$app/state';
	import { getEditionElements, currentEdition } from '$lib/stores';
	import { hasValue } from '$lib/utils';
	import { SITE_ORIGIN, SITE_BASE_PATH } from '$lib/config';
	let { data } = $props();

	$effect(() => {
		if (data.correctEdition && page.url.pathname.includes('/editions')) {
			$currentEdition = data.correctEdition;
		}
	});

	const pageTitle = $derived(
		hasValue(data.correctEdition?.name)
			? `${data.correctEdition.name} | editions annexes`
			: 'editions annexes'
	);
	const pageDescription = $derived(
		hasValue(data.correctEdition?.description)
			? data.correctEdition.description
			: hasValue(data.correctEdition?.subtitle)
				? data.correctEdition.subtitle
				: 'Edition from editions annexes.'
	);
	const editionUrl = $derived(
		`${SITE_ORIGIN}${SITE_BASE_PATH}/editions/${data.correctEdition?.slug || ''}/`
	);
	const ogImageUrl = $derived(`${SITE_ORIGIN}${SITE_BASE_PATH}/og_image.png`);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={editionUrl} />
	<meta property="og:image" content={ogImageUrl} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={editionUrl} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

{#if data.correctEdition}
	<Menu currentEdition={data.correctEdition}></Menu>
{:else}
	<div class="flex h-screen w-screen items-center justify-center">
		<p class="text-neutral-500">Edition not found</p>
	</div>
{/if}
