/**
 * Theme Builder — complete design system generation from a primary color.
 *
 * Given a primary color hex, generates:
 *   - 11-step color scales (50-950) for primary, secondary, accent, neutral
 *   - Semantic colors (success, warning, danger, info)
 *   - Light & dark theme tokens (background, surface, card, border, text, etc.)
 *   - WCAG auto-fix for text/background contrast
 *   - Design system scoring
 *
 * All scale generation uses OKLCH interpolation for perceptual uniformity,
 * following the same principles as Tailwind, Radix, and Material Design.
 */

import type { RGB, OKLCH } from './types';
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
} from './converters';
import { contrastRatio } from './contrast';

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface ThemeTokens {
  background: string;
  surface: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  foreground: string;
  placeholder: string;
  hover: string;
  active: string;
  disabled: string;
  focusRing: string;
}

export interface DesignSystem {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  accent: Record<string, string>;
  neutral: Record<string, string>;
  success: string;
  warning: string;
  danger: string;
  info: string;
  light: ThemeTokens;
  dark: ThemeTokens;
  score: DesignSystemScore;
}

export interface DesignSystemScore {
  accessibility: number;
  contrastLevel: 'AAA' | 'AA' | 'AA-large' | 'fail';
  visualBalance: number;
  brandConsistency: number;
  readability: number;
  developerReady: number;
}

export interface ThemeBuilderOptions {
  /** Palette style modifiers */
  style?: StyleModifiers;
  /** Project preset adjustments */
  project?: ProjectAdjustments;
  /** Brand personality modifiers */
  personality?: PersonalityModifiers;
}

export interface StyleModifiers {
  temperature: number;     // -1 (cold) to +1 (warm)
  saturation: number;      // 0.0–2.0 chroma multiplier
  contrast: number;        // 0.0–2.0 lightness range multiplier
  brightness: number;      // -0.3–0.3 overall lightness offset
  neutralWarmth: number;   // -1 to +1 neutral hue shift from gray
  curve: 'linear' | 'ease-in' | 'ease-out' | 's-curve';
}

export interface ProjectAdjustments {
  contrastBoost: number;    // 0.0–0.3 extra contrast
  saturationMod: number;    // 0.0–2.0 saturation modifier
  temperatureOffset: number;// -0.5–0.5 hue temperature shift
  surfaceDarkness: number;  // -0.1–0.1 light theme surface darkness
  accentStrength: number;   // 0.0–2.0 accent chroma multiplier
}

export interface PersonalityModifiers {
  chromaScale: number;      // 0.5–1.5 overall chroma adjustment
  warmthBias: number;       // -0.3–0.3 hue rotation toward warm/cool
  lightnessSpread: number;  // 0.8–1.2 lightness range adjustment
  saturationBias: number;   // -0.3–0.3 saturation curve shift
}

/* ── Scale configuration ──────────────────────────────────────────────────── */

interface ScaleStep {
  label: string;
  luminance: number;
  chromaFactor: number; // relative to peak chroma
}

const SCALE_STEPS: ScaleStep[] = [
  { label: '50',  luminance: 0.97, chromaFactor: 0.08 },
  { label: '100', luminance: 0.93, chromaFactor: 0.15 },
  { label: '200', luminance: 0.86, chromaFactor: 0.30 },
  { label: '300', luminance: 0.76, chromaFactor: 0.55 },
  { label: '400', luminance: 0.64, chromaFactor: 0.80 },
  { label: '500', luminance: 0.52, chromaFactor: 1.00 },
  { label: '600', luminance: 0.40, chromaFactor: 0.90 },
  { label: '700', luminance: 0.30, chromaFactor: 0.70 },
  { label: '800', luminance: 0.20, chromaFactor: 0.50 },
  { label: '900', luminance: 0.12, chromaFactor: 0.30 },
  { label: '950', luminance: 0.05, chromaFactor: 0.10 },
];

/* ─── Scale generation ────────────────────────────────────────────────────── */

/**
 * Apply a brightness curve to interpolate luminance values.
 */
function applyCurve(t: number, curve: StyleModifiers['curve']): number {
  switch (curve) {
    case 'ease-in':
      return t * t;
    case 'ease-out':
      return t * (2 - t);
    case 's-curve':
      return t * t * (3 - 2 * t); // smoothstep
    case 'linear':
    default:
      return t;
  }
}

/**
 * Generate an 11-step color scale (50-950) from a base OKLCH color.
 * Applies style modifiers to the scale parameters.
 */
export function generateScale(
  baseOklch: OKLCH,
  options?: {
    chromaMultiplier?: number;
    hueOffset?: number;
    modifiers?: StyleModifiers;
  },
): Record<string, string> {
  const chromaMul = options?.chromaMultiplier ?? 1;
  const hueOffset = options?.hueOffset ?? 0;
  const mods = options?.modifiers;

  const baseHue = (baseOklch.h + hueOffset + (mods?.temperature ?? 0) * 15 + 360) % 360;
  const baseChroma = baseOklch.c * chromaMul * (mods?.saturation ?? 1);
  const contrastMul = mods?.contrast ?? 1;
  const brightnessOff = mods?.brightness ?? 0;

  const steps: Record<string, string> = {};

  for (const step of SCALE_STEPS) {
    // Apply contrast: stretch luminance range
    const mid = 0.5;
    let t = (step.luminance - mid) * contrastMul + mid;
    t = Math.max(0.03, Math.min(0.97, t));

    // Apply brightness offset
    t = Math.max(0.03, Math.min(0.97, t + brightnessOff));

    // Apply curve
    const curveT = applyCurve((t - 0.03) / 0.94, mods?.curve ?? 'linear');
    const luminance = 0.03 + curveT * 0.94;

    // Compute chroma: peak at 500, taper at edges
    const distanceFromMid = Math.abs(step.luminance - SCALE_STEPS[5].luminance) / 0.5;
    const chromaFalloff = 1 - distanceFromMid * 0.7;
    const chroma = baseChroma * step.chromaFactor * Math.max(0.05, chromaFalloff);

    // For neutrals, optionally add a slight hue warmth
    const hue = mods?.neutralWarmth
      ? baseHue + mods.neutralWarmth * 20
      : baseHue;

    const oklch: OKLCH = {
      l: luminance,
      c: Math.max(0.001, chroma),
      h: hue,
    };

    steps[step.label] = rgbToHex(oklchToRgb(oklch));
  }

  return steps;
}

/**
 * Generate a neutral (achromatic) scale — zero chroma, slight hue warmth.
 */
export function generateNeutralScale(
  modifiers?: StyleModifiers,
): Record<string, string> {
  const warmthHue = modifiers?.neutralWarmth ?? 0;

  const steps: Record<string, string> = {};

  for (const step of SCALE_STEPS) {
    const contrastMul = modifiers?.contrast ?? 1;
    const mid = 0.5;
    let t = (step.luminance - mid) * contrastMul + mid;
    t = Math.max(0.03, Math.min(0.97, t));

    const luminance = 0.03 + applyCurve((t - 0.03) / 0.94, modifiers?.curve ?? 'linear') * 0.94;

    // Very slight warmth if desired
    const oklch: OKLCH = {
      l: luminance,
      c: Math.max(0.001, Math.abs(warmthHue) * 0.008),
      h: warmthHue > 0 ? 50 : 220, // warm (yellow) or cool (blue)
    };

    steps[step.label] = rgbToHex(oklchToRgb(oklch));
  }

  return steps;
}

/* ─── Semantic colors ─────────────────────────────────────────────────────── */

interface SemanticColorConfig {
  hue: number;
  chroma: number;
  luminance: number;
}

const SEMANTIC_CONFIGS: Record<string, SemanticColorConfig> = {
  success: { hue: 140, chroma: 0.13, luminance: 0.50 },
  warning: { hue: 50,  chroma: 0.12, luminance: 0.55 },
  danger:  { hue: 10,  chroma: 0.15, luminance: 0.50 },
  info:    { hue: 210, chroma: 0.12, luminance: 0.50 },
};

function generateSemanticColor(config: SemanticColorConfig): string {
  const oklch: OKLCH = {
    l: config.luminance,
    c: config.chroma,
    h: config.hue,
  };
  return rgbToHex(oklchToRgb(oklch));
}

export function generateSemanticColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const [name, config] of Object.entries(SEMANTIC_CONFIGS)) {
    colors[name] = generateSemanticColor(config);
  }
  return colors;
}

/* ─── Theme tokens ────────────────────────────────────────────────────────── */

/**
 * Generate light theme tokens from neutral and primary scales.
 */
export function generateLightTheme(
  neutral: Record<string, string>,
  primary: Record<string, string>,
): ThemeTokens {
  return {
    background:   neutral['50'],
    surface:      neutral['100'],
    card:         neutral['50'],
    border:       neutral['200'],
    text:         neutral['900'],
    muted:        neutral['500'],
    foreground:   neutral['700'],
    placeholder:  neutral['400'],
    hover:        neutral['100'],
    active:       neutral['200'],
    disabled:     neutral['200'],
    focusRing:    primary['500'],
  };
}

/**
 * Generate dark theme tokens from neutral and primary scales.
 */
export function generateDarkTheme(
  neutral: Record<string, string>,
  primary: Record<string, string>,
): ThemeTokens {
  return {
    background:   neutral['950'],
    surface:      neutral['900'],
    card:         neutral['900'],
    border:       neutral['800'],
    text:         neutral['50'],
    muted:        neutral['400'],
    foreground:   neutral['200'],
    placeholder:  neutral['500'],
    hover:        neutral['800'],
    active:       neutral['700'],
    disabled:     neutral['700'],
    focusRing:    primary['400'],
  };
}

/* ─── WCAG auto-fix ───────────────────────────────────────────────────────── */

/**
 * Adjust a color's lightness until it meets the minimum contrast ratio
 * against a background color. Tries both lightening and darkening.
 */
function ensureContrast(
  foreground: string,
  background: string,
  minRatio = 4.5,
): string {
  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  if (!fgRgb || !bgRgb) return foreground;

  let ratio = contrastRatio(fgRgb, bgRgb);
  if (ratio >= minRatio) return foreground;

  // Try to fix by adjusting lightness in OKLCH
  const fgOklch = rgbToOklch(fgRgb);
  const bgLuminance = rgbToOklch(bgRgb).l;

  // Determine direction: if fg is lighter than bg, we can go lighter or darker
  let bestColor = foreground;
  let bestRatio = ratio;

  // Try darkening (reduce luminance)
  for (let l = fgOklch.l - 0.05; l >= 0.05; l -= 0.05) {
    const test: OKLCH = { ...fgOklch, l };
    const hex = rgbToHex(oklchToRgb(test));
    const testRgb = hexToRgb(hex)!;
    const r = contrastRatio(testRgb, bgRgb);
    if (r > bestRatio) {
      bestRatio = r;
      bestColor = hex;
      if (r >= minRatio) return hex;
    }
  }

  // Try lightening (increase luminance)
  for (let l = fgOklch.l + 0.05; l <= 0.95; l += 0.05) {
    const test: OKLCH = { ...fgOklch, l };
    const hex = rgbToHex(oklchToRgb(test));
    const testRgb = hexToRgb(hex)!;
    const r = contrastRatio(testRgb, bgRgb);
    if (r > bestRatio) {
      bestRatio = r;
      bestColor = hex;
      if (r >= minRatio) return hex;
    }
  }

  return bestColor;
}

/**
 * Run WCAG auto-fix on all text/background token pairs.
 */
export function applyWCAGFix(theme: ThemeTokens, bgKey: keyof ThemeTokens): ThemeTokens {
  const bg = theme[bgKey];
  return {
    ...theme,
    text:        ensureContrast(theme.text, bg),
    muted:       ensureContrast(theme.muted, bg, 3.0), // AA-large for muted
    foreground:  ensureContrast(theme.foreground, bg),
    placeholder: ensureContrast(theme.placeholder, bg, 3.0),
  };
}

/* ─── Scoring ─────────────────────────────────────────────────────────────── */

function computeScore(ds: DesignSystem): DesignSystemScore {
  // Count WCAG passes across critical pairs
  const pairs = [
    { fg: ds.light.text, bg: ds.light.background },
    { fg: ds.light.text, bg: ds.light.card },
    { fg: ds.light.foreground, bg: ds.light.surface },
    { fg: ds.light.muted, bg: ds.light.background },
    { fg: ds.dark.text, bg: ds.dark.background },
    { fg: ds.dark.text, bg: ds.dark.card },
    { fg: ds.dark.foreground, bg: ds.dark.surface },
    { fg: ds.dark.muted, bg: ds.dark.background },
  ];

  let passed = 0;
  let minRatio = 21;
  for (const { fg, bg } of pairs) {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (fgRgb && bgRgb) {
      const r = contrastRatio(fgRgb, bgRgb);
      minRatio = Math.min(minRatio, r);
      if (r >= 4.5) passed++;
    }
  }

  const accessibility = Math.round((passed / pairs.length) * 100);

  let contrastLevel: DesignSystemScore['contrastLevel'] = 'fail';
  if (minRatio >= 7) contrastLevel = 'AAA';
  else if (minRatio >= 4.5) contrastLevel = 'AA';
  else if (minRatio >= 3) contrastLevel = 'AA-large';

  // Visual balance: how well-distributed are the lightness values?
  const allLightness = [
    ...Object.values(ds.primary),
    ...Object.values(ds.secondary),
    ...Object.values(ds.neutral),
  ].map(h => {
    const rgb = hexToRgb(h);
    return rgb ? rgbToOklch(rgb).l : 0.5;
  });
  const mean = allLightness.reduce((a, b) => a + b, 0) / allLightness.length;
  const variance = allLightness.reduce((a, b) => a + (b - mean) ** 2, 0) / allLightness.length;
  const visualBalance = Math.round(Math.min(100, variance * 400));

  // Brand consistency: how close are secondary/accent hues to primary?
  const primaryHues = Object.values(ds.primary).map(h => {
    const rgb = hexToRgb(h);
    return rgb ? rgbToOklch(rgb).h : 0;
  });
  const avgPrimaryHue = primaryHues.reduce((a, b) => a + b, 0) / primaryHues.length;

  const secondaryHues = Object.values(ds.secondary).map(h => {
    const rgb = hexToRgb(h);
    return rgb ? rgbToOklch(rgb).h : 0;
  });
  const avgSecondaryHue = secondaryHues.reduce((a, b) => a + b, 0) / secondaryHues.length;

  // Expected secondary offset: ~30°
  const hueDiff = Math.abs(avgSecondaryHue - avgPrimaryHue);
  const expectedDiff = 30;
  const consistencyScore = Math.round(Math.min(100, (1 - Math.abs(hueDiff - expectedDiff) / 180) * 100));
  const brandConsistency = Math.max(0, consistencyScore);

  // Readability: average contrast of text pairs
  let totalRatio = 0;
  let ratioCount = 0;
  for (const { fg, bg } of pairs) {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (fgRgb && bgRgb) {
      totalRatio += Math.min(21, contrastRatio(fgRgb, bgRgb));
      ratioCount++;
    }
  }
  const avgRatio = ratioCount > 0 ? totalRatio / ratioCount : 0;
  const readability = Math.round(Math.min(100, (avgRatio / 21) * 100));

  // Developer ready: always 100 (we always generate all tokens)
  const developerReady = 100;

  return {
    accessibility,
    contrastLevel,
    visualBalance,
    brandConsistency,
    readability,
    developerReady,
  };
}

/* ─── Main generator ──────────────────────────────────────────────────────── */

/**
 * Generate a complete design system from a primary color hex.
 */
export function generateDesignSystem(
  primaryHex: string,
  options: ThemeBuilderOptions = {},
): DesignSystem {
  const rgb = hexToRgb(primaryHex);
  if (!rgb) {
    // Return default indigo theme on invalid input
    return generateDesignSystem('#4F46E5', options);
  }

  const baseOklch = rgbToOklch(rgb);
  const mods = options.style;

  // Generate scales
  const primary = generateScale(baseOklch, { modifiers: mods });
  const secondary = generateScale(baseOklch, {
    chromaMultiplier: 0.8,
    hueOffset: 30,
    modifiers: mods,
  });
  const accent = generateScale(baseOklch, {
    chromaMultiplier: 0.7,
    hueOffset: 180,
    modifiers: mods,
  });
  const neutral = generateNeutralScale(mods);

  // Generate semantic colors
  const semantic = generateSemanticColors();

  // Apply project preset adjustments
  const projectAdjust = options.project;
  if (projectAdjust) {
    // Adjust semantic colors based on project type
    if (projectAdjust.saturationMod !== 1) {
      for (const key of Object.keys(semantic)) {
        const rgb = hexToRgb(semantic[key]);
        if (rgb) {
          const oklch = rgbToOklch(rgb);
          semantic[key] = rgbToHex(oklchToRgb({
            ...oklch,
            c: Math.max(0.01, oklch.c * projectAdjust.saturationMod),
          }));
        }
      }
    }
  }

  // Generate light and dark themes
  let light = generateLightTheme(neutral, primary);
  let dark = generateDarkTheme(neutral, primary);

  // Apply WCAG fix
  light = applyWCAGFix(light, 'background');
  dark = applyWCAGFix(dark, 'background');

  // Assemble design system
  const ds: DesignSystem = {
    primary,
    secondary,
    accent,
    neutral,
    success: semantic.success,
    warning: semantic.warning,
    danger: semantic.danger,
    info: semantic.info,
    light,
    dark,
    score: {
      accessibility: 0,
      contrastLevel: 'AA',
      visualBalance: 0,
      brandConsistency: 0,
      readability: 0,
      developerReady: 100,
    },
  };

  // Compute score
  ds.score = computeScore(ds);

  return ds;
}
