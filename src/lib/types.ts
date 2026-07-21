export type PdfStatus = 'active' | 'archived-old-version';

export type Edition = {
	id: string;
	name: string;
	slug: string;
	subtitle: string;
	publishingDate: string;
	isbn: string;
	description: string;
	editors: string[];
	designers: string[];
	contributors: string[];
	keywords: string[];
	parentProject: string;
	downloadHref?: string;
	coPublisher: string;
	parentUrl: string;
	coPublisherUrl: string;
	pdfId: string;
	pdfStatus: PdfStatus;
	pdfRelativePath?: string;
	pdfChecksum?: string;
	featuredCoverImage?: string;
	featuredCoverScale?: number;
	structuredSections?: StructuredSection[];
};

export type StructuredSection = {
	title: string;
	content: string;
	type?: 'text' | 'list' | 'table';
};

export type DropItem =
	| string
	| {
			id?: string;
			label?: string;
			name?: string;
			title?: string;
	  };

export type MenuVariations = 'book' | 'home' | 'gallery' | 'reader' | 'share';

export function normalizeEditionKey(value?: string | null): string {
	if (!value) return '';

	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function validateEdition(value: unknown): value is Edition {
	if (!value || typeof value !== 'object') return false;
	const e = value as Record<string, unknown>;
	return (
		typeof e.id === 'string' &&
		typeof e.name === 'string' &&
		typeof e.slug === 'string' &&
		typeof e.subtitle === 'string' &&
		typeof e.publishingDate === 'string' &&
		typeof e.isbn === 'string' &&
		typeof e.description === 'string' &&
		typeof e.parentProject === 'string' &&
		typeof e.coPublisher === 'string' &&
		typeof e.parentUrl === 'string' &&
		typeof e.coPublisherUrl === 'string' &&
		typeof e.pdfId === 'string' &&
		(e.pdfStatus === 'active' || e.pdfStatus === 'archived-old-version') &&
		Array.isArray(e.editors) &&
		Array.isArray(e.designers) &&
		Array.isArray(e.contributors) &&
		Array.isArray(e.keywords)
	);
}
