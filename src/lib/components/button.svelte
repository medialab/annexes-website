<script lang="ts">
	interface Props {
		href?: string;
		url?: string;
		label?: string;
		icon?: string;
		urgency?: 'urgent' | 'semi-urgent' | 'resolved';
		onClick?: () => void;
		download?: boolean;
	}

	let props: Props = $props();
	const linkHref = $derived(props.href ?? props.url ?? '');

	function isExternalLink(url: string) {
		return /^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:');
	}

	const isExternal = $derived(isExternalLink(linkHref));
</script>

{#if props.href || props.url}
	<a
		href={linkHref}
		target={isExternal ? '_blank' : '_self'}
		rel={isExternal ? 'noopener noreferrer' : undefined}
		class="pill {props.icon && props.label ? 'px-4' : 'px-0'}"
		class:urgent={props?.urgency === 'urgent'}
		class:semi-urgent={props?.urgency === 'semi-urgent'}
		class:resolved={props?.urgency === 'resolved'}
		onclick={props.onClick}
		data-sveltekit-preload-data="hover"
		download={props.download}
	>
		{#if props.label}
			<p>{props.label}</p>
		{/if}
		{#if props.icon}
			<img src={props.icon} alt={props.label ? `${props.label} icon` : 'icon'} />
		{/if}
	</a>
{:else}
	<button
		class="pill {props.icon && props.label ? 'px-4' : 'px-0'}"
		class:urgent={props?.urgency === 'urgent'}
		class:semi-urgent={props?.urgency === 'semi-urgent'}
		class:resolved={props?.urgency === 'resolved'}
		onclick={props.onClick}
	>
		{#if props.label}
			<p>{props.label}</p>
		{/if}
		{#if props.icon}
			<img src={props.icon} alt={props.label ? `${props.label} icon` : 'icon'} />
		{/if}
	</button>
{/if}
