<script lang="ts">
	import annexesIcon from '$lib/assets/icons/annexes.png';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { homeHref } from '$lib/stores';
	import { locale } from '$lib/i18n';
</script>

<header
	class="fixed top-6 right-4 left-4 z-30 flex h-12.5 items-center justify-between rounded-2xl bg-white p-2 md:right-auto md:left-1/2 md:w-full md:max-w-[60%] md:-translate-x-1/2"
>
	<a
		href={homeHref}
		onclick={() => goto(homeHref)}
		class="flex h-full flex-col items-center justify-center overflow-clip"
	>
		<img src={annexesIcon} alt="annexes logo" class="h-7.5 w-auto" />
	</a>
	<div class="flex gap-1">
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
