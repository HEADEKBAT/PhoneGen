/**
 * Gradient generation.
 *
 * Functions for creating CSS gradient strings and gradient definitions
 * from seed colors.
 */

import type { GradientStop, GradientDefinition, ColorPalette } from './types';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from './converters';

/** Create evenly-spaced gradient stops from an array of hex colors. */
export function evenlySpacedStops(colors: string[]): GradientStop[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) return [{ offset: 0, color: colors[0] }];
  return colors.map((color, i) => ({
    offset: i / (colors.length - 1),
    color,
  }));
}

/** Build a GradientDefinition from stops and type. */
export function createGradient(
  stops: GradientStop[],
  type: GradientDefinition['type'] = 'linear',
  angle = 90,
): GradientDefinition {
  return { type, angle, stops };
}

/** Format a gradient stop as a CSS color-stop string. */
function formatStop(s: GradientStop): string {
  const pct = Math.round(s.offset * 100);
  // If opacity is explicitly set and !== 1, convert to rgba()
  if (s.opacity !== undefined && s.opacity < 1) {
    const rgb = hexToRgb(s.color);
    if (rgb) {
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${s.opacity}) ${pct}%`;
    }
  }
  return `${s.color} ${pct}%`;
}

/** Build the radial-gradient sizing/position prefix. */
function radialPrefix(grad: GradientDefinition): string {
  const shape = grad.shape ?? 'circle';
  const size = grad.size ?? 'farthest-corner';
  let prefix = `${shape} ${size}`;
  if (grad.position) {
    prefix += ` at ${Math.round(grad.position.x * 100)}% ${Math.round(grad.position.y * 100)}%`;
  }
  return prefix;
}

/** Build the conic-gradient angle+position prefix. */
function conicPrefix(grad: GradientDefinition): string {
  let prefix = `from ${grad.angle}deg`;
  if (grad.position) {
    prefix += ` at ${Math.round(grad.position.x * 100)}% ${Math.round(grad.position.y * 100)}%`;
  }
  return prefix;
}

/** Render a gradient definition to a CSS gradient value. */
export function gradientToCSS(grad: GradientDefinition): string {
  const stopStr = grad.stops
    .sort((a, b) => a.offset - b.offset)
    .map(formatStop)
    .join(', ');

  switch (grad.type) {
    case 'linear':
      return `linear-gradient(${grad.angle}deg, ${stopStr})`;
    case 'repeating-linear':
      return `repeating-linear-gradient(${grad.angle}deg, ${stopStr})`;
    case 'radial':
      return `radial-gradient(${radialPrefix(grad)}, ${stopStr})`;
    case 'repeating-radial':
      return `repeating-radial-gradient(${radialPrefix(grad)}, ${stopStr})`;
    case 'conic':
      return `conic-gradient(${conicPrefix(grad)}, ${stopStr})`;
    default:
      return `linear-gradient(${grad.angle}deg, ${stopStr})`;
  }
}

/** Generate a gradient palette from a seed color (analogous spread). */
export function generateGradientPalette(seedHex: string, count = 5): ColorPalette {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return { name: 'Gradient Palette', colors: [seedHex] };
  const hsl = rgbToHsl(rgb);
  const spread = 40 / 360; // 40 degrees spread
  const start = hsl.h - spread / 2;
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const h = ((start + (i / (count - 1)) * spread) % 1 + 1) % 1;
    colors.push(
      rgbToHex(
        hslToRgb({ h, s: hsl.s, l: 0.3 + 0.4 * (1 - i / (count - 1)) }),
      ),
    );
  }
  return { name: 'Gradient Palette', colors };
}

/** Common gradient presets. */
export const GRADIENT_PRESETS: GradientDefinition[] = [
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }] },
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }] },
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#4facfe' }, { offset: 1, color: '#00f2fe' }] },
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#43e97b' }, { offset: 1, color: '#38f9d7' }] },
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#fa709a' }, { offset: 1, color: '#fee140' }] },
  { type: 'linear', angle: 135, stops: [{ offset: 0, color: '#a18cd1' }, { offset: 1, color: '#fbc2eb' }] },
];
