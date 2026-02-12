<script>
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

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
