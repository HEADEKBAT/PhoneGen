/**
 * Design token generation.
 *
 * Generates CSS custom properties, Tailwind config, SCSS variables,
 * and Style Dictionary tokens from a color palette.
 */

import type { TokenFormat } from './types';

/** Generate design tokens from a set of named colors. */
export function generateTokens(
  colors: Record<string, string>,
  format: TokenFormat,
): string {
  switch (format) {
    case 'css':
      return generateCSSTokens(colors);
    case 'tailwind':
      return generateTailwindTokens(colors);
    case 'scss':
      return generateSCSSTokens(colors);
    case 'less':
      return generateLESSTokens(colors);
    case 'style-dictionary':
      return generateStyleDictionaryTokens(colors);
    default:
      return generateCSSTokens(colors);
  }
}

function generateCSSTokens(colors: Record<string, string>): string {
  const lines = [':root {'];
  for (const [name, hex] of Object.entries(colors)) {
    lines.push(`  --${name}: ${hex};`);
  }
  lines.push('}');
  return lines.join('\n');
}

function generateSCSSTokens(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([name, hex]) => `$${name}: ${hex};`)
    .join('\n');
}

function generateLESSTokens(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(([name, hex]) => `@${name.replace(/-/g, '-')}: ${hex};`)
    .join('\n');
}

function generateTailwindTokens(colors: Record<string, string>): string {
  const groups = new Map<string, Record<string, string>>();
  for (const [name, hex] of Object.entries(colors)) {
    const parts = name.split('-');
    const group = parts.length > 1 ? parts.slice(0, -1).join('-') : 'base';
    const shade = parts.length > 1 ? parts[parts.length - 1] : name;
    if (!groups.has(group)) groups.set(group, {});
    groups.get(group)![shade] = hex;
  }

  const lines = ['// Tailwind CSS v4 config', 'colors: {'];
  for (const [group, shades] of groups) {
    lines.push(`  '${group}': {`);
    for (const [shade, hex] of Object.entries(shades)) {
      lines.push(`    '${shade}': '${hex}',`);
    }
    lines.push('  },');
  }
  lines.push('},');
  return lines.join('\n');
}

function generateStyleDictionaryTokens(colors: Record<string, string>): string {
  const lines: string[] = [];
  for (const [name, hex] of Object.entries(colors)) {
    const parts = name.split('-');
    if (parts.length >= 2) {
      const shade = parts.pop()!;
      const base = parts.join('-');
      lines.push(`  "color": {
    "${base}": {
      "${shade}": { "value": "${hex}" }
    }
  }`);
    } else {
      lines.push(`  "color": {
    "${name}": { "value": "${hex}" }
  }`);
    }
  }
  return `{\n${lines.join(',\n')}\n}`;
}

/** Format labels for the export dialog. */
export const TOKEN_FORMAT_LABELS: Record<TokenFormat, string> = {
  css: 'CSS Custom Properties',
  tailwind: 'Tailwind Config',
  scss: 'SCSS Variables',
  less: 'LESS Variables',
  'style-dictionary': 'Style Dictionary',
};
