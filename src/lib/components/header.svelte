<script>
	import Button from './button.svelte';
	import infoIcon from '$lib/assets/icons/info.svg';
	import annexesIcon from '$lib/assets/icons/annexes.png';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
</script>

<header
	class="fixed top-6 right-4 left-4 z-30 flex h-[50px] items-center justify-between rounded-2xl bg-white p-2 md:right-auto md:left-1/2 md:w-full md:max-w-[60%] md:-translate-x-1/2"
>
	<a
		href="/"
		onclick={() => goto(resolve('/'))}
		class="flex h-full flex-col items-center justify-center overflow-clip"
	>
		<img src={annexesIcon} alt="annexes logo" class="h-[30px] w-auto" />
	</a>

	<div class="hidden md:block">
		<Button label="About" icon={infoIcon} href="/about" onClick={() => goto(resolve('/about'))}
		></Button>
	</div>
	<div class="md:hidden">
		<Button icon={infoIcon} href="/about" onClick={() => goto(resolve('/about'))}></Button>
	</div>
</header>
