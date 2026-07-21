import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import en from './en.json';
import fr from './fr.json';

export type Locale = 'en' | 'fr';

export type TranslationMap = Record<string, string>;

const translations: Record<Locale, TranslationMap> = { en, fr };

function detectBrowserLocale(): Locale {
	if (!browser) return 'en';
	const lang = navigator.language.slice(0, 2);
	return lang === 'fr' ? 'fr' : 'en';
}

function loadPersistedLocale(): Locale {
	if (!browser) return 'en';
	try {
		const stored = localStorage.getItem('annexes-locale');
		if (stored === 'en' || stored === 'fr') return stored;
	} catch {}
	return detectBrowserLocale();
}

export const locale = writable<Locale>(loadPersistedLocale());

locale.subscribe((value) => {
	if (!browser) return;
	try {
		localStorage.setItem('annexes-locale', value);
	} catch {}
	document.documentElement.lang = value === 'fr' ? 'fr_FR' : 'en_US';
});

export function translate(localeValue: Locale, key: string, params?: Record<string, string>): string {
	const map = translations[localeValue] ?? translations['en'];
	let value = map[key] ?? translations['en'][key] ?? key;
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			value = value.replace(`{${k}}`, v);
		}
	}
	return value;
}
