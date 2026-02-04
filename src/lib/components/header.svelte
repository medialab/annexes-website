<script>
    import Button from "./button.svelte";
    import homeIcon from "$lib/assets/icons/house.svg";
    import burgerIcon from "$lib/assets/icons/burger.svg";
    import annexesIcon from "$lib/assets/icons/annexes.png";
</script>

<header class="max-w-[1200px] w-full place-self-center top-6 fixed bg-white flex justify-between p-2 rounded-2xl items-center h-fit md:mx-0 mx-2 z-2">
    <div class="hidden md:block">
        <Button label="Home" icon={homeIcon} href="/"></Button>
    </div>
	
    <img src={annexesIcon} alt="annexes logo" class="h-[30px] w-auto">
    <div class="hidden md:block">
        <Button label="Menu" icon={burgerIcon} href="/"></Button>
    </div>
    <div class="md:hidden">
        <Button icon={burgerIcon} href="/"></Button>
    </div>
</header>
