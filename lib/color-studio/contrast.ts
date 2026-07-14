/**
 * WCAG contrast utilities.
 *
 * Implements WCAG 2.1 relative luminance and contrast ratio calculations
 * per https://www.w3.org/TR/WCAG21/#contrast-minimum.
 */

import type { RGB, WCAGLevel } from './types';

/**
 * Relative luminance of an sRGB color.
 *
 * Per WCAG 2.1 definition:
 *   L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where each channel is linearized.
 */
export function relativeLuminance({ r, g, b }: RGB): number {
  const linearize = (c: number): number => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * WCAG contrast ratio between two colors.
 *
 * Ratio = (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the lighter luminance and L2 the darker.
 * Range: 1:1 (identical) to 21:1 (black on white).
 */
export function contrastRatio(a: RGB, b: RGB): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Minimum ratios per WCAG level. */
const WCAG_THRESHOLDS: Record<WCAGLevel, number> = {
  'AA': 4.5,
  'AA-large': 3.0,
  'AAA': 7.0,
  'fail': 0,
};

/**
 * Determine WCAG level for a given contrast ratio.
 *
 * Returns the level, or 'fail' if it does not meet AA-large.
 */
export function getWCAGLevel(ratio: number, largeText = false): WCAGLevel {
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (largeText && ratio >= 3.0) return 'AA-large';
  return 'fail';
}

/**
 * Check whether a text color passes WCAG on a background.
 *
 * @param text — foreground RGB
 * @param bg — background RGB
 * @param level — target conformance level
 * @param largeText — whether text is ≥18pt or ≥14pt bold
 */
export function passesWCAG(
  text: RGB,
  bg: RGB,
  level: WCAGLevel = 'AA',
  largeText = false,
): boolean {
  const ratio = contrastRatio(text, bg);
  if (level === 'AAA') return ratio >= 7.0;
  if (level === 'AA') return ratio >= 4.5;
  if (level === 'AA-large') return largeText ? ratio >= 3.0 : ratio >= 4.5;
  return false;
}

/**
 * Suggest the best accessible text color (black or white) for a background.
 */
export function accessibleTextColor(bg: RGB): RGB {
  const white: RGB = { r: 255, g: 255, b: 255 };
  const black: RGB = { r: 0, g: 0, b: 0 };
  return contrastRatio(white, bg) >= contrastRatio(black, bg) ? white : black;
}
