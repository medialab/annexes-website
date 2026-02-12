<script lang="ts">
	import { onMount } from 'svelte';
	import { draggable, type DragDropState } from '@thisux/sveltednd';
	import {
		isFooterOpen,
		getEditionCover,
		openPanel,
		hideFooter,
		isTitleShowing,
		currentEdition,
		isCoverDragging
	} from '$lib/stores';
	import { DND_SOURCE_CONTAINER } from '$lib/constants/dnd';
	import type { Edition } from '$lib/types';
	import { cubicInOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { editions = [] } = $props<{ editions?: Edition[] }>();

	let dummyEditions = $derived([...editions]);

	type Placement = {
		x: number;
		y: number;
		width: number;
		rotate: number;
	};

	type SceneBounds = {
		minX: number;
		maxX: number;
		minY: number;
		maxY: number;
	};

	let host = $state<HTMLElement | null>(null);
	let placements = $state<Placement[]>([]);
	let hoveredIndex = $state<number | null>(null);
	let mouse = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	let viewport = $state<{ width: number; height: number }>({ width: 0, height: 0 });
	let sceneBounds = $state<SceneBounds>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
	let isHoveringCover = $state(false);
	let isDraggingCover = $state(false);
	let isNativeDragInProgress = false;
	let dragGhostElement: HTMLElement | null = null;

	const coverAspectRatio = 4 / 3;
	const scenePadding = 36;
	const minItemGap = 44;

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function randomBetween(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function intersects(a: Placement, b: Placement, gap = minItemGap) {
		const aHeight = a.width * coverAspectRatio;
		const bHeight = b.width * coverAspectRatio;
		const separatedX = a.x + a.width + gap <= b.x || b.x + b.width + gap <= a.x;
		const separatedY = a.y + aHeight + gap <= b.y || b.y + bHeight + gap <= a.y;
		return !(separatedX || separatedY);
	}

	function getPlacementBounds(items: Placement[]): SceneBounds {
		if (items.length === 0) {
			return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
		}

		let minX = items[0].x;
		let minY = items[0].y;
		let maxX = items[0].x + items[0].width;
		let maxY = items[0].y + items[0].width * coverAspectRatio;

		for (let i = 1; i < items.length; i += 1) {
			const item = items[i];
			const itemMaxX = item.x + item.width;
			const itemMaxY = item.y + item.width * coverAspectRatio;

			if (item.x < minX) minX = item.x;
			if (item.y < minY) minY = item.y;
			if (itemMaxX > maxX) maxX = itemMaxX;
			if (itemMaxY > maxY) maxY = itemMaxY;
		}

		return { minX, maxX, minY, maxY };
	}

	function centerPlacements(items: Placement[], width: number, height: number, padding: number) {
		if (items.length === 0) return items;

		const bounds = getPlacementBounds(items);
		const targetDx = width / 2 - (bounds.minX + bounds.maxX) / 2;
		const targetDy = height / 2 - (bounds.minY + bounds.maxY) / 2;

		let globalMinDx = Number.NEGATIVE_INFINITY;
		let globalMaxDx = Number.POSITIVE_INFINITY;
		let globalMinDy = Number.NEGATIVE_INFINITY;
		let globalMaxDy = Number.POSITIVE_INFINITY;

		for (const item of items) {
			const itemHeight = item.width * coverAspectRatio;
			const minDx = padding - item.x;
			const maxDx = width - padding - item.width - item.x;
			const minDy = padding - item.y;
			const maxDy = height - padding - itemHeight - item.y;

			globalMinDx = Math.max(globalMinDx, minDx);
			globalMaxDx = Math.min(globalMaxDx, maxDx);
			globalMinDy = Math.max(globalMinDy, minDy);
			globalMaxDy = Math.min(globalMaxDy, maxDy);
		}

		const dx = clamp(targetDx, globalMinDx, globalMaxDx);
		const dy = clamp(targetDy, globalMinDy, globalMaxDy);

		return items.map((item) => ({
			...item,
			x: item.x + dx,
			y: item.y + dy
		}));
	}

	function createPlacements(
		sceneWidth: number,
		sceneHeight: number,
		viewportWidth: number,
		count: number
	): Placement[] {
		if (count === 0 || sceneWidth === 0 || sceneHeight === 0) return [];

		const densityScale = clamp(1 - Math.max(0, count - 8) * 0.03, 0.56, 1);
		const baseWidth = clamp(viewportWidth * 0.12 * densityScale, 90, 210);
		const radiusX = Math.max(160, sceneWidth * 0.34);
		const radiusY = Math.max(130, sceneHeight * 0.32);
		const placed: Placement[] = [];

		for (let i = 0; i < count; i += 1) {
			let fallback: Placement | null = null;

			for (let attempt = 0; attempt < 180; attempt += 1) {
				const angle = Math.random() * Math.PI * 2;
				const radius = Math.sqrt(Math.random());
				const itemWidth = baseWidth * randomBetween(0.86, 1.14);
				const itemHeight = itemWidth * coverAspectRatio;

				const centerX =
					sceneWidth / 2 + Math.cos(angle) * radiusX * radius + randomBetween(-40, 40);
				const centerY =
					sceneHeight / 2 + Math.sin(angle) * radiusY * radius + randomBetween(-34, 34);

				const next: Placement = {
					x: clamp(centerX - itemWidth / 2, scenePadding, sceneWidth - scenePadding - itemWidth),
					y: clamp(centerY - itemHeight / 2, scenePadding, sceneHeight - scenePadding - itemHeight),
					width: itemWidth,
					rotate: randomBetween(-11, 11)
				};

				if (!placed.some((item) => intersects(next, item))) {
					placed.push(next);
					fallback = null;
					break;
				}

				if (!fallback) fallback = next;
			}

			if (fallback) placed.push(fallback);
		}

		return centerPlacements(placed, sceneWidth, sceneHeight, scenePadding);
	}

	function recomputePlacements(count: number) {
		if (!host) return;

		const rect = host.getBoundingClientRect();
		const spreadScale = clamp(1.55 + Math.max(0, count - 10) * 0.02, 1.55, 2.25);

		viewport = { width: rect.width, height: rect.height };

		const nextPlacements = createPlacements(
			rect.width * spreadScale,
			rect.height * spreadScale,
			rect.width,
			count
		);
		placements = nextPlacements;
		sceneBounds = getPlacementBounds(nextPlacements);
	}

	function getAxisCameraRange(minPos: number, maxPos: number, viewportSize: number) {
		const contentSize = maxPos - minPos;

		if (contentSize + scenePadding * 2 <= viewportSize) {
			const centered = (viewportSize - contentSize) / 2 - minPos;
			return { min: centered, max: centered };
		}

		return {
			min: viewportSize - maxPos - scenePadding,
			max: -minPos + scenePadding
		};
	}

	function getCameraOffset() {
		if (placements.length === 0 || viewport.width === 0 || viewport.height === 0) {
			return { x: 0, y: 0 };
		}

		const xRange = getAxisCameraRange(sceneBounds.minX, sceneBounds.maxX, viewport.width);
		const yRange = getAxisCameraRange(sceneBounds.minY, sceneBounds.maxY, viewport.height);
		const tX = (mouse.x + 1) / 2;
		const tY = (mouse.y + 1) / 2;

		let cameraX = xRange.max - tX * (xRange.max - xRange.min);
		let cameraY = yRange.max - tY * (yRange.max - yRange.min);

		if (hoveredIndex !== null) {
			const hovered = placements[hoveredIndex];
			if (hovered) {
				const hoveredHeight = hovered.width * coverAspectRatio;
				const visibilityPadding = 28;
				const left = hovered.x + cameraX;
				const right = left + hovered.width;
				const top = hovered.y + cameraY;
				const bottom = top + hoveredHeight;

				if (left < visibilityPadding) {
					cameraX += visibilityPadding - left;
				} else if (right > viewport.width - visibilityPadding) {
					cameraX -= right - (viewport.width - visibilityPadding);
				}

				if (top < visibilityPadding) {
					cameraY += visibilityPadding - top;
				} else if (bottom > viewport.height - visibilityPadding) {
					cameraY -= bottom - (viewport.height - visibilityPadding);
				}

				cameraX = clamp(cameraX, xRange.min, xRange.max);
				cameraY = clamp(cameraY, yRange.min, yRange.max);
			}
		}

		return { x: cameraX, y: cameraY };
	}

	function updateMouse(e: PointerEvent) {
		if (!host) return;
		const rect = host.getBoundingClientRect();
		const normalizedX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
		const normalizedY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
		mouse = {
			x: clamp(normalizedX, -1, 1),
			y: clamp(normalizedY, -1, 1)
		};
	}

	function handleWindowPointerMove(e: PointerEvent) {
		updateMouse(e);
	}

	function handleWindowPointerUp() {
		maybeEndPointerDrag();
		handleCoverPointerUp();
	}

	function handleWindowPointerCancel() {
		maybeEndPointerDrag();
		handleCoverPointerUp();
	}

	function handleWindowDragEnd() {
		handleNativeDragEnd();
	}

	function handleWindowBlur() {
		handleNativeDragEnd();
		resetMouse();
	}

	function beginCoverDrag() {
		if (isDraggingCover) return;
		isDraggingCover = true;
		$isCoverDragging = true;
		$isFooterOpen = true;
		syncFooterVisibility();
	}

	function finishCoverDrag() {
		isNativeDragInProgress = false;
		if (!isDraggingCover) {
			$isCoverDragging = false;
			cleanupDragGhost();
			return;
		}

		isDraggingCover = false;
		$isCoverDragging = false;
		$isFooterOpen = false;
		syncFooterVisibility();
		cleanupDragGhost();
	}

	function maybeEndPointerDrag() {
		if (isNativeDragInProgress) return;
		finishCoverDrag();
	}

	function syncFooterVisibility() {
		$hideFooter = !(isHoveringCover || isDraggingCover);
	}

	function resetMouse() {
		mouse = { x: 0, y: 0 };
		hoveredIndex = null;
		isHoveringCover = false;
		syncFooterVisibility();
	}

	function handleCoverPointerEnter(index: number) {
		hoveredIndex = index;
		currentEdition.set(dummyEditions[index]);
		isTitleShowing.set(true);
		isHoveringCover = true;
		syncFooterVisibility();
	}

	function handleCoverPointerLeave(index: number) {
		if (hoveredIndex === index) {
			hoveredIndex = null;
		}
		isTitleShowing.set(false);
		isHoveringCover = false;
		if (!isDraggingCover) {
			$isFooterOpen = false;
		}
		syncFooterVisibility();
	}

	function handleCoverPointerDown() {
		$isFooterOpen = true;
	}

	function handleCoverPointerUp() {
		if (!isDraggingCover) {
			$isFooterOpen = false;
		}
	}

	function handleDraggableStart(_state: DragDropState<Edition>) {
		beginCoverDrag();
	}

	function handleDraggableEnd(_state: DragDropState<Edition>) {
		finishCoverDrag();
	}

	function handleNativeDragStart(event: DragEvent) {
		isNativeDragInProgress = true;
		beginCoverDrag();
		setDragImage(event);
	}

	function handleNativeDragEnd() {
		finishCoverDrag();
	}

	onMount(() => {
		if (!host || typeof window === 'undefined') return;

		syncFooterVisibility();
		recomputePlacements(dummyEditions.length);

		const resizeObserver = new ResizeObserver(() => {
			recomputePlacements(dummyEditions.length);
		});
		resizeObserver.observe(host);

		return () => {
			resizeObserver.disconnect();
			finishCoverDrag();
		};
	});

	$effect(() => {
		const count = dummyEditions.length;
		recomputePlacements(count);
	});

	function getDesktopStyle(index: number) {
		const placement = placements[index];
		if (!placement) return '';

		const camera = getCameraOffset();
		const isHovered = hoveredIndex === index;
		const zIndex = isHovered ? 50 : 10 + (index % 12);

		return `left: ${placement.x + camera.x}px; top: ${placement.y + camera.y}px; width: ${placement.width}px; z-index: ${zIndex}; transform: rotate(${placement.rotate}deg);`;
	}

	function getMobileStyle(index: number) {
		const rotation = randomBetween(-6, 6);

		return `transform: rotate(${rotation}deg);`;
	}

	function setDragImage(event: DragEvent) {
		if (!event.dataTransfer) return;
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		cleanupDragGhost();

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
		dragGhostElement = ghost;

		try {
			event.dataTransfer.setDragImage(ghost, offsetX, offsetY);
		} catch {
			cleanupDragGhost();
		}
	}

	function cleanupDragGhost() {
		if (!dragGhostElement) return;
		dragGhostElement.remove();
		dragGhostElement = null;
	}
</script>

<svelte:window
	onpointermove={handleWindowPointerMove}
	onpointerup={handleWindowPointerUp}
	onpointercancel={handleWindowPointerCancel}
	ondragend={handleWindowDragEnd}
	onblur={handleWindowBlur}
/>

<section
	bind:this={host}
	class="group/canvas relative top-12 z-0 flex w-full flex-col items-center justify-center gap-20 overflow-y-scroll py-24 md:top-0 md:h-dvh md:w-screen md:gap-0 md:overflow-hidden md:py-0"
>
	{#each dummyEditions as edition, index}
		{@const coverImg = getEditionCover(edition.name)}
		<button
			type="button"
			data-hover="Grab the cover!"
			use:draggable={{
				container: DND_SOURCE_CONTAINER,
				dragData: edition,
				attributes: { draggingClass: 'opacity-0' },
				callbacks: {
					onDragStart: handleDraggableStart,
					onDragEnd: handleDraggableEnd
				}
			}}
			ondragstart={handleNativeDragStart}
			ondragend={handleNativeDragEnd}
			onpointerdown={handleCoverPointerDown}
			onpointerenter={() => handleCoverPointerEnter(index)}
			onpointerleave={() => handleCoverPointerLeave(index)}
			class="canvas-cover absolute hidden cursor-grab overflow-hidden rounded-md bg-white/90 opacity-100 transition-[opacity,box-shadow,left,top] duration-250 ease-out group-has-[.canvas-cover:hover]/canvas:opacity-10 hover:!opacity-100 hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)] focus-visible:!opacity-100 active:cursor-grabbing md:block"
			style={getDesktopStyle(index)}
			aria-label={edition.name}
		>
			<img src={coverImg} alt={edition.name} class="h-full w-full object-contain" />
		</button>
		<!-- mobile version -->
		<button
			class="block h-auto w-[80%] rounded-md bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:hidden"
			type="button"
			aria-label={edition.name}
			onclick={() => openPanel(edition)}
			style={getMobileStyle(index)}
		>
			<img src={coverImg} alt={edition.name} class="h-auto w-full object-contain" />
		</button>
	{/each}

	{#if $isTitleShowing}
		<div
			class="pointer-events-none absolute z-0 flex h-dvh w-screen items-center justify-center opacity-20"
		>
			<h1 transition:fly={{ y: 12, duration: 150, easing: cubicInOut }}>
				{$currentEdition?.name}
			</h1>
		</div>
	{/if}
</section>
