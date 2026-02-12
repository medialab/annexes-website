import { writable } from 'svelte/store';
import type { Edition, MenuVariations } from './types';
import { editions } from './data/datasource';
import { goto } from '$app/navigation';
import { asset, resolve } from '$app/paths';

export const currentEdition = writable<Edition | null>(editions[0]);
export const isMobile = writable(false);
export const currentPanel = writable<MenuVariations | null>('book');
export const allEditions = writable<Edition[]>(editions);
export let isFooterOpen = writable(false);
export const hideFooter = writable(true);
export const isFooterHovered = writable(false);
export const isTitleShowing = writable(false);
export const isCoverDragging = writable(false);
export const DND_SOURCE_CONTAINER = 'canvas';
export const DND_FOOTER_CONTAINER = 'footer-dropzone';
export const isAboutOpen = writable(false);

const coverModules = import.meta.glob<string>('$lib/media/editions/**/thumb.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
});

const pageModules = import.meta.glob<string>('$lib/media/editions/**/page-*.{jpg,jpeg,png}', {
    import: 'default'
});

export function toAssetHref(pathname?: string) {
    if (!pathname) return undefined;
    return asset(pathname.startsWith('/') ? pathname : `/${pathname}`);
}

function ensurePdfFilename(value?: string | null): string | undefined {
    const normalized = value?.trim();
    if (!normalized) return undefined;
    return normalized.toLowerCase().endsWith('.pdf') ? normalized : `${normalized}.pdf`;
}

function filenameFromPath(pathname?: string | null): string | undefined {
    if (!pathname) return undefined;
    const normalized = pathname.split('/').pop();
    return ensurePdfFilename(normalized);
}

export function getEditionDownloadInfo(
    edition?: Pick<Edition, 'downloadHref' | 'name'> | null
): { href?: string; filename?: string } {
    const href = toAssetHref(edition?.downloadHref);
    if (!href) return {};

    const filename = ensurePdfFilename(edition?.name) ?? filenameFromPath(edition?.downloadHref);
    return { href, filename };
}

function normalizeEditionKey(value?: string | null): string {
    if (!value) return '';

    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^\w]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function getEditionAndFileFromKey(key: string): { edition: string; file: string } | null {
    const match = key.match(/\/media\/editions\/([^/]+)\/([^/]+)$/i);
    if (!match) return null;

    return {
        edition: normalizeEditionKey(match[1]),
        file: match[2].toLowerCase()
    };
}

const editionCoverIndex: Record<string, string> = {};
for (const [key, url] of Object.entries(coverModules)) {
    const parsed = getEditionAndFileFromKey(key);
    if (!parsed) continue;
    editionCoverIndex[parsed.edition] = url;
}

const editionPagesCache = new Map<string, Promise<string[]>>();

export function getEditionCover(editionName?: string | null): string {
    const normalizedName = normalizeEditionKey(editionName);
    return editionCoverIndex[normalizedName] ?? '';
}

export async function getEditionPages(editionName?: string | null): Promise<string[]> {
    const normalizedName = normalizeEditionKey(editionName);
    if (!normalizedName) return [];

    const cached = editionPagesCache.get(normalizedName);
    if (cached) return cached;

    const loaderPromise = (async () => {
        const matchingPages = Object.entries(pageModules)
            .map(([key, load]) => {
                const parsed = getEditionAndFileFromKey(key);
                if (!parsed || parsed.edition !== normalizedName) return null;
                const pageMatch = parsed.file.match(/^page-(\d+)\.(jpg|jpeg|png)$/);
                if (!pageMatch) return null;
                return { page: Number(pageMatch[1]), load };
            })
            .filter((item): item is { page: number; load: () => Promise<string> } => item !== null)
            .sort((a, b) => a.page - b.page);

        return Promise.all(matchingPages.map((item) => item.load()));
    })();

    editionPagesCache.set(normalizedName, loaderPromise);

    try {
        return await loaderPromise;
    } catch (error) {
        editionPagesCache.delete(normalizedName);
        throw error;
    }
}

export function openPanel(edition: Edition) {
    console.log('edition dropped:', edition);
    currentPanel.set('book');
    isFooterOpen.set(false);
    goto(resolve(`/editions/${edition.name}`));
    currentEdition.set(edition);
}
