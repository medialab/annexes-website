# éditions annexes

[![Build And Deploy (With PDF Sync)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml/badge.svg)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml)

A SvelteKit 5 publication interface for éditions annexes, a publishing project
that produces research outputs outside traditional academic publishing channels.

## Tech Stack

- Svelte 5 / SvelteKit 2
- TypeScript
- Tailwind CSS 4
- Vite 7
- Bun
- Static site generation (GitHub Pages)

## Setup

```bash
bun install
bun run dev
```

## Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite dev` | Development server |
| `build` | `vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `check` | `svelte-check` | Type checking |
| `lint` | `prettier --check .` | Formatting check |
| `test` | `node --test scripts/process-pdf.test.js` | PDF pipeline tests |
| `generate:fixtures` | `bun scripts/generate-fixtures.ts` | Generate N fixture editions (set `FIXTURE_COUNT` env) |
| `restore:data` | `git checkout -- src/lib/data/datasource.ts` | Restore real data after fixtures |

## Internationalisation

Annexes supports English and French. The active locale is persisted in `localStorage`.

- UI labels are translated via `src/lib/i18n/{en,fr}.json`
- Editorial content (titles, descriptions, metadata) is NOT translated — it remains as authored
- Add a new locale by creating a `{locale}.json` file and adding it to `src/lib/i18n/index.ts`

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── data/           # Edition data source
│   ├── i18n/           # Internationalisation
│   ├── media/          # Edition assets (pages, covers, gallery images)
│   └── types.ts        # Edition type and validators
├── routes/
│   ├── +page.svelte    # Homepage with cover gallery
│   └── editions/
│       └── [slug]/     # Edition detail page
└── app.css             # Tailwind + global styles
```

## Adding a New Edition

1. Add the PDF to `static/pdfs/`
2. Run `bun scripts/process-pdf.js` to auto-generate:
   - Page JPEGs in `src/lib/media/editions/{slug}/pages/`
   - Thumbnail cover in `src/lib/media/editions/{slug}/canvasElements/`
   - Entry in `src/lib/data/datasource.ts`
3. Add any gallery images to `src/lib/media/editions/{slug}/images/`

## Configuration

Set environment variables to customise the production URL:

```bash
SITE_ORIGIN=https://example.com BASE_PATH=/annexes bun run build
```

## Deployment

Automatically deployed to GitHub Pages on push to `main`. See `.github/workflows/deploy.yml`.
