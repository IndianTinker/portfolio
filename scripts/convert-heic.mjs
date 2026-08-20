// Converts any .heic/.heif files under public/images to .webp, in place,
// and rewrites references to them in src/content/**/*.mdoc.
// Pass --watch to keep converting new files as they appear.
import { readdir, readFile, writeFile, rm } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';
import heicConvert from 'heic-convert';

const IMAGES_DIR = 'public/images';
const CONTENT_DIR = 'src/content';

async function findFiles(dir, matches) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await findFiles(full, matches);
    else matches.push(full);
  }
}

async function convertOne(file) {
  const input = await readFile(file);
  const jpegBuffer = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.92 });
  const webpBuffer = await sharp(jpegBuffer).webp({ quality: 85 }).toBuffer();
  const outPath = file.slice(0, -extname(file).length) + '.webp';
  await writeFile(outPath, webpBuffer);
  await rm(file);
  console.log(`converted ${basename(file)} -> ${basename(outPath)}`);
  return outPath;
}

async function rewriteReferences(renames) {
  const contentFiles = [];
  await findFiles(CONTENT_DIR, contentFiles);
  const mdocFiles = contentFiles.filter((f) => f.endsWith('.mdoc'));

  for (const mdocFile of mdocFiles) {
    let text = await readFile(mdocFile, 'utf8');
    let changed = false;
    for (const [oldPath, newPath] of renames) {
      if (text.includes(oldPath)) {
        text = text.split(oldPath).join(newPath);
        changed = true;
      }
    }
    if (changed) await writeFile(mdocFile, text);
  }
}

async function convertAll() {
  const files = [];
  await findFiles(IMAGES_DIR, files);
  const heicFiles = files.filter((f) => ['.heic', '.heif'].includes(extname(f).toLowerCase()));

  if (heicFiles.length === 0) return;

  const renames = new Map();
  for (const file of heicFiles) {
    const outPath = await convertOne(file);
    renames.set('/' + file.replace(/^public\//, ''), '/' + outPath.replace(/^public\//, ''));
  }
  await rewriteReferences(renames);
}

async function watchLoop() {
  await convertAll();
  console.log('watching public/images for HEIC uploads...');
  watch(IMAGES_DIR, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    if (!['.heic', '.heif'].includes(extname(filename).toLowerCase())) return;
    const file = join(IMAGES_DIR, filename);
    // Debounce: Keystatic finishes writing the file a moment after the first event.
    setTimeout(async () => {
      try {
        const outPath = await convertOne(file);
        const renames = new Map([[
          '/' + file.replace(/^public\//, ''),
          '/' + outPath.replace(/^public\//, ''),
        ]]);
        await rewriteReferences(renames);
      } catch {
        // file may have already been converted by a previous event for the same write
      }
    }, 500);
  });
}

if (process.argv.includes('--watch')) {
  watchLoop();
} else {
  convertAll();
}
