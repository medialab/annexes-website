// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@thisux/sveltednd' {
	import type { Action } from 'svelte/action';

	export interface DragDropState<T = unknown> {
		isDragging: boolean;
		draggedItem: T;
		sourceContainer: string;
		targetContainer: string | null;
		targetElement: HTMLElement | null;
		invalidDrop?: boolean;
	}

	export interface DragDropCallbacks<T = unknown> {
		onDragStart?: (state: DragDropState<T>) => void;
		onDragEnter?: (state: DragDropState<T>) => void;
		onDragLeave?: (state: DragDropState<T>) => void;
		onDragOver?: (state: DragDropState<T>) => void;
		onDrop?: (state: DragDropState<T>) => Promise<void> | void;
		onDragEnd?: (state: DragDropState<T>) => void;
	}

	export interface DragDropOptions<T = unknown> {
		dragData?: T;
		container: string;
		disabled?: boolean;
		callbacks?: DragDropCallbacks<T>;
		attributes?: {
			draggingClass?: string;
			dragOverClass?: string;
		};
	}

	export const draggable: Action<HTMLElement, DragDropOptions<any>>;
	export const droppable: Action<HTMLElement, DragDropOptions<any>>;
	export const dndState: {
		subscribe: (run: (value: DragDropState<any>) => void) => () => void;
	};
}

export { };
