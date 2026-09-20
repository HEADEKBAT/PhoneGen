/**
 * Regenerates lib/qr/capacity.ts from the `qrcode` package's own tables.
 *
 * The numbers are ISO/IEC 18004 Table 7 (Byte mode) and do not change, so this
 * runs by hand rather than at build time; `--check` fails if the committed
 * file has drifted, which is what `npm run check:qr-capacity` does.
 *
 * It reads `qrcode/lib/core/version`, which is an internal path. That is the
 * reason the table is generated into a plain file instead of being read at
 * runtime: an internal that moves breaks this script, which is a build
 * failure, rather than the studio, which would be a scanning failure.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Version = require('qrcode/lib/core/version');
const Mode = require('qrcode/lib/core/mode');
const ECLevel = require('qrcode/lib/core/error-correction-level');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TARGET = join(ROOT, 'lib', 'qr', 'capacity.ts');

const rows = [];
for (let version = 1; version <= 40; version++) {
  const cells = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H].map((level) =>
    String(Version.getCapacity(version, level, Mode.BYTE)).padStart(4),
  );
  rows.push(`  [${cells.join(', ')}],`);
}

const existing = readFileSync(TARGET, 'utf8');
const rebuilt = existing.replace(
  /(export const BYTE_CAPACITY: readonly \(readonly number\[\]\)\[\] = \[\n)[\s\S]*?(\n\] as const;)/,
  (_, head, tail) => head + rows.join('\n') + tail,
);

if (process.argv.includes('--check')) {
  if (existing !== rebuilt) {
    console.error('✗ lib/qr/capacity.ts is stale — run `npm run build:qr-capacity`');
    process.exit(1);
  }
  console.log('✓ QR byte-mode capacity table matches ISO/IEC 18004 Table 7 — 40 versions × 4 levels');
} else {
  writeFileSync(TARGET, rebuilt, 'utf8');
  console.log('✓ wrote lib/qr/capacity.ts — 40 versions × 4 levels');
}
