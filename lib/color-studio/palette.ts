/**
 * Palette generation.
 *
 * Generates color palettes from a seed color using various
 * strategies: harmony-based, shade/tint, temperature, etc.
 */

import type { HSL, ColorPalette } from './types';
import { rgbToHsl, hslToRgb, rgbToHex, hexToRgb } from './converters';
import { generateHarmony } from './harmonies';
import type { HarmonyType } from './types';

/** Generate a palette from a hex seed using a harmony algorithm. */
export function harmonyPalette(seedHex: string, type: HarmonyType, name?: string): ColorPalette {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return { name: name || 'Invalid', colors: [seedHex] };
  const hsl = rgbToHsl(rgb);
  const colors = generateHarmony(hsl, type);
  return { name: name || `${type} Palette`, colors };
}

/** Generate shades (dark → light) from a seed color. */
export function shadePalette(seedHex: string, steps = 9, name?: string): ColorPalette {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return { name: name || 'Invalid', colors: [seedHex] };
  const hsl = rgbToHsl(rgb);
  const colors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const lightness = Math.min(1, Math.max(0, 0.05 + (i / (steps - 1)) * 0.85));
    colors.push(
      rgbToHex(
        hslToRgb({
          h: hsl.h,
          s: hsl.s * (1 - Math.abs((i / (steps - 1)) - 0.5) * 0.4),
          l: lightness,
        }),
      ),
    );
  }
  return { name: name || `${seedHex} Shades`, colors };
}

/** Generate tints (seed + white mixes). */
export function tintPalette(seedHex: string, steps = 5, name?: string): ColorPalette {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return { name: name || 'Invalid', colors: [seedHex] };
  const colors: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = Math.round(rgb.r + (255 - rgb.r) * t);
    const g = Math.round(rgb.g + (255 - rgb.g) * t);
    const b = Math.round(rgb.b + (255 - rgb.b) * t);
    colors.push(rgbToHex({ r, g, b }));
  }
  return { name: name || `${seedHex} Tints`, colors };
}

/** Generate custom palette from array of hex colors. */
export function customPalette(colors: string[], name = 'Custom Palette'): ColorPalette {
  return { name, colors };
}
