# éditions annexes

[![Build And Deploy (With PDF Sync)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml/badge.svg)](https://github.com/medialab/editions-annexes/actions/workflows/deploy.yml)

Website for éditions annexes — a publishing project at Sciences Po medialab.

---

## How to Add a Publication

### Step 1: Prepare your PDF

Add metadata (title, authors, date, keywords) to your PDF. The system reads this automatically. If the PDF has no metadata, the filename becomes the title.

### Step 2: Upload the PDF

Upload your PDF file to `static/pdfs/`. You have two ways to do this:

**Option A — Use GitHub (easiest):**
1. Go to [github.com/medialab/editions-annexes](https://github.com/medialab/editions-annexes)
2. Click `static/` → `pdfs/` → **Add file** → **Upload files**
3. Drag your PDF into the page
4. Click **Commit changes** (keep `main` as the branch)

**Option B — Use your computer (requires git):**
```bash
cp your-publication.pdf static/pdfs/
git add static/pdfs/your-publication.pdf
git commit -m "add new publication"
git push origin main
```

### Step 3: Wait for deployment

Pushing to `main` starts an automatic pipeline that:
1. Reads the PDF metadata (title, authors, etc.)
2. Creates one JPEG image per page
3. Makes a cover thumbnail
4. Adds the publication to the website database
5. Builds and publishes the site

Check progress in the **Actions** tab on GitHub. The site updates automatically when done.

---

## Adding Gallery Images

After the first deployment, you can add extra images:
1. Place image files in `src/lib/media/editions/<slug>/images/`
2. Push to `main` again

---

## Fixing or Changing Details

After the automatic setup, you can edit `src/lib/data/datasource.ts` to change:
- `description` (the text about the publication)
- `designers` (names of designers)
- `parentProject` / `parentUrl` (if the publication is part of a larger project)
- `coPublisherUrl` (link to a co-publisher)

---

## Local Development

```bash
bun install
bun run dev
```

### Useful Commands

| Command | What it does |
|---------|-------------|
| `bun run dev` | Start a local preview server |
| `bun run build` | Build the site for production |
| `bun scripts/process-pdf.js` | Sync PDF files with the database |
| `bun test` | Test the PDF pipeline |

---

## How It Works (Overview)

- **No database or CMS.** Everything is file-based. The "database" is `src/lib/data/datasource.ts`.
- **PDFs go in** `static/pdfs/`. The pipeline finds new files and processes them.
- **Images are generated** into `src/lib/media/editions/<slug>/`.
- **GitHub Pages** hosts the site. Every push to `main` triggers a new build and deploy.

See `.github/workflows/deploy.yml` for the full pipeline.
