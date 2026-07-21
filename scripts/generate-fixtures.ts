import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const DATASOURCE_PATH = resolve(repoRoot, 'src/lib/data/datasource.ts');
const MEDIA_DIR = resolve(repoRoot, 'src/lib/media/editions');

interface FixtureEdition {
	name: string;
	slug: string;
	subtitle: string;
	id: string;
	isbn: string;
	description: string;
	publishingDate: string;
	coPublisher: string;
	coPublisherUrl: string;
	editors: string[];
	designers: string[];
	contributors: string[];
	keywords: string[];
	parentProject: string;
	parentUrl: string;
	pdfId: string;
	pdfStatus: 'active';
	downloadHref: string;
	pdfRelativePath: string;
	pdfChecksum: string;
}

const FIXTURE_COUNT = Number(process.env.FIXTURE_COUNT) || 50;

const fixtureEditions: FixtureEdition[] = [];

for (let i = 1; i <= FIXTURE_COUNT; i++) {
	const num = String(i).padStart(3, '0');
	fixtureEditions.push({
		name: `Fixture Edition ${num}`,
		slug: `fixture-edition-${num}`,
		subtitle: `This is fixture edition number ${i}`,
		id: `fixture-${num}`,
		isbn: `000-0-0000-0000-${num}`,
		description: `Fixture edition generated for stress testing. This publication demonstrates the scalability of the canvas component with ${FIXTURE_COUNT} editions loaded simultaneously.`,
		publishingDate: `2026`,
		coPublisher: 'editions annexes / medialab Sciences Po',
		coPublisherUrl: 'https://medialab.sciencespo.fr/',
		editors: ['Fixture Editor'],
		designers: ['Fixture Designer'],
		contributors: [],
		keywords: ['Fixture', 'Testing', 'Stress test'],
		parentProject: 'Fixture Project',
		parentUrl: 'https://example.com',
		pdfId: `fixture-pdf-${num}`,
		pdfStatus: 'active',
		downloadHref: `pdfs/Fixture Edition ${num}.pdf`,
		pdfRelativePath: `Fixture Edition ${num}.pdf`,
		pdfChecksum: `fixture-checksum-${num}`
	});

	const editionDir = resolve(MEDIA_DIR, `fixture-edition-${num}`);
	if (!existsSync(editionDir)) {
		mkdirSync(resolve(editionDir, 'canvasElements'), { recursive: true });
		mkdirSync(resolve(editionDir, 'images'), { recursive: true });
		mkdirSync(resolve(editionDir, 'pages'), { recursive: true });
	}
}

const activeFilter = fixtureEditions
	.map(
		(e) => `\t{
\t\tname: '${e.name}',
\t\tslug: '${e.slug}',
\t\tid: '${e.id}',
\t\tsubtitle: '${e.subtitle}',
\t\tisbn: '${e.isbn}',
\t\tdescription: '${e.description}',
\t\tpublishingDate: '${e.publishingDate}',
\t\tcoPublisher: '${e.coPublisher}',
\t\tcoPublisherUrl: '${e.coPublisherUrl}',
\t\teditors: [${e.editors.map((ed) => `'${ed}'`).join(', ')}],
\t\tdesigners: [${e.designers.map((d) => `'${d}'`).join(', ')}],
\t\tcontributors: [${e.contributors.map((c) => `'${c}'`).join(', ')}],
\t\tkeywords: [${e.keywords.map((k) => `'${k}'`).join(', ')}],
\t\tparentProject: '${e.parentProject}',
\t\tparentUrl: '${e.parentUrl}',
\t\tpdfId: '${e.pdfId}',
\t\tpdfStatus: '${e.pdfStatus}' as const,
\t\tdownloadHref: '${e.downloadHref}',
\t\tpdfRelativePath: '${e.pdfRelativePath}',
\t\tpdfChecksum: '${e.pdfChecksum}'
\t}`
	)
	.join(',\n');

const content = `import type { Edition } from '$lib/types';
import { normalizeEditionKey } from '$lib/types';

function slug(name: string): string {
	return normalizeEditionKey(name);
}

// GENERATED FIXTURES — do not edit manually
// Run: bun scripts/generate-fixtures.ts

export let editions: Edition[] = [
${activeFilter}
];
`;

writeFileSync(DATASOURCE_PATH, content);
console.log(`Generated ${FIXTURE_COUNT} fixture editions in datasource.ts`);
console.log(`Media directories created under ${MEDIA_DIR}`);
