<script lang="ts">
    interface Props {
        href?: string;
        url?: string;
        label?: string;
        icon?: string;
    }

    let props: Props = $props();
</script>

{#if props.href || props.url}
    <a href={props.href ?? props.url} target={props.href ? "_self" : "_blank"} rel="noopener noreferrer" class="pill">
        {#if props.label}
            <p>{props.label}</p>
        {/if}
        {#if props.icon}
            <img src={props.icon} alt={props.label ? `${props.label} icon` : "icon"}>
        {/if}
    </a>
{/if}