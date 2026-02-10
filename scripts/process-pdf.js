import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PDF_SOURCE_DIR = 'static/pdfs';
const IMAGE_OUTPUT_DIR = 'src/lib/media/editions';
const DATASOURCE_PATH = 'src/lib/data/datasource.ts';

function slugify(text) {
    return text
        .toString()
        .normalize('NFD')                   // split an accented letter into the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')              // replace spaces with -
        .replace(/[^\w\.-]+/g, '')        // remove all non-word chars
        .replace(/\-\-+/g, '-');           // replace multiple - with single -
}

function getPdfMetadata(pdfPath) {
    try {
        const info = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
        const metadata = {};
        info.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                metadata[key.trim()] = valueParts.join(':').trim();
            }
        });
        return metadata;
    } catch (e) {
        console.error(`Could not extract metadata for ${pdfPath}`, e);
        return {};
    }
}

function clearGeneratedPages(targetDir) {
    if (!fs.existsSync(targetDir)) return;

    const files = fs.readdirSync(targetDir);
    files.forEach(file => {
        if (/^page-\d+\.jpg$/i.test(file) || file.toLowerCase() === 'thumb.jpg') {
            fs.rmSync(path.join(targetDir, file), { force: true });
        }
    });
}

function getFirstGeneratedPagePath(targetDir) {
    if (!fs.existsSync(targetDir)) return null;

    const pageFiles = fs.readdirSync(targetDir)
        .map(file => {
            const match = file.match(/^page-(\d+)\.jpg$/i);
            if (!match) return null;
            return { file, pageNumber: Number(match[1]) };
        })
        .filter(Boolean)
        .sort((a, b) => a.pageNumber - b.pageNumber);

    if (pageFiles.length === 0) return null;
    return path.join(targetDir, pageFiles[0].file);
}

function ensureThumbFromFirstPage(slug) {
    const targetDir = path.join(IMAGE_OUTPUT_DIR, slug);
    const firstPage = getFirstGeneratedPagePath(targetDir);
    if (!firstPage) return false;

    const thumb = path.join(targetDir, 'thumb.jpg');
    fs.copyFileSync(firstPage, thumb);
    console.log(`Created thumb: ${thumb}`);
    return true;
}

function processPdf(pdfPath, slug, relativePdfPath) {
    const targetDir = path.join(IMAGE_OUTPUT_DIR, slug);

    console.log(`Processing: ${pdfPath} -> ${targetDir}`);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Split PDF into JPGs
    try {
        clearGeneratedPages(targetDir);
        execFileSync('pdftocairo', ['-jpeg', pdfPath, path.join(targetDir, 'page')]);
        if (!ensureThumbFromFirstPage(slug)) {
            throw new Error(`No generated page JPGs found for ${slug} after conversion.`);
        }
    } catch (e) {
        console.error(`Error splitting PDF ${pdfPath}:`, e);
        throw e;
    }

    // Prepare metadata
    const metadata = getPdfMetadata(pdfPath);
    const editionTitle = metadata['Title'] || slug.replace(/-/g, ' ');
    const date = metadata['CreationDate'] || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newEdition = {
        id: new Date().getFullYear().toString(),
        name: slug,
        subtitle: editionTitle,
        isbn: '-',
        description: '...',
        publishingDate: date,
        coPublisher: metadata['Creator'] || '',
        coPublisherUrl: '',
        downloadHref: `/${path.posix.join('pdfs', relativePdfPath.split(path.sep).join('/'))}`,
        editors: [],
        designers: [],
        contributors: [],
        keywords: [],
        parentProject: '',
        parentUrl: '',
    };

    return newEdition;
}

function hasGeneratedPages(slug) {
    const targetDir = path.join(IMAGE_OUTPUT_DIR, slug);
    if (!fs.existsSync(targetDir)) return false;

    const files = fs.readdirSync(targetDir);
    return files.some(file => /^page-\d+\.jpg$/i.test(file));
}

function hasThumb(slug) {
    const targetDir = path.join(IMAGE_OUTPUT_DIR, slug);
    return fs.existsSync(path.join(targetDir, 'thumb.jpg'));
}

function getPdfFilesRecursive(rootDir, currentDir = rootDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const pdfFiles = [];

    entries.forEach(entry => {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
            pdfFiles.push(...getPdfFilesRecursive(rootDir, fullPath));
            return;
        }

        if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
            pdfFiles.push(path.relative(rootDir, fullPath));
        }
    });

    return pdfFiles;
}

function readDatasource() {
    let content = fs.readFileSync(DATASOURCE_PATH, 'utf8');
    // We try to extract the array content. This is brittle but works for the current structure.
    const startMatch = content.indexOf('editions: Edition[] = [');
    if (startMatch === -1) return { content, editions: [] };

    const openingBracket = content.indexOf('[', startMatch);
    const closingBracket = content.lastIndexOf(']');

    // This is a hacky way to parse a TS/JS array. 
    // In a real environment, we might use a proper TS parser or transform to JSON.
    // For now, we'll use regex to find individual objects if possible, or just analyze the string.
    const editionsStr = content.slice(openingBracket, closingBracket + 1);

    // We'll rely on our manual identification of 'name' properties for sync.
    const nameRegex = /name:\s*['"]([^'"]+)['"]/g;
    let names = [];
    let m;
    while ((m = nameRegex.exec(editionsStr)) !== null) {
        names.push(slugify(m[1]));
    }

    return { content, names, lastBracketIndex: closingBracket };
}

function updateDatasource(newEditions) {
    if (newEditions.length === 0) return;

    let { content, lastBracketIndex } = readDatasource();

    let entriesString = '';
    newEditions.forEach(edition => {
        entriesString += `,\n    ${JSON.stringify(edition, null, 8).slice(0, -1).replace(/"([^"]+)":/g, '$1:')}    }`;
    });

    const updatedContent = content.slice(0, lastBracketIndex) + entriesString + content.slice(lastBracketIndex);
    fs.writeFileSync(DATASOURCE_PATH, updatedContent);
}

function sync() {
    const { names: existingNames } = readDatasource();

    // Ensure directories exist
    if (!fs.existsSync(PDF_SOURCE_DIR)) fs.mkdirSync(PDF_SOURCE_DIR, { recursive: true });
    if (!fs.existsSync(IMAGE_OUTPUT_DIR)) fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });

    const allAssetFiles = fs.readdirSync(IMAGE_OUTPUT_DIR);

    const pdfFiles = getPdfFilesRecursive(PDF_SOURCE_DIR);
    const assetFolders = allAssetFiles.filter(f => fs.statSync(path.join(IMAGE_OUTPUT_DIR, f)).isDirectory());

    console.log('--- SYNC START ---');
    console.log('Existing in JSON:', existingNames);

    let newEditionsData = [];
    let hasProcessingErrors = false;

    // 1. Check for new PDFs
    pdfFiles.forEach(file => {
        const rawName = path.basename(file, '.pdf');
        const slug = slugify(rawName);
        const pdfPath = path.join(PDF_SOURCE_DIR, file);

        if (!existingNames.includes(slug)) {
            console.log(`[NEW PDF] Found ${file}, adding to datasource...`);
            try {
                const data = processPdf(pdfPath, slug, file);
                newEditionsData.push(data);
            } catch (_) {
                hasProcessingErrors = true;
            }
        } else {
            if (hasGeneratedPages(slug)) {
                console.log(`[OK] ${file} already in datasource and page JPGs exist.`);
                if (!hasThumb(slug)) {
                    console.log(`[MISSING THUMB] ${file} has pages but no thumb. Creating thumb...`);
                    if (!ensureThumbFromFirstPage(slug)) {
                        console.error(`[MISSING THUMB] Could not create thumb for ${file}.`);
                        hasProcessingErrors = true;
                    }
                }
            } else {
                console.log(`[MISSING JPGS] ${file} is in datasource but page JPGs are missing. Re-generating...`);
                try {
                    processPdf(pdfPath, slug, file);
                } catch (_) {
                    hasProcessingErrors = true;
                }
            }
        }
    });

    // 2. Check for orphaned JSON entries
    existingNames.forEach(name => {
        const pdfExists = pdfFiles.some(f => slugify(path.basename(f, '.pdf')) === name);
        if (!pdfExists) {
            console.warn(`[WARNING] Orphaned JSON entry: '${name}'. No matching PDF found.`);
        }
    });

    // 3. Check for orphaned asset folders
    assetFolders.forEach(folder => {
        const pdfExists = pdfFiles.some(f => slugify(path.basename(f, '.pdf')) === folder);
        if (!pdfExists) {
            console.warn(`[CLEANUP] Orphaned Asset Folder: '${folder}'. No matching PDF found. Deleting...`);
            fs.rmSync(path.join(IMAGE_OUTPUT_DIR, folder), { recursive: true, force: true });
        }
    });

    if (newEditionsData.length > 0) {
        updateDatasource(newEditionsData);
        console.log(`Added ${newEditionsData.length} new entries to ${DATASOURCE_PATH}`);
    }

    if (hasProcessingErrors) {
        throw new Error('One or more PDFs failed to process.');
    }

    console.log('--- SYNC END ---');
}

sync();
