/**
 * App Router shell audit — `node scripts/check/app-shell.mjs`
 *
 * Next requires the topmost layout of every UI branch to supply <html> and
 * <body>. Get it wrong and the build fails with "Missing Root Layout tags" —
 * after the install and the compile, several minutes in.
 *
 * This project moved that shell out of `app/layout.tsx` and into
 * `app/[locale]/layout.tsx`, so `lang` could be the locale from the URL rather
 * than a hardcoded "en" contradicting the hreflang on the same page. That move
 * only works while `app/layout.tsx` does not exist: if it comes back, it
 * becomes the root again and has to carry the shell itself.
 *
 * Four rules, all of them things the build would otherwise tell you slowly:
 *
 *   1. No `app/layout.tsx`, or it has <html> and <body>.
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
if (existsSync(rootLayout)) {
  const src = read(rootLayout);
  if (!src.includes('<html') || !src.includes('<body')) {
    problems.push(
      'app/layout.tsx exists, which makes it the root layout — it must contain <html> and <body>, ' +
        'or be deleted so each top-level segment provides its own.',
    );
  }
} else {
  for (const segment of [...uiSegments].sort()) {
    const layout = join(APP, segment, 'layout.tsx');
    if (!existsSync(layout)) {
      problems.push(`app/${segment}/ has pages but no layout.tsx to supply <html> and <body>.`);
      continue;
    }
    const src = read(layout);
    if (!src.includes('<html') || !src.includes('<body')) {
      problems.push(`${rel(layout)} is a root layout and is missing <html> or <body>.`);
    }
  }
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
