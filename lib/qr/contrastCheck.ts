/**
 * QR Studio — Contrast check for accessibility.
 *
 * Checks the contrast ratio between QR foreground and background colors
 * to warn if colors may be hard to scan / read.
 */

export interface ContrastResult {
  ratio: number;
  passAA: boolean;  // WCAG AA (4.5:1 for normal text)
  passAAA: boolean; // WCAG AAA (7:1 for normal text)
  score: 'excellent' | 'good' | 'fair' | 'poor';
  suggestion?: string;
}

/**
 * Calculate relative luminance per WCAG 2.1.
 */
export function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculate contrast ratio between two hex colors.
 */
export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check QR code contrast and return a11y result.
 */
export function checkQRContrast(
  foreground: string,
  background: string,
): ContrastResult {
  const ratio = contrastRatio(foreground, background);

  let suggestion: string | undefined;
  if (ratio < 3) {
    suggestion = 'QR code colors have very low contrast — it may be hard to scan. Use dark patterns on light backgrounds.';
  } else if (ratio < 4.5) {
    suggestion = 'QR code contrast is acceptable but low. Consider darkening the pattern color or lightening the background.';
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    passAA: ratio >= 4.5,
    passAAA: ratio >= 7,
    score: ratio >= 7 ? 'excellent' : ratio >= 4.5 ? 'good' : ratio >= 3 ? 'fair' : 'poor',
    suggestion,
  };
}

/**
 * Determine if a color is light or dark.
 */
export function isLightColor(hex: string): boolean {
  return relativeLuminance(hex) > 0.5;
}

/**
 * Get recommended text color for a given background.
 */
export function recommendedTextColor(background: string): '#000000' | '#ffffff' {
  return isLightColor(background) ? '#000000' : '#ffffff';
}
