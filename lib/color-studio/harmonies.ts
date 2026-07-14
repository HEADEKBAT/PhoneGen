/**
 * Color harmonies generator.
 *
 * Given a seed HSL color, each harmony function returns an array of
 * hex color strings that form a specific harmonic relationship.
 */

import type { HSL, HarmonyType } from './types';
import { hslToRgb, rgbToHex } from './converters';

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function harmonyHues(baseHue: number, offsets: number[]): number[] {
  return offsets.map((off) => normalizeHue(baseHue + off));
}

function buildPalette(base: HSL, hueList: number[], satMultiplier = 1, lightMultiplier = 1): HSL[] {
  return hueList.map((hue) => ({
    h: hue / 360,
    s: Math.min(1, Math.max(0, base.s * satMultiplier)),
    l: Math.min(1, Math.max(0, base.l * lightMultiplier)),
  }));
}

/* ─── Harmony generators ─────────────────────────────────────────────────── */

/** Complementary: 2 colors, 180° apart. */
export function complementary(base: HSL): string[] {
  const hues = harmonyHues(base.h * 360, [0, 180]);
  return buildPalette(base, hues).map(hslToHex);
}

/** Split-complementary: 3 colors — base + 150° and 210°. */
export function splitComplementary(base: HSL): string[] {
  const hues = harmonyHues(base.h * 360, [0, 150, 210]);
  return buildPalette(base, hues).map(hslToHex);
}

/** Analogous: 3–5 colors within 30° of base. */
export function analogous(base: HSL, count = 3): string[] {
  const step = 360 / count;
  const start = base.h * 360 - (step * (count - 1)) / 2;
  const hues = Array.from({ length: count }, (_, i) => normalizeHue(start + step * i));
  const satAdjust = 1 - (count - 1) * 0.05;
  return buildPalette(base, hues, satAdjust).map(hslToHex);
}

/** Triadic: 3 colors, 120° apart. */
export function triadic(base: HSL): string[] {
  const hues = harmonyHues(base.h * 360, [0, 120, 240]);
  return buildPalette(base, hues).map(hslToHex);
}

/** Tetradic (rectangle): 4 colors, 60° offsets from base. */
export function tetradic(base: HSL): string[] {
  const hues = harmonyHues(base.h * 360, [0, 60, 180, 240]);
  return buildPalette(base, hues).map(hslToHex);
}

/** Square: 4 colors, 90° apart. */
export function square(base: HSL): string[] {
  const hues = harmonyHues(base.h * 360, [0, 90, 180, 270]);
  return buildPalette(base, hues).map(hslToHex);
}

/** Monochromatic: varying lightness/saturation at the same hue. */
export function monochromatic(base: HSL, count = 5): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0.5;
    const lightness = 0.1 + t * 0.7;
    const saturation = base.s * (1 - Math.abs(t - 0.5) * 0.6);
    result.push(
      hslToHex({
        h: base.h,
        s: Math.min(1, saturation),
        l: Math.min(1, lightness),
      }),
    );
  }
  return result;
}

/* ─── Lookup ─────────────────────────────────────────────────────────────── */

export const HARMONY_GENERATORS: Record<HarmonyType, (base: HSL) => string[]> = {
  complementary: (b) => complementary(b),
  'split-complementary': (b) => splitComplementary(b),
  analogous: (b) => analogous(b),
  triadic: (b) => triadic(b),
  tetradic: (b) => tetradic(b),
  square: (b) => square(b),
  monochromatic: (b) => monochromatic(b),
};

export const HARMONY_LABELS: Record<HarmonyType, string> = {
  complementary: 'Complementary',
  'split-complementary': 'Split Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  tetradic: 'Tetradic',
  square: 'Square',
  monochromatic: 'Monochromatic',
};

export function generateHarmony(base: HSL, type: HarmonyType): string[] {
  return HARMONY_GENERATORS[type](base);
}
