/**
 * Palette Export — color palette export in various formats.
 *
 * Supports: HEX text, CSS Variables, JSON, SVG Palette Card,
 * Adobe ASE (ASCII subset), GPL (GIMP Palette), CSV.
 */

import type { ColorPalette } from './types';
import { hexToRgb, rgbToHsl, rgbToHsv, rgbToCmyk } from './converters';
import { generateTokens } from './tokens';
import type { TokenFormat } from './types';

/* ─── Plain-text exports ─────────────────────────────────────────────────────── */

/** Export palette as HEX list (one per line). */
export function exportPaletteAsHex(colors: string[]): string {
  return colors.join('\n');
}

/** Export palette as RGB list. */
export function exportPaletteAsRgb(colors: string[]): string {
  return colors.map((hex) => {
    const rgb = hexToRgb(hex);
    return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex;
  }).join('\n');
}

/** Export palette as HSL list. */
export function exportPaletteAsHsl(colors: string[]): string {
  return colors.map((hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb);
    return `hsl(${Math.round(hsl.h * 360)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)`;
  }).join('\n');
}

/* ─── CSS Variables export ───────────────────────────────────────────────────── */

/** Export palette as CSS custom properties. */
export function exportPaletteAsCSS(
  colors: string[],
  prefix = 'color',
): string {
  const map: Record<string, string> = {};
  colors.forEach((hex, i) => {
    map[`${prefix}-${i + 1}`] = hex;
  });
  return generateTokens(map, 'css');
}

/* ─── JSON export ────────────────────────────────────────────────────────────── */

/** Export palette as structured JSON. */
export function exportPaletteAsJSON(palette: ColorPalette): string {
  const data = {
    name: palette.name,
    colors: palette.colors.map((hex) => {
      const rgb = hexToRgb(hex);
      if (!rgb) return { hex };
      const hsl = rgbToHsl(rgb);
      const hsv = rgbToHsv(rgb);
      const cmyk = rgbToCmyk(rgb);
      return {
        hex,
        rgb: { r: rgb.r, g: rgb.g, b: rgb.b },
        hsl: { h: Math.round(hsl.h * 360), s: Math.round(hsl.s * 100), l: Math.round(hsl.l * 100) },
        hsv: { h: Math.round(hsv.h * 360), s: Math.round(hsv.s * 100), v: Math.round(hsv.v * 100) },
        cmyk: { c: Math.round(cmyk.c * 100), m: Math.round(cmyk.m * 100), y: Math.round(cmyk.y * 100), k: Math.round(cmyk.k * 100) },
      };
    }),
    count: palette.colors.length,
    generatedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

/* ─── SVG Palette Card export ────────────────────────────────────────────────── */

/** Export palette as an SVG preview card. */
export function exportPaletteAsSVG(
  colors: string[],
  name = 'Color Palette',
): string {
  const swatchHeight = 60;
  const swatchWidth = 120;
  const padding = 20;
  const headerHeight = 30;
  const perRow = Math.min(colors.length, 6);
  const rows = Math.ceil(colors.length / perRow);
  const totalWidth = perRow * swatchWidth + padding * 2;
  const totalHeight = rows * swatchHeight + padding * 2 + headerHeight;

  let swatches = '';
  colors.forEach((hex, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const x = padding + col * swatchWidth;
    const y = padding + headerHeight + row * swatchHeight;

    swatches += `
    <g>
      <rect x="${x}" y="${y}" width="${swatchWidth - 4}" height="${swatchHeight - 4}" rx="4" fill="${hex}" stroke="#e5e7eb" stroke-width="0.5"/>
      <text x="${x + (swatchWidth - 4) / 2}" y="${y + swatchHeight - 12}" text-anchor="middle" font-family="monospace" font-size="9" fill="#fff" opacity="0.0" class="label">
        <tspan>${hex}</tspan>
      </text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <defs>
    <style>
      .title { font-family: system-ui, sans-serif; font-size: 12px; font-weight: 600; fill: #111; }
      .label { fill: #fff; font-family: monospace; font-size: 9px; }
      g:hover .label { opacity: 1; }
    </style>
  </defs>
  <rect width="${totalWidth}" height="${totalHeight}" fill="#fff" rx="8"/>
  <text x="${padding}" y="${padding + 14}" class="title">${name}</text>
  ${swatches}
</svg>`;
}

/* ─── Adobe ASE (ASCII subset) export ────────────────────────────────────────── */

/**
 * Export palette as Adobe ASE (ASCII subset — hex color entries).
 *
 * ASE is a binary format; this produces a simplified ASCII-ASE that
 * many modern design tools can import.
 */
export function exportPaletteAsASE(colors: string[], name = 'Color Palette'): string {
  const lines: string[] = [];
  lines.push(`ASEF;1.0;{${name}}`);
  colors.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      lines.push(`#${hex.replace('#', '')};{Color ${i + 1}};RGB;${(rgb.r / 255).toFixed(6)};${(rgb.g / 255).toFixed(6)};${(rgb.b / 255).toFixed(6)}`);
    }
  });
  return lines.join('\n');
}

/* ─── GPL (GIMP Palette) export ──────────────────────────────────────────────── */

/** Export palette as GIMP Palette (.gpl) format. */
export function exportPaletteAsGPL(colors: string[], name = 'Color Palette'): string {
  const lines: string[] = [];
  lines.push('GIMP Palette');
  lines.push(`Name: ${name}`);
  lines.push(`Created: ${new Date().toISOString().split('T')[0]}`);
  lines.push('#');
  colors.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      lines.push(`${rgb.r.toString().padStart(3)} ${rgb.g.toString().padStart(3)} ${rgb.b.toString().padStart(3)}  Color ${i + 1}`);
    }
  });
  return lines.join('\n');
}

/* ─── CSV export ─────────────────────────────────────────────────────────────── */

/** Export palette as CSV (name, hex, r, g, b, h, s, l). */
export function exportPaletteAsCSV(colors: string[], name = 'Color Palette'): string {
  const rows = [['Name', 'Hex', 'R', 'G', 'B', 'H', 'S%', 'L%']];
  colors.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      const hsl = rgbToHsl(rgb);
      rows.push([
        `Color ${i + 1}`,
        hex,
        String(rgb.r),
        String(rgb.g),
        String(rgb.b),
        String(Math.round(hsl.h * 360)),
        String(Math.round(hsl.s * 100)),
        String(Math.round(hsl.l * 100)),
      ]);
    }
  });
  return rows.map(row => row.join(',')).join('\n');
}

/* ─── Token format export (reuses tokens.ts) ─────────────────────────────────── */

/** Export palette using the standard token generator. */
export function exportPaletteAsTokens(
  colors: string[],
  format: TokenFormat,
  prefix = 'color',
): string {
  const map: Record<string, string> = {};
  colors.forEach((hex, i) => {
    map[`${prefix}-${i + 1}`] = hex;
  });
  return generateTokens(map, format);
}

/* ─── Format registry ────────────────────────────────────────────────────────── */

export type PaletteExportFormat =
  | 'hex'
  | 'rgb'
  | 'hsl'
  | 'css'
  | 'json'
  | 'svg'
  | 'ase'
  | 'gpl'
  | 'csv'
  | 'tailwind'
  | 'scss'
  | 'style-dictionary';

export const PALETTE_EXPORT_FORMATS: { value: PaletteExportFormat; label: string }[] = [
  { value: 'hex', label: 'HEX List' },
  { value: 'rgb', label: 'RGB List' },
  { value: 'hsl', label: 'HSL List' },
  { value: 'css', label: 'CSS Variables' },
  { value: 'json', label: 'JSON' },
  { value: 'svg', label: 'SVG Palette' },
  { value: 'ase', label: 'Adobe ASE' },
  { value: 'gpl', label: 'GIMP Palette' },
  { value: 'csv', label: 'CSV' },
  { value: 'tailwind', label: 'Tailwind Config' },
  { value: 'scss', label: 'SCSS Variables' },
  { value: 'style-dictionary', label: 'Style Dictionary' },
];

type PaletteExporter = (colors: string[], name?: string) => string;

const EXPORTERS: Record<PaletteExportFormat, PaletteExporter> = {
  hex: (colors) => exportPaletteAsHex(colors),
  rgb: (colors) => exportPaletteAsRgb(colors),
  hsl: (colors) => exportPaletteAsHsl(colors),
  css: (colors, name) => exportPaletteAsCSS(colors),
  json: (colors, name) => exportPaletteAsJSON({ name: name ?? 'Color Palette', colors }),
  svg: (colors, name) => exportPaletteAsSVG(colors, name),
  ase: (colors, name) => exportPaletteAsASE(colors, name),
  gpl: (colors, name) => exportPaletteAsGPL(colors, name),
  csv: (colors, name) => exportPaletteAsCSV(colors, name),
  tailwind: (colors, name) => exportPaletteAsTokens(colors, 'tailwind'),
  scss: (colors, name) => exportPaletteAsTokens(colors, 'scss'),
  'style-dictionary': (colors, name) => exportPaletteAsTokens(colors, 'style-dictionary'),
};

/** Export a palette in the specified format. */
export function exportPalette(
  colors: string[],
  format: PaletteExportFormat,
  name?: string,
): string {
  const exporter = EXPORTERS[format];
  if (!exporter) return `/* Unsupported format: ${format} */`;
  return exporter(colors, name);
}
