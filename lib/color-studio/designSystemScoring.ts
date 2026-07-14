/**
 * Design System Scoring.
 *
 * Standalone scoring utilities that can be called independently
 * to evaluate and compare design systems or palettes.
 */

import type { RGB } from './types';
import { hexToRgb, rgbToOklch } from './converters';
import { contrastRatio } from './contrast';
import type { DesignSystem, DesignSystemScore, ThemeTokens } from './themeBuilder';

/* ── Pair scoring ─────────────────────────────────────────────────────────── */

interface ContrastPair {
  fg: string;
  bg: string;
  label: string;
}

const DEFAULT_PAIRS: ContrastPair[] = [
  { label: 'text on background',     fg: 'text', bg: 'background' },
  { label: 'text on card',           fg: 'text', bg: 'card' },
  { label: 'foreground on surface',  fg: 'foreground', bg: 'surface' },
  { label: 'muted on background',    fg: 'muted', bg: 'background' },
];

function buildPairs(theme: ThemeTokens): { fg: string; bg: string }[] {
  return DEFAULT_PAIRS.map((p) => ({
    fg: theme[p.fg as keyof ThemeTokens],
    bg: theme[p.bg as keyof ThemeTokens],
  }));
}

/**
 * Score a single design system's contrast pairs.
 */
export function scoreAccessibility(light: ThemeTokens, dark: ThemeTokens): {
  score: number;
  minRatio: number;
} {
  const allPairs = [...buildPairs(light), ...buildPairs(dark)];
  let passed = 0;
  let minRatio = 21;

  for (const { fg, bg } of allPairs) {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (fgRgb && bgRgb) {
      const r = contrastRatio(fgRgb, bgRgb);
      minRatio = Math.min(minRatio, r);
      if (r >= 4.5) passed++;
    }
  }

  return {
    score: Math.round((passed / allPairs.length) * 100),
    minRatio,
  };
}

/**
 * Compute visual balance based on lightness variance in color scales.
 */
export function scoreVisualBalance(ds: DesignSystem): number {
  const allLightness: number[] = [];

  for (const scale of [ds.primary, ds.secondary, ds.neutral]) {
    for (const hex of Object.values(scale)) {
      const rgb = hexToRgb(hex);
      if (rgb) allLightness.push(rgbToOklch(rgb).l);
    }
  }

  if (allLightness.length === 0) return 0;

  const mean = allLightness.reduce((a, b) => a + b, 0) / allLightness.length;
  const variance = allLightness.reduce((a, b) => a + (b - mean) ** 2, 0) / allLightness.length;

  return Math.round(Math.min(100, variance * 400));
}

/**
 * Score brand consistency — how well secondary and accent relate to primary.
 */
export function scoreBrandConsistency(ds: DesignSystem): number {
  const getAvgHue = (scale: Record<string, string>): number => {
    const hues = Object.values(scale)
      .map((h) => {
        const rgb = hexToRgb(h);
        return rgb ? rgbToOklch(rgb).h : null;
      })
      .filter((h): h is number => h !== null);
    return hues.reduce((a, b) => a + b, 0) / hues.length;
  };

  const primaryHue = getAvgHue(ds.primary);
  const secondaryHue = getAvgHue(ds.secondary);

  const diff = Math.abs(secondaryHue - primaryHue);
  const expected = 30; // expected ~30° offset
  const consistency = Math.round(Math.min(100, (1 - Math.abs(diff - expected) / 180) * 100));

  return Math.max(0, consistency);
}

/**
 * Score readability based on average contrast ratio across text pairs.
 */
export function scoreReadability(light: ThemeTokens, dark: ThemeTokens): number {
  const allPairs = [...buildPairs(light), ...buildPairs(dark)];
  let totalRatio = 0;
  let count = 0;

  for (const { fg, bg } of allPairs) {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (fgRgb && bgRgb) {
      totalRatio += Math.min(21, contrastRatio(fgRgb, bgRgb));
      count++;
    }
  }

  const avg = count > 0 ? totalRatio / count : 0;
  return Math.round(Math.min(100, (avg / 21) * 100));
}

/**
 * Full design system scoring — computes all 6 metrics.
 */
export function scoreDesignSystem(ds: DesignSystem): DesignSystemScore {
  const accessResult = scoreAccessibility(ds.light, ds.dark);

  let contrastLevel: DesignSystemScore['contrastLevel'] = 'fail';
  if (accessResult.minRatio >= 7) contrastLevel = 'AAA';
  else if (accessResult.minRatio >= 4.5) contrastLevel = 'AA';
  else if (accessResult.minRatio >= 3) contrastLevel = 'AA-large';

  return {
    accessibility: accessResult.score,
    contrastLevel,
    visualBalance: scoreVisualBalance(ds),
    brandConsistency: scoreBrandConsistency(ds),
    readability: scoreReadability(ds.light, ds.dark),
    developerReady: 100,
  };
}
