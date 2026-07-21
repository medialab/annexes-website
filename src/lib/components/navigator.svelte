<script lang="ts">
	import type { MenuVariations } from '$lib/types';
	import { currentEdition, currentPanel, isMobile } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import shareIcon from '$lib/assets/icons/share.svg';
	import { page } from '$app/state';

	import bookIcon from '$lib/assets/icons/book.svg';
	import galleryIcon from '$lib/assets/icons/gallery.svg';
	import readerIcon from '$lib/assets/icons/reader.svg';
	import homeIcon from '$lib/assets/icons/homeIcon.svg';
	import { hasValue, webShareApi } from '$lib/utils';
	import { locale, translate } from '$lib/i18n';

	const navItems: { panel: MenuVariations; icon: string; labelKey: string }[] = [
		{ panel: 'share', icon: shareIcon, labelKey: 'nav.share' },
		{ panel: 'book', icon: bookIcon, labelKey: 'nav.book' },
		{ panel: 'gallery', icon: galleryIcon, labelKey: 'nav.gallery' },
		{ panel: 'reader', icon: readerIcon, labelKey: 'nav.reader' },
		{ panel: 'home', icon: homeIcon, labelKey: 'nav.home' }
	];
	const homeHref = resolve('/');

	const setPanel = (panel: MenuVariations) => {
		if (panel === 'home') {
			goto(homeHref);
		} else if (panel === 'share') {
			if ($isMobile && $currentEdition) {
				webShareApi($currentEdition.name, page.url.href, $currentEdition?.parentProject);
			} else {
				console.log('currentEdition', $currentEdition);
			}
		} else {
			$currentPanel = panel;
		}
	};
</script>

<div
	id="navigator"
	class="left-4 flex flex-row items-center justify-between rounded-2xl border-solid border-neutral-200 bg-white p-2 md:relative md:inset-auto md:mx-0 md:h-fit md:w-fit md:flex-col md:items-center md:justify-center md:gap-2 md:border"
>
	{#each navItems as item}
		<button
			type="button"
			class="nav-button h-full w-fit items-center justify-center gap-2 rounded-xl {$currentPanel ===
			item.panel
				? 'px-4 py-3 md:p-3'
				: 'p-3'}"
			onclick={() => setPanel(item.panel)}
			class:active={$currentPanel === item.panel}
			class:home-button={item.panel === 'home'}
			class:share-button={item.panel === 'share'}
			class:back={$currentPanel === 'home'}
			aria-label={translate($locale, item.labelKey)}
			title={translate($locale, item.labelKey)}
			data-hover={translate($locale, item.labelKey)}
		>
			<img
				src={item.icon}
				alt={translate($locale, item.labelKey)}
				class="h-full w-auto opacity-85 mix-blend-darken"
				class:active={$currentPanel === item.panel}
			/>
			{#if $currentPanel === item.panel && item.panel !== 'share'}
				<p
					class="block place-self-center align-middle font-medium text-[#005792] hover:no-underline md:hidden"
				>
					{translate($locale, item.labelKey)}
				</p>
			{/if}
		</button>
	{/each}
</div>

<style>
	.nav-button {
		transition: background-color 150ms ease-in-out;
	}

	.nav-button img {
		transition: filter 150ms ease-in-out;
	}

	.nav-button:is(:hover, .active) {
		background-color: #e9f6ff;
	}

	.nav-button.home-button {
		background-color: #ffd9d9 !important;
		opacity: 1 !important;
	}

	.nav-button.home-button:hover {
		background-color: #e69e9e !important;
		opacity: 1 !important;
	}

	.nav-button.share-button {
		background-color: #ffffff !important;
	}

	.nav-button.home-button > img:not(.active) {
		opacity: 1;
		filter: hue-rotate(120deg);
	}

	img:not(.active) {
		filter: saturate(0%);
	}

	.nav-button:not(:is(:hover, .active)) {
		background-color: rgb(247, 247, 247);
	}

	.nav-button:not(:is(:hover, .active)) img {
		opacity: 0.2;
	}

	/* Hide share button on desktop since it only works on mobile */
	@media (min-width: 768px) {
		.nav-button.share-button {
			display: none;
		}
	}
</style>
