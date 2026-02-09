import { writable } from 'svelte/store';
import type { Edition, MenuVariations } from './types';
import { editions } from './data/datasource';

export const currentEdition = writable<Edition | null>(editions[0]);
export const isMobile = writable(false);
export const currentPanel = writable<MenuVariations | null>('book');
export const allEditions = writable<Edition[]>(editions);
export const isFooterOpen = writable(false);
export const isFooterHovered = writable(false);