/**
 * Random color generation.
 *
 * Functions for generating single random colors or arrays of random
 * colors with optional constraints on hue, saturation, and lightness.
 */

import type { HSL, RGB, ColorPalette } from './types';
import { hslToRgb, rgbToHex } from './converters';

/** Generate a completely random HSL color. */
export function randomHSL(): HSL {
  return {
    h: Math.random(),
    s: 0.3 + Math.random() * 0.7,
    l: 0.2 + Math.random() * 0.6,
  };
}

/** Generate a random RGB color. */
export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

/** Generate a random hex color. */
export function randomHex(): string {
  return rgbToHex(randomRGB());
}

/**
 * Generate a random color constrained to a hue range.
 *
 * @param hueMin — hue 0–1 (default: 0)
 * @param hueMax — hue 0–1 (default: 1)
 * @param satMin — saturation 0–1 (default: 0.4)
 * @param satMax — saturation 0–1 (default: 1)
 * @param litMin — lightness 0–1 (default: 0.3)
 * @param litMax — lightness 0–1 (default: 0.8)
 */
export function randomConstrainedHSL(
  hueMin = 0,
  hueMax = 1,
  satMin = 0.4,
  satMax = 1,
  litMin = 0.3,
  litMax = 0.8,
): HSL {
  return {
    h: hueMin + Math.random() * (hueMax - hueMin),
    s: satMin + Math.random() * (satMax - satMin),
    l: litMin + Math.random() * (litMax - litMin),
  };
}

/** Generate a constrained random color as hex. */
export function randomConstrainedHex(
  hueMin?: number,
  hueMax?: number,
  satMin?: number,
  satMax?: number,
  litMin?: number,
  litMax?: number,
): string {
  return rgbToHex(hslToRgb(randomConstrainedHSL(hueMin, hueMax, satMin, satMax, litMin, litMax)));
}

/**
 * Generate N random colors that are visually distinct.
 *
 * Uses golden angle spacing on the hue wheel for maximum separation.
 */
export function randomDistinct(count: number, sat = 0.7, lit = 0.6): string[] {
  const goldenAngle = 0.618033988749895;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * goldenAngle) % 1;
    result.push(
      rgbToHex(
        hslToRgb({
          h: hue,
          s: sat,
          l: lit + (Math.random() - 0.5) * 0.2,
        }),
      ),
    );
  }
  return result;
}

/** Generate a random palette of N colors. */
export function randomPalette(count = 5, name = 'Random Palette'): ColorPalette {
  return {
    name,
    colors: Array.from({ length: count }, () => randomHex()),
  };
}
