<script lang="ts">
	import Header from "$lib/components/header.svelte";
	import Footer from "$lib/components/footer.svelte";
	import Canvas from "$lib/components/canvas.svelte";
    import Menu from "$lib/components/menu.svelte";

	let editions = [
        {
            name: "Artificial Inquiries",
            coverimg: "Artificial-Inquiries.png"
        },
        {
            name: "Styles de moderation",
            coverimg: "styles.png"
        },
    ]
</script>

<Header></Header>
<Menu></Menu>

<div class="w-full h-screen fixed">
    <Canvas {editions}></Canvas>
</div>

<Footer></Footer>
