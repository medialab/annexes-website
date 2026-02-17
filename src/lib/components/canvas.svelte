<script lang="ts">
	import { onMount } from 'svelte';
	import { getEditionElements, openPanel, isTitleShowing, currentEdition } from '$lib/stores';
	import type { Edition } from '$lib/types';
	import { cubicInOut } from 'svelte/easing';
	import { draw, fly } from 'svelte/transition';

	let { editions = [] } = $props<{ editions?: Edition[] }>();

	let canvasCovers = $derived.by<CanvasCover[]>(() =>
		editions.flatMap((edition: Edition, editionIndex: number) =>
			getEditionElements(edition.name).map((element: string, elementIndex: number) => ({
				key: `${editionIndex}-${elementIndex}-${element}`,
				edition,
				element
			}))
		)
	);

	type Placement = {
		x: number;
		y: number;
		width: number;
		height: number;
		rotate: number;
	};

	type Point = {
		x: number;
		y: number;
	};

	type ConnectionLine = {
		key: string;
		sourceKey: string;
		targetKey: string;
		start: Point;
		end: Point;
		active: boolean;
	};

	type CanvasCover = {
		key: string;
		edition: Edition;
		element: string;
	};

	type CoverSize = {
		key: string;
		width: number;
		height: number;
	};

	let host = $state<HTMLElement | null>(null);
	let placements = $state<Placement[]>([]);
	let hoveredIndex = $state<number | null>(null);
	let pointer = $state<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
	let viewport = $state<{ width: number; height: number }>({ width: 0, height: 0 });
	let mobileRotations = $state<number[]>([]);
	let connectionLines = $state<ConnectionLine[]>([]);
	let areConnectionLinesVisible = $state(false);
	let hoveredCoverKey = $state<string | null>(null);
	let hoveredEditionName = $state<string | null>(null);

	const coverElements = new Map<string, HTMLButtonElement>();
	let connectionRefreshFrame: number | null = null;

	const coverSeparation = 50;

	const scenePadding = 100;
	const minCoverGap = 12;
	const gapRandomness = 0.65;
	const coverRotationMin = -4;
	const coverRotationMax = 4;
	const mobileRotationMin = -6;
	const mobileRotationMax = 6;
	const pointerInfluenceRadius = 1200;
	const pointerMaxShift = 400;
	const dimmedCoverOpacity = 0.18;

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function randomBetween(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function shuffledIndices(length: number): number[] {
		const indices = Array.from({ length }, (_, i) => i);
		for (let i = indices.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}
		return indices;
	}

	function createPlacements(
		sceneWidth: number,
		sceneHeight: number,
		coverSizes: CoverSize[]
	): Placement[] {
		const count = coverSizes.length;
		if (count === 0 || sceneWidth === 0 || sceneHeight === 0) return [];

		const minX = scenePadding;
		const minY = scenePadding;
		const maxX = sceneWidth - scenePadding;
		const maxY = sceneHeight - scenePadding;
		const placements: Placement[] = Array.from({ length: count });
		const shuffled = shuffledIndices(count);
		const cols = Math.max(1, Math.ceil(Math.sqrt(count)));
		const rows: number[][] = [];

		for (let i = 0; i < count; i += cols) {
			rows.push(shuffled.slice(i, i + cols));
		}

		const rowHeights = rows.map((row) =>
			row.reduce((maxHeight, itemIndex) => Math.max(maxHeight, coverSizes[itemIndex].height), 0)
		);
		const rowGaps = rows.map((_, rowIndex) => {
			if (rowIndex === rows.length - 1) return 0;
			const randomGap = coverSeparation * (1 + randomBetween(-gapRandomness, gapRandomness));
			return Math.max(minCoverGap, randomGap);
		});

		const totalHeight =
			rowHeights.reduce((sum, height) => sum + height, 0) +
			rowGaps.reduce((sum, gap) => sum + gap, 0);
		let yCursor = clamp((sceneHeight - totalHeight) / 2, minY, maxY);

		rows.forEach((row, rowIndex) => {
			const itemGaps = row.map((_, itemIndex) => {
				if (itemIndex === row.length - 1) return 0;
				const randomGap = coverSeparation * (1 + randomBetween(-gapRandomness, gapRandomness));
				return Math.max(minCoverGap, randomGap);
			});
			const rowWidth =
				row.reduce((sum, itemIndex) => sum + coverSizes[itemIndex].width, 0) +
				itemGaps.reduce((sum, gap) => sum + gap, 0);
			const rowOffset = randomBetween(-coverSeparation * 0.25, coverSeparation * 0.25);
			let xCursor = clamp((sceneWidth - rowWidth) / 2 + rowOffset, minX, maxX - rowWidth);

			row.forEach((itemIndex, itemPos) => {
				const size = coverSizes[itemIndex];
				const y = yCursor + (rowHeights[rowIndex] - size.height) / 2;
				placements[itemIndex] = {
					x: clamp(xCursor, minX, maxX - size.width),
					y: clamp(y, minY, maxY - size.height),
					width: size.width,
					height: size.height,
					rotate: randomBetween(coverRotationMin, coverRotationMax)
				};
				xCursor += size.width + itemGaps[itemPos];
			});

			yCursor += rowHeights[rowIndex] + rowGaps[rowIndex];
		});

		return placements;
	}

	function buildConnectionLinePool(): ConnectionLine[] {
		const keysByEdition = new Map<string, string[]>();
		canvasCovers.forEach((cover) => {
			const keys = keysByEdition.get(cover.edition.name);
			if (keys) {
				keys.push(cover.key);
				return;
			}
			keysByEdition.set(cover.edition.name, [cover.key]);
		});

		return canvasCovers.flatMap((cover) => {
			const relatedKeys = (keysByEdition.get(cover.edition.name) ?? []).filter(
				(key) => key !== cover.key
			);
			return relatedKeys.map((relatedKey) => ({
				key: `${cover.key}-${relatedKey}`,
				sourceKey: cover.key,
				targetKey: relatedKey,
				start: { x: 0, y: 0 },
				end: { x: 0, y: 0 },
				active: false
			}));
		});
	}

	async function waitForCoverImages() {
		const imagePromises = canvasCovers.map((cover) => {
			const coverElement = coverElements.get(cover.key);
			const imageElement = coverElement?.querySelector('img');
			if (!imageElement) return Promise.resolve();
			if (imageElement.complete) return Promise.resolve();
			return new Promise<void>((resolve) => {
				const finish = () => resolve();
				imageElement.addEventListener('load', finish, { once: true });
				imageElement.addEventListener('error', finish, { once: true });
			});
		});

		await Promise.all(imagePromises);
	}

	function getCoverSizes(): CoverSize[] {
		const measured = canvasCovers
			.map((cover) => {
				const coverElement = coverElements.get(cover.key);
				if (!coverElement) return null;
				const coverRect = coverElement.getBoundingClientRect();
				if (coverRect.width <= 0 || coverRect.height <= 0) return null;
				return {
					key: cover.key,
					width: coverRect.width,
					height: coverRect.height
				};
			})
			.filter((coverSize): coverSize is CoverSize => coverSize !== null);

		if (measured.length === 0) return [];
		const averageWidth =
			measured.reduce((sum, coverSize) => sum + coverSize.width, 0) / measured.length;
		const averageHeight =
			measured.reduce((sum, coverSize) => sum + coverSize.height, 0) / measured.length;
		const measuredByKey = new Map(measured.map((coverSize) => [coverSize.key, coverSize]));

		return canvasCovers.map((cover) => {
			const coverSize = measuredByKey.get(cover.key);
			return (
				coverSize ?? {
					key: cover.key,
					width: averageWidth,
					height: averageHeight
				}
			);
		});
	}

	async function initializeScene() {
		if (!host || typeof window === 'undefined') return;
		connectionLines = buildConnectionLinePool();
		areConnectionLinesVisible = false;

		if (window.matchMedia('(min-width: 768px)').matches) {
			await waitForCoverImages();
			if (!host) return;
			const rect = host.getBoundingClientRect();
			viewport = { width: rect.width, height: rect.height };
			const sizes = getCoverSizes();
			placements = createPlacements(rect.width, rect.height, sizes);
		} else {
			const rect = host.getBoundingClientRect();
			viewport = { width: rect.width, height: rect.height };
			placements = [];
		}

		mobileRotations = editions.map(() => randomBetween(mobileRotationMin, mobileRotationMax));
	}

	function getCoverRectInHost(coverKey: string): DOMRect | null {
		if (!host) return null;
		const coverElement = coverElements.get(coverKey);
		if (!coverElement) return null;
		const hostRect = host.getBoundingClientRect();
		const coverRect = coverElement.getBoundingClientRect();
		return new DOMRect(
			coverRect.left - hostRect.left,
			coverRect.top - hostRect.top,
			coverRect.width,
			coverRect.height
		);
	}

	function getPointerTranslationForPlacement(coverKey: string, placement: Placement): Point {
		if (!pointer.active) return { x: 0, y: 0 };

		const coverRect = getCoverRectInHost(coverKey);
		const left = coverRect?.x ?? placement.x;
		const top = coverRect?.y ?? placement.y;
		const width = coverRect?.width ?? placement.width;
		const height = coverRect?.height ?? placement.height;

		const pointerInsidePlacement =
			pointer.x >= left &&
			pointer.x <= left + width &&
			pointer.y >= top &&
			pointer.y <= top + height;
		if (pointerInsidePlacement) {
			return { x: 0, y: 0 };
		}

		const centerX = left + width / 2;
		const centerY = top + height / 2;
		const dx = centerX - pointer.x;
		const dy = centerY - pointer.y;
		const distance = Math.hypot(dx, dy);

		if (distance < 0.0001) {
			return { x: 0, y: 0 };
		}

		const strength = clamp(distance / pointerInfluenceRadius, 0, 1);
		const magnitude = pointerMaxShift * strength;

		return {
			x: (dx / distance) * magnitude,
			y: (dy / distance) * magnitude
		};
	}

	function handleWindowPointerMove(e: PointerEvent) {
		if (!host) return;
		const rect = host.getBoundingClientRect();
		pointer = {
			x: clamp(e.clientX - rect.left, 0, rect.width),
			y: clamp(e.clientY - rect.top, 0, rect.height),
			active: true
		};
		scheduleConnectionLinesRefresh();
	}

	function handleWindowBlur() {
		resetMouse();
	}

	function resetMouse() {
		pointer = { x: 0, y: 0, active: false };
		hoveredIndex = null;
		hoveredCoverKey = null;
		hoveredEditionName = null;
		areConnectionLinesVisible = false;
		connectionLines = connectionLines.map((line) =>
			line.active
				? {
						...line,
						active: false
					}
				: line
		);
	}

	function handleCoverPointerEnter(coverIndex: number, coverKey: string, edition: Edition) {
		hoveredIndex = coverIndex;
		hoveredCoverKey = coverKey;
		hoveredEditionName = edition.name;
		currentEdition.set(edition);
		refreshConnectionLines();
		isTitleShowing.set(true);
	}

	function handleCoverPointerLeave(coverIndex: number, coverKey: string) {
		if (hoveredIndex === coverIndex) {
			hoveredIndex = null;
		}
		if (hoveredCoverKey === coverKey) {
			hoveredCoverKey = null;
			hoveredEditionName = null;
			areConnectionLinesVisible = false;
			connectionLines = connectionLines.map((line) =>
				line.active
					? {
							...line,
							active: false
						}
					: line
			);
		}
		isTitleShowing.set(false);
	}

	let isReady = $state(false);

	function markReady() {
		requestAnimationFrame(() => {
			isReady = true;
		});
	}

	function getPlacementCoords(index: number) {
		const placement = placements[index];
		const cover = canvasCovers[index];

		if (!placement || !cover) return null;

		const translation = getPointerTranslationForPlacement(cover.key, placement);
		const isHovered = hoveredIndex === index;
		const zIndex = isHovered ? 50 : 10 + (index % 12);
		let opacity = 1;
		let outline = 'none';
		if (hoveredEditionName) {
			if (cover.edition.name !== hoveredEditionName) {
				opacity = dimmedCoverOpacity;
			} else {
				outline = 'solid white 10px';
			}
		}

		return {
			x: placement.x,
			y: placement.y,
			tx: translation.x,
			ty: translation.y,
			width: placement.width,
			zIndex,
			rotate: placement.rotate,
			opacity,
			outline
		};
	}

	function getCoverCentersForKeys(coverKeys: string[]): Map<string, Point> {
		const centers = new Map<string, Point>();
		if (!host) return centers;
		const hostRect = host.getBoundingClientRect();

		coverKeys.forEach((coverKey) => {
			const coverElement = coverElements.get(coverKey);
			if (!coverElement) return;
			const coverRect = coverElement.getBoundingClientRect();
			centers.set(coverKey, {
				x: coverRect.left - hostRect.left + coverRect.width / 2,
				y: coverRect.top - hostRect.top + coverRect.height / 2
			});
		});

		return centers;
	}

	function getRelatedCoverKeys(coverKey: string): string[] {
		const sourceCover = canvasCovers.find((cover) => cover.key === coverKey);
		if (!sourceCover) return [];

		return canvasCovers
			.filter((cover) => cover.key !== coverKey && cover.edition.name === sourceCover.edition.name)
			.map((cover) => cover.key);
	}

	function refreshConnectionLines() {
		if (!hoveredCoverKey || !hoveredEditionName) return;

		const relatedKeys = getRelatedCoverKeys(hoveredCoverKey);
		const centers = getCoverCentersForKeys([hoveredCoverKey, ...relatedKeys]);
		const sourceCenter = centers.get(hoveredCoverKey);
		const activeKeys = new Set(relatedKeys.map((relatedKey) => `${hoveredCoverKey}-${relatedKey}`));
		let hasVisibleLines = false;

		connectionLines = connectionLines.map((line) => {
			if (!sourceCenter || !activeKeys.has(line.key)) {
				if (!line.active) return line;
				return {
					...line,
					active: false
				};
			}

			const targetCenter = centers.get(line.targetKey);
			if (!targetCenter) {
				if (!line.active) return line;
				return {
					...line,
					active: false
				};
			}

			hasVisibleLines = true;
			return {
				...line,
				start: sourceCenter,
				end: targetCenter,
				active: true
			};
		});

		areConnectionLinesVisible = hasVisibleLines;
	}

	function scheduleConnectionLinesRefresh() {
		if (typeof window === 'undefined') return;
		if (!hoveredCoverKey || !hoveredEditionName) return;
		if (connectionRefreshFrame !== null) return;

		connectionRefreshFrame = window.requestAnimationFrame(() => {
			refreshConnectionLines();
			connectionRefreshFrame = null;
		});
	}

	function registerCoverElement(node: HTMLButtonElement, coverKey: string) {
		coverElements.set(coverKey, node);
		return {
			destroy() {
				if (coverElements.get(coverKey) === node) {
					coverElements.delete(coverKey);
				}
			}
		};
	}

	onMount(() => {
		if (!host || typeof window === 'undefined') return;

		let isDisposed = false;
		void (async () => {
			await initializeScene();
			if (!isDisposed) {
				markReady();
			}
		})();

		return () => {
			isDisposed = true;
			if (connectionRefreshFrame !== null) {
				window.cancelAnimationFrame(connectionRefreshFrame);
			}
			resetMouse();
		};
	});
</script>

<svelte:head>
	{#each editions as edition}
		{@const coverImages = getEditionElements(edition.name)}
		{#if coverImages.length > 0}
			{#each coverImages as image}
				<link rel="preload" as="image" href={image} fetchpriority="high" />
			{/each}
		{/if}
	{/each}
</svelte:head>

<svelte:window onpointermove={handleWindowPointerMove} onblur={handleWindowBlur} />

<section
	bind:this={host}
	class="group/canvas relative top-12 flex w-full flex-col items-center justify-center gap-20 overflow-y-scroll py-24 transition-opacity duration-500 md:top-0 md:h-dvh md:w-screen md:gap-0 md:overflow-hidden md:py-0"
	class:opacity-0={!isReady}
	class:pointer-events-none={!isReady}
>
	{#if connectionLines.length > 0}
		<svg
			class="pointer-events-none absolute inset-0 z-[-5] hidden h-full w-full md:block"
			width={viewport.width}
			height={viewport.height}
			aria-hidden="true"
		>
			{#each connectionLines as line (line.key)}
				{#if areConnectionLinesVisible && line.active}
					<line
						x1={line.start.x}
						y1={line.start.y}
						x2={line.end.x}
						y2={line.end.y}
						stroke="white"
						stroke-width="10"
						stroke-linecap="round"
						transition:draw={{ duration: 1200, easing: cubicInOut }}
					/>
				{/if}
			{/each}
		</svg>
	{/if}
	{#each canvasCovers as cover, index (cover.key)}
		{@const placementStyle = getPlacementCoords(index)}
		<button
			type="button"
			data-hover="Open this book"
			use:registerCoverElement={cover.key}
			onclick={() => openPanel(cover.edition)}
			onpointerenter={() => handleCoverPointerEnter(index, cover.key, cover.edition)}
			onpointerleave={() => handleCoverPointerLeave(index, cover.key)}
			class="canvas-cover absolute hidden h-[300px] w-fit origin-center cursor-pointer overflow-clip rounded-md bg-white opacity-0 transition-[opacity,box-shadow,transform] duration-250 ease-out hover:shadow-[0_12px_30px_rgba(15,23,42,0.16)] focus-visible:opacity-100! md:block"
			style="left: {placementStyle ? placementStyle.x : 0}px; top: {placementStyle
				? placementStyle.y
				: 0}px; transform: translate({placementStyle ? placementStyle.tx : 0}px, {placementStyle
				? placementStyle.ty
				: 0}px) rotate({placementStyle ? placementStyle.rotate : 0}deg); opacity: {placementStyle
				? placementStyle.opacity
				: 0}; outline: {placementStyle ? placementStyle.outline : 'none'};"
			aria-label={cover.edition.name}
		>
			<img
				src={cover.element}
				alt={cover.edition.name}
				class="block h-full w-auto max-w-none overflow-clip bg-white object-contain"
				loading="eager"
				fetchpriority="high"
				decoding="async"
			/>
		</button>
	{/each}
	{#each editions as edition, index}
		{@const editionElements = getEditionElements(edition.name)}
		<!-- mobile version -->
		<button
			class="block h-auto w-[80%] rounded-md bg-white/90 shadow-[0_12px_30px_rgba(15,23,42,0.16)] md:hidden"
			type="button"
			aria-label={edition.name}
			onclick={() => openPanel(edition)}
			style={`transform: rotate(${mobileRotations[index] ?? 0}deg);`}
		>
			<img
				src={editionElements.find((e) => e.includes('thumb')) ?? editionElements[0]}
				alt={edition.name}
				class="h-auto w-full object-contain"
			/>
		</button>
	{/each}
</section>
