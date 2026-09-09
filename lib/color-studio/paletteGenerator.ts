/**
 * Palette Generator — extended generation utilities.
 *
 * Provides styled palette generation (using PaletteStyle modifiers),
 * palette mutation, evolution, and rating/metrics.
 */

import type { HSL, ColorPalette, HarmonyType } from './types';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, rgbToOklch } from './converters';
import { generateHarmony, HARMONY_GENERATORS } from './harmonies';
import { contrastRatio } from './contrast';
import type { StyleModifiers } from './themeBuilder';
import { PALETTE_STYLES, type PaletteStyle } from './paletteStyles';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface PaletteRating {
  harmony: number;       // 0–100
  contrast: number;      // 0–100
  accessibility: number; // 0–100
  visualBalance: number; // 0–100
  temperature: number;   // -1 (cold) to +1 (warm)
  saturation: number;    // 0–100
  brightness: number;    // 0–100
  overall: number;       // 0–100 composite
}

export interface PaletteGenerationOptions {
  style?: PaletteStyle;
  harmonyType?: HarmonyType;
  lockedIndices?: Set<number>;
  temperature?: number;    // -1 to +1
  saturationBias?: number; // -1 to +1
  brightnessBias?: number; // -1 to +1
  count?: number;
}

/* ─── Styled palette generation ──────────────────────────────────────────────── */

/**
 * Generate a palette constrained by a palette style's modifiers.
 * Uses HSL generation with the style's temperature, saturation, contrast settings.
 */
export function generateStyledPalette(
  seedHex: string,
  options: PaletteGenerationOptions = {},
): ColorPalette {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return { name: 'Invalid', colors: [seedHex] };

  const hsl = rgbToHsl(rgb);
  const count = options.count ?? 5;
  const style = options.style;
  const mods = style?.modifiers;

  const colors: string[] = [];

  if (options.harmonyType) {
    // Generate using harmony rule, then apply style adjustments
    const baseHues = HARMONY_GENERATORS[options.harmonyType](hsl).map(h => {
      const hrgb = hexToRgb(h);
      return hrgb ? rgbToHsl(hrgb) : hsl;
    });

    colors.push(...baseHues.slice(0, count).map(h => rgbToHex(hslToRgb(h))));

    // If we have fewer than count, fill with variations
    while (colors.length < count) {
      const src = colors[colors.length % baseHues.length];
      const srgb = hexToRgb(src);
      if (srgb) {
        const shsl = rgbToHsl(srgb);
        colors.push(rgbToHex(hslToRgb({
          h: (shsl.h + 0.05) % 1,
          s: Math.min(1, shsl.s + (Math.random() - 0.5) * 0.2),
          l: Math.min(1, shsl.l + (Math.random() - 0.5) * 0.1),
        })));
      }
    }

    return finalizePalette(colors, seedHex, mods, options);
  }

  // Free-form styled generation
  const baseHue = hsl.h;
  const baseSat = hsl.s;
  const baseLit = hsl.l;

  // Apply style modifiers to generation parameters
  const tempOffset = (mods?.temperature ?? 0) * 30; // degrees
  const satMul = (mods?.saturation ?? 1);
  const contrastMul = (mods?.contrast ?? 1);
  const brightOff = (mods?.brightness ?? 0);

  // Additional user biases
  const userTempOff = (options.temperature ?? 0) * 30;
  const userSatMul = 1 + (options.saturationBias ?? 0) * 0.5;
  const userBrightOff = (options.brightnessBias ?? 0) * 0.15;

  const finalTempOffset = tempOffset + userTempOff;
  const finalSatMul = satMul * userSatMul;
  const finalBrightOff = brightOff + userBrightOff;

  // Generate colors using golden-angle spacing + modifiers
  const goldenAngle = 0.618033988749895;
  const locked = options.lockedIndices ?? new Set<number>();

  for (let i = 0; i < count; i++) {
    if (locked.has(i) && colors[i]) continue;

    const hue = (baseHue + goldenAngle * i * 360 + finalTempOffset) / 360 % 1;
    const sat = Math.min(1, Math.max(0.05, baseSat * (0.7 + Math.random() * 0.3) * finalSatMul));
    const lightness = Math.min(0.95, Math.max(0.05,
      (baseLit + (i / (count - 1 || 1) - 0.5) * 0.3 * contrastMul + finalBrightOff)
    ));

    const hslColor: HSL = {
      h: (hue + 1) % 1,
      s: sat,
      l: lightness,
    };

    colors[i] = rgbToHex(hslToRgb(hslColor));
  }

  return finalizePalette(colors, seedHex, mods, options);
}

function finalizePalette(
  colors: string[],
  seedHex: string,
  mods?: StyleModifiers,
  options?: PaletteGenerationOptions,
): ColorPalette {
  // Ensure count
  const count = options?.count ?? 5;
  while (colors.length < count) {
    colors.push(rgbToHex(hslToRgb({
      h: Math.random(),
      s: 0.5 + Math.random() * 0.4,
      l: 0.3 + Math.random() * 0.5,
    })));
  }

  const styleName = options?.style?.name ?? '';
  const harmonyName = options?.harmonyType ? ` ${options.harmonyType}` : '';
  return {
    name: styleName ? `${styleName}${harmonyName} Palette` : `Palette from ${seedHex}`,
    colors: colors.slice(0, count),
  };
}

/* ─── Palette Mutation ───────────────────────────────────────────────────────── */

/**
 * Slightly mutate a palette — shift hues, saturations, and lightnesses
 * while preserving the overall style/character.
 */
export function mutatePalette(colors: string[], intensity = 0.15): string[] {
  return colors.map((hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb);

    return rgbToHex(hslToRgb({
      h: (hsl.h + (Math.random() - 0.5) * intensity * 0.15 + 1) % 1,
      s: Math.min(1, Math.max(0.02, hsl.s + (Math.random() - 0.5) * intensity * 0.3)),
      l: Math.min(0.95, Math.max(0.05, hsl.l + (Math.random() - 0.5) * intensity * 0.2)),
    }));
  });
}

/* ─── Palette Evolution ──────────────────────────────────────────────────────── */

/**
 * Evolve a palette by making a minimal change from the previous state.
 * Each evolution step produces a palette very similar to the previous one.
 */
export function evolvePalette(
  colors: string[],
  step: number,
  totalSteps: number,
): string[] {
  // Each step drifts hues slightly in one direction
  const drift = (step / Math.max(1, totalSteps)) * 0.04; // max 4% hue drift
  const noise = 0.02; // very small random noise

  return colors.map((hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const hsl = rgbToHsl(rgb);

    return rgbToHex(hslToRgb({
      h: (hsl.h + drift + (Math.random() - 0.5) * noise + 1) % 1,
      s: Math.min(1, Math.max(0.02, hsl.s + (Math.random() - 0.5) * noise)),
      l: Math.min(0.95, Math.max(0.05, hsl.l + (Math.random() - 0.5) * noise)),
    }));
  });
}

/* ─── Palette Rating ─────────────────────────────────────────────────────────── */

/**
 * Compute a comprehensive rating for a color palette.
 */
export function ratePalette(colors: string[]): PaletteRating {
  if (colors.length < 2) {
    return {
      harmony: 50, contrast: 0, accessibility: 0,
      visualBalance: 50, temperature: 0, saturation: 0,
      brightness: 50, overall: 30,
    };
  }

  const hslColors = colors
    .map(hexToRgb)
    .filter((rgb): rgb is { r: number; g: number; b: number } => rgb !== null)
    .map(rgbToHsl);

  if (hslColors.length < 2) {
    return {
      harmony: 50, contrast: 0, accessibility: 0,
      visualBalance: 50, temperature: 0, saturation: 0,
      brightness: 50, overall: 30,
    };
  }

  // ── Harmony score ──
  // Check hue dispersion — well-spaced hues score higher
  const hues = hslColors.map(c => c.h * 360);
  const sortedHues = [...hues].sort((a, b) => a - b);
  let totalGap = 0;
  for (let i = 1; i < sortedHues.length; i++) {
    totalGap += sortedHues[i] - sortedHues[i - 1];
  }
  totalGap += 360 - sortedHues[sortedHues.length - 1] + sortedHues[0];
  const avgGap = totalGap / sortedHues.length;
  // Ideal gap ~ 60° (for 6 colors, nicely spread)
  const idealGap = 360 / sortedHues.length;
  const gapDiff = Math.abs(avgGap - idealGap);
  const harmony = Math.round(Math.max(0, Math.min(100, 100 - (gapDiff / 180) * 100)));

  // ── Contrast score ──
  // Average WCAG contrast between adjacent colors in the palette
  let totalRatio = 0;
  let ratioCount = 0;
  for (let i = 0; i < colors.length; i++) {
    const next = (i + 1) % colors.length;
    const r1 = hexToRgb(colors[i]);
    const r2 = hexToRgb(colors[next]);
    if (r1 && r2) {
      const r = contrastRatio(r1, r2);
      totalRatio += Math.min(21, r);
      ratioCount++;
    }
  }
  const avgRatio = ratioCount > 0 ? totalRatio / ratioCount : 0;
  const contrast = Math.round(Math.min(100, (avgRatio / 21) * 100));

  // ── Accessibility score ──
  // How many color pairs pass WCAG AA
  let passed = 0;
  let pairs = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const r1 = hexToRgb(colors[i]);
      const r2 = hexToRgb(colors[j]);
      if (r1 && r2) {
        const r = contrastRatio(r1, r2);
        if (r >= 4.5) passed++;
        pairs++;
      }
    }
  }
  const accessibility = pairs > 0 ? Math.round((passed / pairs) * 100) : 0;

  // ── Visual balance ──
  // How evenly distributed are the lightness values
  const lightnesses = hslColors.map(c => c.l);
  const mean = lightnesses.reduce((a, b) => a + b, 0) / lightnesses.length;
  const variance = lightnesses.reduce((a, b) => a + (b - mean) ** 2, 0) / lightnesses.length;
  // Low variance = balanced, high = unbalanced
  const visualBalance = Math.round(Math.max(0, Math.min(100, 100 - variance * 100)));

  // ── Temperature (−1 cold, +1 warm) ──
  const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
  const temperature = avgHue > 30 && avgHue < 150
    ? ((avgHue - 90) / 60) * 0.5 + 0.5 // greens/yellows = warm
    : avgHue >= 150 && avgHue < 270
      ? -((avgHue - 210) / 60) * 0.5 - 0.5 // blues/cyans = cold
      : avgHue >= 270 || avgHue < 30
        ? 1 - Math.abs(avgHue - 330) / 60 // reds/purples = warm
        : 0;
  const tempNormalized = Math.max(-1, Math.min(1, temperature));

  // ── Saturation (0–100%) ──
  const avgSat = hslColors.reduce((a, c) => a + c.s, 0) / hslColors.length;
  const saturation = Math.round(avgSat * 100);

  // ── Brightness (0–100%) ──
  const avgLit = hslColors.reduce((a, c) => a + c.l, 0) / hslColors.length;
  const brightness = Math.round(avgLit * 100);

  // ── Overall composite ──
  const overall = Math.round(
    harmony * 0.2 +
    contrast * 0.15 +
    accessibility * 0.2 +
    visualBalance * 0.15 +
    (100 - Math.abs(saturation - 50)) * 0.1 + // moderate saturation is better
    (brightness > 30 && brightness < 80 ? 100 : 50) * 0.1 +
    (saturation > 20 ? 100 : 40) * 0.1
  );

  return {
    harmony,
    contrast,
    accessibility,
    visualBalance,
    temperature: Math.round(tempNormalized * 100) / 100,
    saturation,
    brightness,
    overall: Math.max(0, Math.min(100, overall)),
  };
}

/* ─── Preset-style palette generation ────────────────────────────────────────── */

/**
 * Generate a palette using one of the 28 named palette styles.
 * Returns both the palette and the style used.
 */
export function generatePaletteByStyle(
  seedHex: string,
  styleId: string,
  options?: Omit<PaletteGenerationOptions, 'style'>,
): { palette: ColorPalette; style: PaletteStyle | undefined } {
  const style = PALETTE_STYLES.find(s => s.id === styleId);
  const palette = generateStyledPalette(seedHex, { ...options, style });
  return { palette, style };
}

/**
 * Generate a palette by harmony rule with optional style overlay.
 */
export function generatePaletteByHarmony(
  seedHex: string,
  harmonyType: HarmonyType,
  styleId?: string,
): ColorPalette {
  const style = styleId ? PALETTE_STYLES.find(s => s.id === styleId) : undefined;
  return generateStyledPalette(seedHex, { harmonyType, style });
}
