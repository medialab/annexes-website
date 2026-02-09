<script>
	import Button from './button.svelte';
	import homeIcon from '$lib/assets/icons/house.svg';
	import burgerIcon from '$lib/assets/icons/burger.svg';
	import annexesIcon from '$lib/assets/icons/annexes.png';
</script>

<header
	class="fixed top-6 right-4 left-4 z-2 flex h-fit items-center justify-between rounded-2xl bg-white p-2 md:right-auto md:left-1/2 md:w-full md:max-w-[60%] md:-translate-x-1/2"
>
	<div class="hidden md:block">
		<Button label="Home" icon={homeIcon} href="/"></Button>
	</div>

	<img src={annexesIcon} alt="annexes logo" class="h-[30px] w-auto" />
	<div class="hidden md:block">
		<Button label="Menu" icon={burgerIcon} href="/"></Button>
	</div>
	<div class="md:hidden">
		<Button icon={burgerIcon} href="/"></Button>
	</div>
</header>
