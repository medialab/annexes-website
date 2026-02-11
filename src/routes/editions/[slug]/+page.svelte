<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	let { data } = $props();
</script>

<Menu currentEdition={data.correctEdition}></Menu>
