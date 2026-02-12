<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { page } from '$app/state';
	import ogImage from '$lib/assets/og_image.png';

	const pageTitle = 'About | editions annexes';
	const pageDescription =
		'Presentation du projet editions annexes: publier la recherche hors des formats editoriaux scientifiques classiques.';
	const socialImageUrl = $derived(new URL(ogImage, page.url.origin).href);
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
<main class="absolute z-5 flex h-dvh w-dvw items-center justify-center md:pointer-events-none">
	<div
		class="flex h-dvh w-full flex-col items-center justify-start overflow-scroll bg-neutral-100 p-4 py-30 md:h-fit md:w-4/5 md:justify-center md:overflow-hidden md:py-0"
	>
		<h1 class=" text-neutral-400">
			éditions annexes est un projet éditorial qui publie des résultats de recherche en dehors des
			circuits classiques de l’édition scientifique. Il ne prétend pas s’y substituer, mais propose
			de la compléter, en élargissant l’éventail des formats éditoriaux grâce auxquels une recherche
			peut se partager : modes d’emploi, exercices, protocoles, zine, matériau empirique brut,
			poster, etc. éditions annexes propose en retour de s’interroger sur le rôle des formats dans
			l’édition scientifique. L’idée directrice du projet est d’inverser le rapport d’importance
			entre le texte d’une publication et son péritexte (notes de bas de page, illustrations et
			figures, annexes), grâce à un travail d’édition et de design graphique adapté à chaque objet.
			Enfin, ce mode de publication est rapide, peu onéreux et entièrement autogéré, permettant
			ainsi de fabriquer des comptes rendus d’une recherche vivante, en train de se faire.
		</h1>
	</div>
</main>
