<script lang="ts">
	import { onMount } from 'svelte';
	import { draggable } from '@thisux/sveltednd';
	import { currentEdition, isFooterOpen, getEditionCover, openPanel } from '$lib/stores';
	import type { Edition } from '$lib/types';

	let { editions = [] } = $props<{ editions?: Edition[] }>();

	let dummyEditions = $derived([...editions, ...editions, ...editions, ...editions]);

	let host = $state<HTMLElement | null>(null);
	let positions = $state<{ x: number; y: number; r: number }[]>([]);
	let coords = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let pan = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let lastPointer = $state<{ x: number; y: number } | null>(null);

	const itemWidth = 220;
	const itemHeight = 320;
	const minPlaygroundScaleX = 2.2;
	const minPlaygroundScaleY = 1.8;
	const minGapX = 40;
	const minGapY = 48;

	function getPositionBounds(items: { x: number; y: number }[]) {
		if (items.length === 0) {
			return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
		}

		let minX = items[0].x;
		let maxX = items[0].x;
		let minY = items[0].y;
		let maxY = items[0].y;

		for (let i = 1; i < items.length; i += 1) {
			const { x, y } = items[i];
			if (x < minX) minX = x;
			if (x > maxX) maxX = x;
			if (y < minY) minY = y;
			if (y > maxY) maxY = y;
		}

		return { minX, maxX, minY, maxY };
	}

	function clampPanToPlayground(
		next: { x: number; y: number },
		width: number,
		height: number,
		items: { x: number; y: number }[]
	) {
		if (items.length === 0) return next;

		const { minX, maxX, minY, maxY } = getPositionBounds(items);
		const minPanX = -minX;
		const maxPanX = Math.max(0, width - itemWidth - maxX);
		const minPanY = -minY;
		const maxPanY = Math.max(0, height - itemHeight - maxY);

		return {
			x: Math.min(Math.max(next.x, minPanX), maxPanX),
			y: Math.min(Math.max(next.y, minPanY), maxPanY)
		};
	}

	function getCenteredPan(width: number, height: number, items: { x: number; y: number }[]) {
		if (items.length === 0) return { x: 0, y: 0 };

		const { minX, maxX, minY, maxY } = getPositionBounds(items);
		const contentWidth = maxX - minX + itemWidth;
		const contentHeight = maxY - minY + itemHeight;

		return {
			x: (width - contentWidth) / 2 - minX,
			y: (height - contentHeight) / 2 - minY
		};
	}

	function touchesAny(
		candidate: { x: number; y: number },
		placed: { x: number; y: number }[],
		gapX: number,
		gapY: number
	) {
		for (let i = 0; i < placed.length; i += 1) {
			const other = placed[i];
			const separatedX =
				candidate.x + itemWidth + gapX <= other.x || other.x + itemWidth + gapX <= candidate.x;
			const separatedY =
				candidate.y + itemHeight + gapY <= other.y || other.y + itemHeight + gapY <= candidate.y;
			if (!(separatedX || separatedY)) return true;
		}
		return false;
	}

	function tryGenerateScatterPositions(
		count: number,
		playgroundWidth: number,
		playgroundHeight: number,
		paddingX: number,
		paddingY: number,
		gapX: number,
		gapY: number
	) {
		const next: { x: number; y: number; r: number }[] = [];
		const maxAttemptsPerItem = 240;
		const minX = paddingX;
		const maxX = Math.max(minX, playgroundWidth - itemWidth - paddingX);
		const minY = paddingY;
		const maxY = Math.max(minY, playgroundHeight - itemHeight - paddingY);

		for (let i = 0; i < count; i += 1) {
			let placed = false;

			for (let attempt = 0; attempt < maxAttemptsPerItem; attempt += 1) {
				const x = minX + Math.random() * Math.max(0, maxX - minX);
				const y = minY + Math.random() * Math.max(0, maxY - minY);
				const candidate = { x, y };

				if (touchesAny(candidate, next, gapX, gapY)) continue;

				next.push({
					x,
					y,
					r: Math.random() * 16 - 8
				});
				placed = true;
				break;
			}

			if (!placed) return null;
		}

		return next;
	}

	function shuffledGridFallback(
		count: number,
		playgroundWidth: number,
		playgroundHeight: number,
		paddingX: number,
		paddingY: number,
		gapX: number,
		gapY: number
	) {
		const cellWidth = itemWidth + gapX;
		const cellHeight = itemHeight + gapY;
		const cols = Math.max(1, Math.floor((playgroundWidth - paddingX * 2) / cellWidth));
		const rows = Math.max(1, Math.floor((playgroundHeight - paddingY * 2) / cellHeight));
		const cells: Array<{ x: number; y: number }> = [];

		for (let row = 0; row < rows; row += 1) {
			for (let col = 0; col < cols; col += 1) {
				cells.push({
					x: paddingX + col * cellWidth,
					y: paddingY + row * cellHeight
				});
			}
		}

		for (let i = cells.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[cells[i], cells[j]] = [cells[j], cells[i]];
		}

		const selected = cells.slice(0, count);
		if (selected.length < count) return null;

		const jitterX = Math.max(0, Math.min(gapX * 0.35, cellWidth - itemWidth));
		const jitterY = Math.max(0, Math.min(gapY * 0.35, cellHeight - itemHeight));

		return selected.map((cell) => ({
			x: cell.x + Math.random() * jitterX,
			y: cell.y + Math.random() * jitterY,
			r: Math.random() * 16 - 8
		}));
	}

	function initPositions(width: number, height: number, count: number) {
		if (count === 0) return [];

		const gapX = minGapX;
		const gapY = minGapY;
		const paddingX = Math.max(140, width * 0.22);
		const paddingY = Math.max(120, height * 0.2);
		const aspectRatio = Math.max(0.8, width / Math.max(height, 1));
		const itemFootprint = (itemWidth + gapX) * (itemHeight + gapY);

		let playgroundWidth = Math.max(
			width * minPlaygroundScaleX,
			Math.sqrt(count * itemFootprint * aspectRatio) * 1.35 + paddingX * 2
		);
		let playgroundHeight = Math.max(
			height * minPlaygroundScaleY,
			(count * itemFootprint) / Math.max(playgroundWidth - paddingX * 2, 1) + paddingY * 2
		);

		for (let pass = 0; pass < 6; pass += 1) {
			const scattered = tryGenerateScatterPositions(
				count,
				playgroundWidth,
				playgroundHeight,
				paddingX,
				paddingY,
				gapX,
				gapY
			);
			if (scattered) return scattered;
			playgroundWidth *= 1.2;
			playgroundHeight *= 1.2;
		}

		const fallback = shuffledGridFallback(
			count,
			playgroundWidth,
			playgroundHeight,
			paddingX,
			paddingY,
			gapX,
			gapY
		);

		if (fallback) return fallback;
		return [];
	}

	onMount(() => {
		if (!host) return;

		const { width, height } = host.getBoundingClientRect();
		const nextPositions = initPositions(width, height, dummyEditions.length);
		positions = nextPositions;
		pan = clampPanToPlayground(getCenteredPan(width, height, nextPositions), width, height, nextPositions);

		return mousePosition(host);
	});

	$effect(() => {
		if (!host) return;
		const { width, height } = host.getBoundingClientRect();
		const nextPositions = initPositions(width, height, dummyEditions.length);
		positions = nextPositions;
		pan = clampPanToPlayground(getCenteredPan(width, height, nextPositions), width, height, nextPositions);
	});

	function mousePosition(target: HTMLElement, init = { x: 0, y: 0 }) {
		coords = init;
		if (typeof window === 'undefined') return () => {};

		function updatePosition(e: PointerEvent) {
			if (!host) return;
			const current = { x: e.clientX, y: e.clientY };
			coords = current;
			if (!lastPointer) {
				lastPointer = current;
				return;
			}

			const dx = current.x - lastPointer.x;
			const dy = current.y - lastPointer.y;
			const { width, height } = host.getBoundingClientRect();
			pan = clampPanToPlayground({ x: pan.x - dx, y: pan.y - dy }, width, height, positions);
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
	class="relative top-12 z-0 flex w-full flex-col items-center justify-center gap-12 overflow-y-scroll md:relative md:top-0 md:block md:h-screen md:gap-0 md:overflow-hidden"
>
	{#each dummyEditions as edition, index}
		{@const pos = positions[index]}
		{@const coverImg = getEditionCover(edition.name)}
		<button
			type="button"
			use:draggable={{
				container: 'canvas',
				dragData: edition,
				attributes: { draggingClass: 'opacity-0' }
			}}
			ondragstart={setDragImage}
			ondragend={() => ($isFooterOpen = false)}
			onpointerdown={() => ($isFooterOpen = true)}
			onpointerup={() => ($isFooterOpen = false)}
			class="absolute top-0 left-0 hidden h-[250px] cursor-grab overflow-hidden rounded-md bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all duration-50 active:cursor-grabbing md:block"
			style={pos
				? `transform: translate3d(${pos.x + pan.x}px, ${pos.y + pan.y}px, 0) rotate(${pos.r}deg);`
				: ''}
			aria-label={edition.name}
			title={edition.name}
		>
			<img src={coverImg} alt={edition.name} class="h-full w-full object-cover" />
		</button>
		<!-- mobile version -->
		<button
			class="mx-12 block h-[250px] rounded-md bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:hidden"
			type="button"
			aria-label={edition.name}
			title={edition.name}
			onclick={() => openPanel(edition)}
		>
			<img src={coverImg} alt={edition.name} class="h-full w-full object-cover" />
		</button>
	{/each}
</section>
