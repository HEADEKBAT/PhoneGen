/**
 * Color data export.
 *
 * Exports colors to various formats: CSS, SVG, PNG, JSON, etc.
 */

import type { ColorPalette } from './types';

/** Export palette as CSS code. */
export function exportAsCSS(palette: ColorPalette, varPrefix = 'color'): string {
  return palette.colors
    .map((hex, i) => `  --${varPrefix}-${i + 1}: ${hex};`)
    .join('\n');
}

/** Export palette as JSON. */
export function exportAsJSON(palette: ColorPalette): string {
  return JSON.stringify(palette, null, 2);
}

/** Export palette as a CSV of hex values. */
export function exportAsCSV(palette: ColorPalette): string {
  return palette.colors.join(',');
}

/** Export palette as an SVG swatch sheet. */
export function exportAsSVG(palette: ColorPalette, swatchSize = 60): string {
  const cols = Math.min(palette.colors.length, 8);
  const rows = Math.ceil(palette.colors.length / cols);
  const swatches = palette.colors
    .map(
      (hex, i) =>
        `    <rect x="${(i % cols) * (swatchSize + 8)}" y="${Math.floor(i / cols) * (swatchSize + 24)}" width="${swatchSize}" height="${swatchSize}" fill="${hex}" rx="4" />\n` +
        `    <text x="${(i % cols) * (swatchSize + 8) + swatchSize / 2}" y="${Math.floor(i / cols) * (swatchSize + 24) + swatchSize + 14}" text-anchor="middle" font-family="monospace" font-size="10">${hex}</text>`,
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * (swatchSize + 8)}" height="${rows * (swatchSize + 24)}" viewBox="0 0 ${cols * (swatchSize + 8)} ${rows * (swatchSize + 24)}">
  <style>text { fill: #666; }</style>
${swatches}
</svg>`;
}

/** Export list of formatted strings for clipboard. */
export function exportAsFormattedList(
  palette: ColorPalette,
  format: 'hex' | 'rgb' | 'hsl' = 'hex',
): string {
  return palette.colors
    .map((hex, i) => `${i + 1}. ${hex}`)
    .join('\n');
}

/** Available export formats. */
export type ExportFormat = 'css' | 'json' | 'csv' | 'svg' | 'list';

export const EXPORT_FORMAT_LABELS: Record<ExportFormat, string> = {
  css: 'CSS Variables',
  json: 'JSON',
  csv: 'CSV',
  svg: 'SVG Sheet',
  list: 'Formatted List',
};
