<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { page } from '$app/state';
	import { asset } from '$app/paths';

	const pageTitle = 'editions annexes';
	const pageDescription =
		'Projet editorial du medialab Sciences Po publie en editions annexes: formats de recherche, protocoles, zines et materiaux.';
	const socialImageUrl = $derived(new URL(asset('/og_image.png'), page.url.href).href);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:image" content={socialImageUrl} />
	<meta property="og:image:alt" content={pageTitle} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={socialImageUrl} />
</svelte:head>

<Header></Header>

<Footer></Footer>
