const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PDFS_DIR = 'static/editions';
const DATASOURCE_PATH = 'src/lib/data/datasource.ts';

/**
 * Normalizes a string to be used as a filename/slug:
 * - Lowercase
 * - Remove accents
 * - Replace spaces with hyphens
 * - Remove special characters exception for . and -
 */
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
        const info = execSync(`pdfinfo "${pdfPath}"`, { encoding: 'utf8' });
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

function processPdf(pdfPath, slug) {
    const targetDir = path.join(PDFS_DIR, slug);

    console.log(`Processing: ${pdfPath} -> ${targetDir}`);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Split PDF into JPGs
    try {
        execSync(`pdftocairo -jpeg -origpagesize "${pdfPath}" "${path.join(targetDir, 'page')}"`);
    } catch (e) {
        console.error(`Error splitting PDF ${pdfPath}:`, e);
        return null;
    }

    // Prepare metadata
    const metadata = getPdfMetadata(pdfPath);
    const editionTitle = metadata['Title'] || slug.replace(/-/g, ' ');
    const date = metadata['CreationDate'] || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const newEdition = {
        id: new Date().getFullYear().toString(),
        name: slug,
        coverImg: `${slug}/page-1.jpg`,
        subtitle: editionTitle,
        isbn: '-',
        description: '...',
        publishingDate: date,
        coPublisher: metadata['Creator'] || '',
        coPublisherUrl: '',
        downloadHref: `/editions/${path.basename(pdfPath)}`,
        editors: [],
        designers: [],
        contributors: [],
        keywords: [],
        parentProject: '',
        parentUrl: '',
    };

    return newEdition;
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
        names.push(m[1]);
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
    const allFiles = fs.readdirSync(PDFS_DIR);

    const pdfFiles = allFiles.filter(f => f.endsWith('.pdf'));
    const assetFolders = allFiles.filter(f => fs.statSync(path.join(PDFS_DIR, f)).isDirectory());

    console.log('--- SYNC START ---');
    console.log('Existing in JSON:', existingNames);

    let newEditionsData = [];
    let processedSlugs = new Set();

    // 1. Check for new PDFs
    pdfFiles.forEach(file => {
        const rawName = path.basename(file, '.pdf');
        const slug = slugify(rawName);
        processedSlugs.add(slug);

        // Rename PDF if not normalized? 
        // For now, we just use the slug for the 'name' and folder.

        if (!existingNames.includes(slug)) {
            console.log(`[NEW PDF] Found ${file}, adding to datasource...`);
            const data = processPdf(path.join(PDFS_DIR, file), slug);
            if (data) newEditionsData.push(data);
        } else {
            console.log(`[OK] ${file} already in datasource.`);
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
            fs.rmSync(path.join(PDFS_DIR, folder), { recursive: true, force: true });
        }
    });

    if (newEditionsData.length > 0) {
        updateDatasource(newEditionsData);
        console.log(`Added ${newEditionsData.length} new entries to ${DATASOURCE_PATH}`);
    }

    console.log('--- SYNC END ---');
}

sync();
