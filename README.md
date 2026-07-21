# éditions annexes

[![Build And Deploy (With PDF Sync)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml/badge.svg)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml)

Website for éditions annexes — a publishing project at Sciences Po medialab.

## How to Add a Publication

1. **Place the PDF** in the `static/pdfs/` folder
2. **Push to `main`** — the CI pipeline detects the new file, generates page JPEGs and a cover thumbnail, creates a database entry, and deploys the site automatically

> Title, authors, date, and keywords are automatically extracted from PDF metadata (XMP). If the PDF lacks metadata, the filename is used as the title.

### Via the GitHub Web Interface

1. Go to [github.com/medialab/editions-annexes](https://github.com/medialab/editions-annexes)
2. Browse to `static/pdfs/` → **Add file** → **Upload files**
3. Drag and drop the PDF → **Commit changes** (to `main`)
4. Deployment starts automatically. Check progress in the **Actions** tab

### Generated Assets Structure

```
src/lib/media/editions/{slug}/
├── pages/              # JPEGs (one per page)
├── canvasElements/     # Cover thumbnail
└── images/             # Gallery images (add manually if needed)
```

### Adding Gallery Images

After automatic deployment, place images in `src/lib/media/editions/{slug}/images/` and push again.

## Local Development

```bash
bun install
bun run dev
```

### Useful Scripts

| Command | Purpose |
|---------|---------|
| `bun scripts/process-pdf.js` | Sync PDFs with the database |
| `bun test` | Test the PDF pipeline |
| `bun run build` | Production build |

The site is automatically deployed to GitHub Pages on every push to `main`. See `.github/workflows/deploy.yml`.
