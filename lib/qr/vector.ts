/**
 * Print-ready PDF and EPS, written from the module matrix.
 *
 * ── Why by hand ─────────────────────────────────────────────────────────────
 *
 * The studio offered PDF and EPS in the export menu and produced PNG bytes for
 * both, with the extension swapped on the way out. A printer opening that file
 * gets an error, or worse, prints a raster at whatever the file happens to be
 * and the customer finds out from the proofs. It was documented in a comment
 * as a thing to fix "deliberately", which is what this is.
 *
 * Neither format needs a library. A QR symbol is a grid of filled squares on a
 * background: in PostScript that is a `rectfill` per dark module, in PDF a `re
 * f`. Both files below are a few hundred lines of generated text and nothing
 * else — no dependency, no bundle weight, no rasterisation at any point.
 *
 * ── What these two formats buy that a PNG cannot ────────────────────────────
 *
 * A physical size. Both are written in PostScript points (1/72 inch), so the
 * caller asks for 30 millimetres and gets a symbol that measures 30
 * millimetres on the press, with the quiet zone inside the artwork and the
 * module grid landing on exact coordinates. That is the whole reason a print
 * shop asks for vector.
 *
 * ── What they do not carry ──────────────────────────────────────────────────
 *
 * The logo and the module shapes. Both are square-module, two-colour symbols:
 * the most reliable thing a press can reproduce, and what a code destined for
 * paper should be anyway. The studio says so at the point of export rather
 * than quietly dropping them.
 */

import type { QRMatrix } from './matrix';

export interface VectorOptions {
  /** Finished width in millimetres, quiet zone included. */
  widthMm: number;
  /** Quiet zone in modules, on all four sides. */
  quietZone: number;
  /** Dark module colour, `#rrggbb`. */
  foreground: string;
  /** Background colour, or null to leave the page unpainted. */
  background: string | null;
}

const MM_PER_INCH = 25.4;
const POINTS_PER_INCH = 72;

const mmToPt = (mm: number) => (mm / MM_PER_INCH) * POINTS_PER_INCH;

/** `#rrggbb` → the three 0–1 components PostScript and PDF both want. */
function rgb(hex: string): [number, number, number] {
  const clean = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#000000';
  return [
    parseInt(clean.slice(1, 3), 16) / 255,
    parseInt(clean.slice(3, 5), 16) / 255,
    parseInt(clean.slice(5, 7), 16) / 255,
  ];
}

const fixed = (value: number) => value.toFixed(3).replace(/\.?0+$/, '') || '0';

/**
 * Runs of adjacent dark modules within a row, as `[x, y, width]` in modules.
 *
 * One rectangle per module would be correct and would also be 1089 operators
 * for a version-4 symbol. Merging horizontal runs cuts that by roughly two
 * thirds and, more usefully, removes the hairline seams that some RIPs draw
 * between abutting rectangles.
 */
function rowRuns(matrix: QRMatrix): [number, number, number][] {
  const runs: [number, number, number][] = [];

  for (let y = 0; y < matrix.size; y++) {
    let start = -1;
    for (let x = 0; x <= matrix.size; x++) {
      const dark = x < matrix.size && matrix.isDark(x, y);
      if (dark && start < 0) start = x;
      else if (!dark && start >= 0) {
        runs.push([start, y, x - start]);
        start = -1;
      }
    }
  }

  return runs;
}

interface Geometry {
  /** Page side in points. */
  sidePt: number;
  /** Module side in points. */
  modulePt: number;
  /** Offset of the symbol's first module from the page edge, in points. */
  originPt: number;
}

function geometry(matrix: QRMatrix, options: VectorOptions): Geometry {
  const totalModules = matrix.size + options.quietZone * 2;
  const sidePt = mmToPt(options.widthMm);
  const modulePt = sidePt / totalModules;
  return { sidePt, modulePt, originPt: options.quietZone * modulePt };
}

/* ── EPS ─────────────────────────────────────────────────────────────── */

/**
 * Encapsulated PostScript, DSC 3.0.
 *
 * The bounding box is integer points, as the spec requires, and rounded
 * outwards so nothing is clipped. PostScript's origin is bottom-left, so rows
 * are emitted from the bottom up.
 */
export function buildEPS(matrix: QRMatrix, options: VectorOptions): string {
  const { sidePt, modulePt, originPt } = geometry(matrix, options);
  const [fr, fg, fb] = rgb(options.foreground);

  const lines: string[] = [
    '%!PS-Adobe-3.0 EPSF-3.0',
    `%%BoundingBox: 0 0 ${Math.ceil(sidePt)} ${Math.ceil(sidePt)}`,
    `%%HiResBoundingBox: 0 0 ${fixed(sidePt)} ${fixed(sidePt)}`,
    '%%Creator: GenCore QR Studio',
    `%%Title: QR Code, version ${matrix.version}, ${matrix.size}×${matrix.size} modules`,
    '%%LanguageLevel: 2',
    '%%EndComments',
    '%%BeginProlog',
    '/m { newpath 4 2 roll moveto } bind def',
    '%%EndProlog',
  ];

  if (options.background) {
    const [br, bg, bb] = rgb(options.background);
    lines.push(
      `${fixed(br)} ${fixed(bg)} ${fixed(bb)} setrgbcolor`,
      `0 0 ${fixed(sidePt)} ${fixed(sidePt)} rectfill`,
    );
  }

  lines.push(`${fixed(fr)} ${fixed(fg)} ${fixed(fb)} setrgbcolor`);

  for (const [x, y, width] of rowRuns(matrix)) {
    /* Bottom-up: row 0 of the matrix is the top row of the symbol. */
    const px = originPt + x * modulePt;
    const py = sidePt - originPt - (y + 1) * modulePt;
    lines.push(
      `${fixed(px)} ${fixed(py)} ${fixed(width * modulePt)} ${fixed(modulePt)} rectfill`,
    );
  }

  lines.push('showpage', '%%EOF', '');
  return lines.join('\n');
}

/* ── PDF ─────────────────────────────────────────────────────────────── */

/**
 * A single-page PDF, written directly.
 *
 * Five objects, an uncompressed content stream and a real cross-reference
 * table with byte offsets — the part that has to be exact, since a viewer
 * seeks by those numbers. Built as a byte string so the offsets are counted in
 * bytes rather than in code units; the content is ASCII, so the two agree
 * here, and the code does not depend on their agreeing.
 */
export function buildPDF(matrix: QRMatrix, options: VectorOptions): Uint8Array {
  const { sidePt, modulePt, originPt } = geometry(matrix, options);
  const [fr, fg, fb] = rgb(options.foreground);

  const ops: string[] = [];

  if (options.background) {
    const [br, bg, bb] = rgb(options.background);
    ops.push(
      `${fixed(br)} ${fixed(bg)} ${fixed(bb)} rg`,
      `0 0 ${fixed(sidePt)} ${fixed(sidePt)} re f`,
    );
  }

  ops.push(`${fixed(fr)} ${fixed(fg)} ${fixed(fb)} rg`);

  for (const [x, y, width] of rowRuns(matrix)) {
    const px = originPt + x * modulePt;
    const py = sidePt - originPt - (y + 1) * modulePt;
    ops.push(`${fixed(px)} ${fixed(py)} ${fixed(width * modulePt)} ${fixed(modulePt)} re f`);
  }

  const content = ops.join('\n');
  const side = fixed(sidePt);

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${side} ${side}] /Contents 4 0 R /Resources << >> >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  /* A binary comment marks the file as binary for transfer tools. */
  pdf += '%âãÏÓ\n';

  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  /* latin1: every byte written above is one byte, including the binary
     comment, which is exactly what the offsets were counted against. */
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}

/* ── SVG ─────────────────────────────────────────────────────────────── */

/**
 * The symbol as an SVG string, from the matrix alone.
 *
 * No DOM, so this runs on the server: the landing page renders a real QR code
 * into its own HTML rather than shipping an encoder to the browser to draw a
 * picture that never changes. The drawing library needs a document and cannot.
 *
 * Square modules only, like the two formats above — which is what a symbol
 * meant to be scanned off a page should be anyway.
 */
export function buildSVG(matrix: QRMatrix, options: Omit<VectorOptions, 'widthMm'>): string {
  const total = matrix.size + options.quietZone * 2;
  const path = rowRuns(matrix)
    .map(([x, y, width]) => `M${x + options.quietZone} ${y + options.quietZone}h${width}v1h-${width}z`)
    .join('');

  const background = options.background
    ? `<rect width="${total}" height="${total}" fill="${options.background}"/>`
    : '';

  /* viewBox in modules, so the caller sizes it with CSS and the grid still
     lands on whole units at any size. shape-rendering keeps the edges hard
     when a browser scales it down. */
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" role="img">`,
    background,
    `<path d="${path}" fill="${options.foreground}"/>`,
    '</svg>',
  ].join('');
}
