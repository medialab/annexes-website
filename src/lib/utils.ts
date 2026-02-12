export function isExternalHref(url?: string | null): boolean {
	if (!url) return false;
	return /^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:');
}

export function preventDefault(event: Event): void {
	event.preventDefault();
}
