import { writable } from 'svelte/store';
import type { Edition, MenuVariations } from './types';
import { editions } from './data/datasource';

export const isMenuOpen = writable(false);
export const currentEdition = writable<Edition | null>(editions[0]);
export const isMobile = writable(false);
