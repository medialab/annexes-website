<script lang="ts">
	interface Props {
		href?: string;
		url?: string;
		label?: string;
		icon?: string;
		urgency?: 'urgent' | 'semi-urgent' | 'resolved';
		onClick?: () => void;
	}

	let props: Props = $props();
</script>

{#if props.href || props.url}
	<a
		href={props.href ?? props.url}
		target={props.href ? '_self' : '_blank'}
		rel="noopener noreferrer"
		class="pill"
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
	</a>
{:else}
	<button
		class="pill"
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
