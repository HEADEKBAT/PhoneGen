/**
 * Import resolution audit — `node scripts/check/imports.mjs`
 *
 * Every relative and `@/`-aliased import must resolve to a file that exists
 * with exactly the case it was written in.
 *
 * ── Why this check exists ───────────────────────────────────────────────────
 *
 * Windows and macOS resolve paths without regard to case; Linux does not, and
 * Linux is what builds the site. So a file can be committed as `FAQSection.tsx`
 * while the code imports `./FaqSection`, and everything works on the developer's
 * machine, passes tsc, passes eslint, and then fails in CI with
 * "Module not found" — which is exactly what happened: `rm FAQSection.tsx`
 * deleted a newly written `FaqSection.tsx`, because to that filesystem they are
 * the same name, and git has `core.ignorecase=true` so it recorded nothing.
 *
 * Reading directories rather than testing each path is the whole trick:
 * `readdir` reports the real case even on a filesystem that ignores it, so this
 * catches the mismatch on the machine where it is introduced, not three
 * deployments later.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SKIP = new Set(['node_modules', '.next', '.git', 'out', 'build', '.vercel']);
/* Declaration files are excluded: next-env.d.ts is generated and points into
   .next/, a build artefact that does not exist on a clean checkout. */
const SOURCE = /\.(?:tsx?|mjs|jsx?)$/;
const DECLARATION = /\.d\.tsx?$/;

/** Extensions and index files a bare specifier may stand for. */
const CANDIDATES = [
  '', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css',
  '/index.ts', '/index.tsx', '/index.js', '/index.mjs',
];

/* ── Every real path, at its real case ────────────────────────────────────── */

const real = new Set();
const sources = [];

(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).split('\\').join('/');
    real.add(rel);
    if (entry.isDirectory()) walk(full);
    else if (SOURCE.test(entry.name) && !DECLARATION.test(entry.name)) {
      sources.push({ full, rel });
    }
  }
})(ROOT);

/* ── Specifiers ───────────────────────────────────────────────────────────── */

/* `from '…'`, `import('…')` and `require('…')`, single or double quoted.
   Template literals are skipped: a runtime-composed path cannot be checked. */
const SPECIFIER = /(?:from|import|require)\s*\(?\s*['"]([^'"]+)['"]/g;

function resolveSpecifier(spec, fromRel) {
  let base;
  if (spec.startsWith('@/')) base = spec.slice(2);
  else if (spec.startsWith('.')) {
    base = relative(ROOT, resolve(dirname(join(ROOT, fromRel)), spec))
      .split('\\')
      .join('/');
  } else return null; // a package, not ours

  for (const suffix of CANDIDATES) {
    const candidate = base + suffix;
    if (!real.has(candidate)) continue;
    try {
      if (suffix === '' && statSync(join(ROOT, candidate)).isDirectory()) continue;
    } catch {
      continue;
    }
    return candidate;
  }
  return null;
}

/* ── Audit ────────────────────────────────────────────────────────────────── */

const problems = [];

for (const file of sources) {
  const text = readFileSync(file.full, 'utf8');
  SPECIFIER.lastIndex = 0;
  let match;
  while ((match = SPECIFIER.exec(text)) !== null) {
    const spec = match[1];
    if (!spec.startsWith('.') && !spec.startsWith('@/')) continue;
    if (resolveSpecifier(spec, file.rel)) continue;

    /* Distinguish "wrong case" from "not there at all" — the first is the
       trap this check was written for and deserves to say so. */
    const wanted = (spec.startsWith('@/')
      ? spec.slice(2)
      : relative(ROOT, resolve(dirname(join(ROOT, file.rel)), spec)).split('\\').join('/')
    ).toLowerCase();

    const near = [...real].find((p) => {
      const lower = p.toLowerCase();
      return CANDIDATES.some((suffix) => lower === wanted + suffix);
    });

    problems.push({ file: file.rel, spec, near });
  }
}

if (problems.length === 0) {
  console.log(`✓ every relative import in ${sources.length} files resolves, case and all`);
  process.exit(0);
}

console.log(`✗ ${problems.length} import(s) do not resolve:\n`);
for (const problem of problems) {
  console.log(`  ${problem.file}`);
  console.log(`      imports  ${problem.spec}`);
  if (problem.near) {
    console.log(`      on disk  ${problem.near}   ← same name, different case`);
  } else {
    console.log('      no file of that name exists');
  }
  console.log('');
}
console.log('Linux resolves paths case-sensitively; the build machine is Linux.');
process.exit(1);
