<script lang="ts">
	import { onMount } from 'svelte';
	import { draggable } from '@thisux/sveltednd';
    import type { Edition } from '$lib/types';

	let { editions = [] } = $props<{ editions?: Edition[] }>();

	let host = $state<HTMLElement | null>(null);
	let positions = $state<{ x: number; y: number; r: number }[]>([]);
	let coords = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let pan = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let lastPointer = $state<{ x: number; y: number } | null>(null);

	const itemWidth = 220;
	const itemHeight = 320;

	function initPositions(width: number, height: number, count: number) {
		const next: { x: number; y: number; r: number }[] = [];
		const maxX = Math.max(0, width - itemWidth);
		const maxY = Math.max(0, height - itemHeight);

		for (let i = 0; i < count; i += 1) {
			const rotation = Math.random() * (5 - -5) + -5;
			next.push({
				x: Math.random() * maxX,
				y: Math.random() * maxY,
                r: rotation
			});
		}

		return next;
	}

	onMount(() => {
		if (!host) return;

		const { width, height } = host.getBoundingClientRect();
        
		positions = initPositions(width, height, editions.length);

		return mousePosition(host);
	});

	$effect(() => {
		if (!host) return;
		const { width, height } = host.getBoundingClientRect();
		positions = initPositions(width, height, editions.length);
	});

	function mousePosition(target: HTMLElement, init = { x: 0, y: 0 }) {
		coords = init;
		if (typeof window === 'undefined') return () => {};

		function clampPan(next: { x: number; y: number }) {
			if (!host || positions.length === 0) return next;
			const { width, height } = host.getBoundingClientRect();
			let minX = positions[0].x;
			let maxX = positions[0].x;
			let minY = positions[0].y;
			let maxY = positions[0].y;

			for (let i = 1; i < positions.length; i += 1) {
				const { x, y } = positions[i];
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}

			const minPanX = -minX;
			const maxPanX = Math.max(0, width - itemWidth - maxX);
			const minPanY = -minY;
			const maxPanY = Math.max(0, height - itemHeight - maxY);

			return {
				x: Math.min(Math.max(next.x, minPanX), maxPanX),
				y: Math.min(Math.max(next.y, minPanY), maxPanY)
			};
		}

		function updatePosition(e: PointerEvent) {
			const current = { x: e.clientX, y: e.clientY };
			coords = current;
			if (!lastPointer) {
				lastPointer = current;
				return;
			}

			const dx = current.x - lastPointer.x;
			const dy = current.y - lastPointer.y;
			pan = clampPan({ x: pan.x - dx, y: pan.y - dy });
			lastPointer = current;
		}

		function resetPointer() {
			lastPointer = null;
		}

		target.addEventListener('pointermove', updatePosition, { passive: true });
		target.addEventListener('pointerleave', resetPointer);
		target.addEventListener('pointercancel', resetPointer);

		return () => {
			target.removeEventListener('pointermove', updatePosition);
			target.removeEventListener('pointerleave', resetPointer);
			target.removeEventListener('pointercancel', resetPointer);
		};
	}

	function setDragImage(event: DragEvent) {
		if (!event.dataTransfer) return;
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		const rect = target.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;

		const ghost = target.cloneNode(true) as HTMLElement;
		ghost.classList.remove('opacity-0', 'invisible', 'hidden');
		ghost.style.opacity = '1';
		ghost.style.position = 'fixed';
		ghost.style.top = '-9999px';
		ghost.style.left = '-9999px';
		ghost.style.pointerEvents = 'none';
		document.body.appendChild(ghost);

		event.dataTransfer.setDragImage(ghost, offsetX, offsetY);
		setTimeout(() => ghost.remove(), 0);
	}

    
    
</script>

<section
	bind:this={host}
	class="relative w-full h-screen overflow-hidden z-0"
>
	{#each editions as edition, index}
		{@const pos = positions[index]}
		<button
			type="button"
			use:draggable={{
				container: 'canvas',
				dragData: edition,
				attributes: { draggingClass: 'opacity-0'}
			}}
			ondragstart={setDragImage}
			class="absolute left-0 top-0 h-[320px] rounded-xl overflow-hidden shadow-[0_12px_30px_rgba(15,23,42,0.16)] bg-white/90 cursor-grab active:cursor-grabbing duration-50 transition-all"
			style={pos ? `transform: translate3d(${pos.x + pan.x}px, ${pos.y + pan.y}px, 0) rotate(${pos.r}deg);` : ""}
			aria-label={edition.name}
			title={edition.name}
		>
			<img src={`/editions/${edition.coverImg}`} alt={edition.name} class="h-full w-full object-cover" />
		</button>
	{/each}
</section>
