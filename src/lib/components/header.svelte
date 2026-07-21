<script lang="ts">
	import annexesIcon from '$lib/assets/icons/annexes.png';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { homeHref } from '$lib/stores';
	import { locale } from '$lib/i18n';
</script>

<header class="fixed top-2 left-4 right-4 z-30 flex items-start justify-between">
	<a
		href={homeHref}
		onclick={() => goto(homeHref)}
		class="flex h-fit items-center justify-center rounded-2xl bg-white px-2 py-1"
	>
		<img src={annexesIcon} alt="annexes logo" class="h-7.5 w-auto" />
	</a>
	<div class="flex h-fit items-center gap-1 rounded-2xl bg-white px-2 py-2">
		<button
			type="button"
			class="text-xs px-2 py-1 rounded-lg {$locale === 'en' ? 'bg-neutral-200 font-medium' : 'text-neutral-400'}"
			onclick={() => $locale = 'en'}
			aria-label="Switch to English"
		>EN</button>
		<button
			type="button"
			class="text-xs px-2 py-1 rounded-lg {$locale === 'fr' ? 'bg-neutral-200 font-medium' : 'text-neutral-400'}"
			onclick={() => $locale = 'fr'}
			aria-label="Passer en français"
		>FR</button>
	</div>
</header>
