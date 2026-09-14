/**
 * App Router shell audit — `node scripts/check/app-shell.mjs`
 *
 * Next requires the topmost layout of every UI branch to supply <html> and
 * <body>. Get it wrong and the build fails with "Missing Root Layout tags" —
 * after the install and the compile, several minutes in.
 *
 * Learned the hard way: `app/[locale]/layout.tsx` does NOT become the root
 * layout when `app/layout.tsx` is deleted. Removing it 404s the entire locale
 * tree — every page, not just the root — because a dynamic segment's layout
 * is not eligible for the role. The shell stays in `app/layout.tsx`, which is
 * also why `lang` cannot be set there: a root layout cannot see a route param
 * nested below it. The locale layout sets it instead.
 *
 * Four rules, all of them things the build would otherwise tell you slowly:
 *
 *   1. `app/layout.tsx` exists and has <html> and <body>.
 *   2. Every top-level segment holding a page has a layout with both tags.
 *   3. No layout exports `metadata` and `generateMetadata` together.
 *   4. `globals.css` is imported by a root layout, exactly once.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const APP = join(ROOT, 'app');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.tsx')) out.push(full);
  }
  return out;
}

const files = walk(APP);
const rel = (f) => relative(ROOT, f).split('\\').join('/');
const read = (f) => readFileSync(f, 'utf8');
const problems = [];

/* 1 + 2 — a shell for every branch that renders. */
const uiSegments = new Set(
  files
    .filter((f) => f.endsWith('page.tsx'))
    .map((f) => relative(APP, f).split(/[\\/]/)[0]),
);

const rootLayout = join(APP, 'layout.tsx');
if (!existsSync(rootLayout)) {
  problems.push(
    'app/layout.tsx is missing. Nothing else takes its place — a dynamic segment ' +
      "such as app/[locale]/layout.tsx is not eligible, and without a root layout every " +
      'route under it answers 404.',
  );
} else {
  const src = read(rootLayout);
  if (!src.includes('<html') || !src.includes('<body')) {
    problems.push('app/layout.tsx is the root layout and must contain <html> and <body>.');
  }
}

if (uiSegments.size === 0) {
  problems.push('No page.tsx anywhere under app/ — nothing would render.');
}

/* 3 — Next forbids both metadata exports from one file. */
for (const file of files.filter((f) => f.endsWith('layout.tsx'))) {
  const src = read(file);
  if (/export const metadata\b/.test(src) && /export (async )?function generateMetadata\b/.test(src)) {
    problems.push(`${rel(file)} exports both metadata and generateMetadata; Next allows one.`);
  }
}

/* 4 — the stylesheet, once, at the top. */
const css = files.filter((f) => read(f).includes('globals.css'));
if (css.length !== 1) {
  problems.push(`globals.css is imported by ${css.length} files; it belongs to the root layout alone.`);
} else if (!css[0].endsWith('layout.tsx')) {
  problems.push(`globals.css is imported by ${rel(css[0])}, which is not a layout.`);
}

if (problems.length === 0) {
  console.log(
    `✓ app shell is sound — ${uiSegments.size} UI segment(s), one <html>, one stylesheet`,
  );
  process.exit(0);
}

console.log(`✗ ${problems.length} problem(s) with the App Router shell:\n`);
for (const problem of problems) console.log(`  • ${problem}`);
console.log('\nhttps://nextjs.org/docs/messages/missing-root-layout-tags');
process.exit(1);
