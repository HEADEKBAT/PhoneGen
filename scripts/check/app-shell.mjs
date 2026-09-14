/**
 * App Router shell audit — `node scripts/check/app-shell.mjs`
 *
 * Next requires exactly one root layout, and it must supply <html> and <body>.
 * Get it wrong and the build fails with "Missing Root Layout tags" — after the
 * install and the compile, several minutes in.
 *
 * The root layout here is `app/[locale]/layout.tsx`: there is no
 * `app/layout.tsx`, which is Next's documented shape for a localised site and
 * the only arrangement that puts `lang` in the served HTML. A layout above
 * `[locale]` cannot read the segment below it, so it cannot know the language;
 * with one, `lang` had to be patched in by a script after parse, which a
 * crawler reading raw HTML never sees.
 *
 * (An earlier note in this file claimed a dynamic segment's layout could not
 * be the root and that deleting `app/layout.tsx` 404s the tree. That was wrong
 * — measured on the dev server: all six locales answer 200 and carry their own
 * `lang`. The rules below check the arrangement rather than assert a shape.)
 *
 * Five rules, all of them things the build would otherwise tell you slowly:
 *
 *   1. Exactly one layout under app/ contains <html> and <body>.
 *   2. That layout sits above every page.tsx, so every route inherits it.
 *   3. It sets `lang` on <html>.
 *   4. No layout exports `metadata` and `generateMetadata` together.
 *   5. `globals.css` is imported by that layout, exactly once.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
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

const layouts = files.filter((f) => f.endsWith('layout.tsx'));
const pages = files.filter((f) => f.endsWith('page.tsx'));

/* 1 — one shell, no more, no fewer. */
const shells = layouts.filter((f) => {
  const src = read(f);
  return src.includes('<html') && src.includes('<body');
});

if (shells.length === 0) {
  problems.push(
    'No layout under app/ contains <html> and <body>. Without a root layout every route 404s.',
  );
} else if (shells.length > 1) {
  problems.push(
    `${shells.length} layouts contain <html>: ${shells.map(rel).join(', ')}. Next allows one root layout.`,
  );
}

const shell = shells[0];

/* 2 — every page must sit under it, or it is not the root. */
if (shell) {
  const shellDir = dirname(shell);
  const orphans = pages.filter((p) => !p.startsWith(shellDir + '/') && !p.startsWith(shellDir + '\\'));
  if (orphans.length) {
    problems.push(
      `${rel(shell)} is the only root layout, but ${orphans.length} page(s) sit outside it ` +
        `and so have no <html>: ${orphans.map(rel).join(', ')}.`,
    );
  }

  /* 3 — the whole reason the shell lives under [locale]. */
  if (!/<html[^>]*\slang=/.test(read(shell))) {
    problems.push(
      `${rel(shell)} does not set lang on <html>. It is under the locale segment precisely ` +
        'so that it can — otherwise every locale serves HTML with no declared language.',
    );
  }
}

if (pages.length === 0) problems.push('No page.tsx anywhere under app/ — nothing would render.');

/* 4 — Next forbids both metadata exports from one file. */
for (const file of layouts) {
  const src = read(file);
  if (/export const metadata\b/.test(src) && /export (async )?function generateMetadata\b/.test(src)) {
    problems.push(`${rel(file)} exports both metadata and generateMetadata; Next allows one.`);
  }
}

/* 5 — the stylesheet, once, in the shell. */
const css = files.filter((f) => read(f).includes('globals.css'));
if (css.length !== 1) {
  problems.push(`globals.css is imported by ${css.length} files; it belongs to the root layout alone.`);
} else if (shell && css[0] !== shell) {
  problems.push(`globals.css is imported by ${rel(css[0])}, not by the root layout ${rel(shell)}.`);
}

if (problems.length === 0) {
  console.log(
    `✓ app shell is sound — root layout ${rel(shell)} with lang, ${pages.length} page(s) under it, one stylesheet`,
  );
  process.exit(0);
}

console.log(`✗ ${problems.length} problem(s) with the App Router shell:\n`);
for (const problem of problems) console.log(`  • ${problem}`);
console.log('\nhttps://nextjs.org/docs/messages/missing-root-layout-tags');
process.exit(1);
