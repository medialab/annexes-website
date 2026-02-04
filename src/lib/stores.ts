import { writable } from "svelte/store";
import type { Edition, MenuVariations } from "./types";

export const isMenuOpen = writable(true);
export const currentEdition = writable<Edition | null>(null);