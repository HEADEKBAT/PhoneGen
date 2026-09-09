/**
 * Contrast Report — accessibility report, auto-fix, theme audit.
 *
 * Builds on contrast.ts to provide higher-level audit features:
 *   - Multi-pair accessibility reports
 *   - Auto-find accessible alternatives
 *   - Full theme audit (design system token pairs)
 *   - Component-specific contrast checks
 *   - Report export formats
 */

import type { RGB, WCAGLevel } from './types';
import { hexToRgb, rgbToHex, rgbToOklch, oklchToRgb } from './converters';
import { contrastRatio, getWCAGLevel, passesWCAG } from './contrast';
import type { OKLCH } from './types';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

export interface ContrastPair {
  label: string;
  foreground: string;
  background: string;
}

export interface ContrastResult {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  level: WCAGLevel;
  levelLarge: WCAGLevel;
  passesAA: boolean;
  passesAAA: boolean;
}

export interface AccessibilityReport {
  overallScore: number;     // 0–100
  pairs: ContrastResult[];
  passedAA: number;
  totalPairs: number;
  passedAAA: number;
  warnings: string[];
  errors: string[];
  suggestions: string[];
  minRatio: number;
  maxLevel: WCAGLevel;
}

export interface ThemeAuditResult {
  background: string;
  surface: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export type TextRole = 'heading' | 'body' | 'caption' | 'button' | 'code';
export type UIComponent = 'button' | 'card' | 'input' | 'navbar' | 'sidebar' | 'badge' | 'alert' | 'modal';

interface ComponentPair {
  component: UIComponent;
  label: string;
  foreground: string;
  background: string;
  largeText: boolean;
}

/* ─── Text role presets ─────────────────────────────────────────────────────── */

const TEXT_SIZES: Record<TextRole, { largeText: boolean; label: string }> = {
  heading: { largeText: true, label: 'Heading (≥18pt)' },
  body: { largeText: false, label: 'Body (≥14pt)' },
  caption: { largeText: false, label: 'Caption (≤12pt)' },
  button: { largeText: true, label: 'Button (≥14pt bold)' },
  code: { largeText: false, label: 'Code (monospace ≤13px)' },
};

/* ─── UI component presets ──────────────────────────────────────────────────── */

export function getComponentPairs(
  fg: string,
  bg: string,
): ComponentPair[] {
  return [
    { component: 'button', label: 'Button text on button bg', foreground: '#ffffff', background: fg, largeText: true },
    { component: 'card', label: 'Text on card background', foreground: fg, background: bg, largeText: false },
    { component: 'input', label: 'Input text on input bg', foreground: fg, background: '#f9fafb', largeText: false },
    { component: 'navbar', label: 'Nav text on navbar bg', foreground: fg, background: bg, largeText: true },
    { component: 'sidebar', label: 'Sidebar text on sidebar bg', foreground: fg, background: '#f3f4f6', largeText: false },
    { component: 'badge', label: 'Badge text on badge bg', foreground: '#ffffff', background: fg, largeText: true },
    { component: 'alert', label: 'Alert text on alert bg', foreground: fg, background: '#fef3c7', largeText: false },
    { component: 'modal', label: 'Modal text on overlay bg', foreground: fg, background: bg, largeText: false },
  ];
}

/* ─── Theme audit pairs ─────────────────────────────────────────────────────── */

export function getThemeAuditPairs(theme: ThemeAuditResult): ContrastPair[] {
  return [
    { label: 'text on background', foreground: theme.primary, background: theme.background },
    { label: 'text on surface', foreground: theme.primary, background: theme.surface },
    { label: 'text on card', foreground: theme.primary, background: theme.background },
    { label: 'muted on background', foreground: theme.muted, background: theme.background },
    { label: 'muted on surface', foreground: theme.muted, background: theme.surface },
    { label: 'border on background', foreground: theme.border, background: theme.background },
    { label: 'success text on bg', foreground: theme.success, background: theme.background },
    { label: 'warning text on bg', foreground: theme.warning, background: theme.background },
    { label: 'danger text on bg', foreground: theme.danger, background: theme.background },
    { label: 'info text on bg', foreground: theme.info, background: theme.background },
    { label: 'primary on bg (CTA)', foreground: theme.primary, background: theme.background },
    { label: 'accent on surface', foreground: theme.accent, background: theme.surface },
  ];
}

/* ─── Check single pair ─────────────────────────────────────────────────────── */

export function checkPair(pair: ContrastPair): ContrastResult {
  const fgRgb = hexToRgb(pair.foreground);
  const bgRgb = hexToRgb(pair.background);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;
  const level = getWCAGLevel(ratio, false);
  const levelLarge = getWCAGLevel(ratio, true);

  return {
    label: pair.label,
    foreground: pair.foreground,
    background: pair.background,
    ratio,
    level,
    levelLarge,
    passesAA: level === 'AA' || level === 'AAA',
    passesAAA: level === 'AAA',
  };
}

/* ─── Check text role ───────────────────────────────────────────────────────── */

export function checkTextRole(
  fg: string,
  bg: string,
  role: TextRole,
): ContrastResult {
  const config = TEXT_SIZES[role];
  const pair: ContrastPair = { label: config.label, foreground: fg, background: bg };
  const result = checkPair(pair);
  // Re-evaluate with correct largeText flag
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;
  const level = getWCAGLevel(ratio, config.largeText);
  return {
    ...result,
    level,
    passesAA: level === 'AA' || level === 'AAA',
    passesAAA: level === 'AAA',
  };
}

/* ─── Text role checks ──────────────────────────────────────────────────────── */

export function checkAllTextRoles(fg: string, bg: string): ContrastResult[] {
  const roles: TextRole[] = ['heading', 'body', 'caption', 'button', 'code'];
  return roles.map((role) => checkTextRole(fg, bg, role));
}

/* ─── UI Component checks ───────────────────────────────────────────────────── */

export function checkComponent(fg: string, bg: string, component: UIComponent): ContrastResult {
  const pairs = getComponentPairs(fg, bg);
  const pair = pairs.find(p => p.component === component);
  if (!pair) return checkPair({ label: component, foreground: fg, background: bg });
  const fgRgb = hexToRgb(pair.foreground);
  const bgRgb = hexToRgb(pair.background);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;
  const level = getWCAGLevel(ratio, pair.largeText);
  return {
    label: pair.label,
    foreground: pair.foreground,
    background: pair.background,
    ratio,
    level,
    levelLarge: getWCAGLevel(ratio, true),
    passesAA: level === 'AA' || level === 'AAA',
    passesAAA: level === 'AAA',
  };
}

export function checkAllComponents(fg: string, bg: string): ContrastResult[] {
  const components: UIComponent[] = ['button', 'card', 'input', 'navbar', 'sidebar', 'badge', 'alert', 'modal'];
  return components.map((c) => checkComponent(fg, bg, c));
}

/* ─── Full accessibility report ─────────────────────────────────────────────── */

export function generateReport(pairs: ContrastPair[]): AccessibilityReport {
  const results = pairs.map(checkPair);
  const passedAA = results.filter(r => r.passesAA).length;
  const passedAAA = results.filter(r => r.passesAAA).length;
  const totalPairs = results.length;

  const minRatio = Math.min(...results.map(r => r.ratio));
  const overallScore = totalPairs > 0
    ? Math.round((passedAA / totalPairs) * 100)
    : 0;

  let maxLevel: WCAGLevel = 'AAA';
  if (minRatio < 7) maxLevel = 'AA';
  if (minRatio < 4.5) maxLevel = 'AA-large';
  if (minRatio < 3) maxLevel = 'fail';

  const warnings: string[] = [];
  const errors: string[] = [];
  const suggestions: string[] = [];

  for (const r of results) {
    if (!r.passesAA && !r.passesAAA) {
      errors.push(`"${r.label}": ${r.ratio.toFixed(2)}:1 — fails WCAG AA`);
    } else if (!r.passesAAA) {
      warnings.push(`"${r.label}": ${r.ratio.toFixed(2)}:1 — passes AA but not AAA`);
    }
    if (r.ratio < 3) {
      suggestions.push(`Increase contrast for "${r.label}" — consider darkening the text or lightening the background`);
    }
  }

  if (overallScore >= 90) {
    suggestions.push('Excellent accessibility! Consider adding a "skip to content" link for keyboard users.');
  } else if (overallScore >= 70) {
    suggestions.push('Good accessibility. Review warnings for potential improvements.');
  } else {
    suggestions.push('Consider adjusting your color palette to improve text readability.');
  }

  return {
    overallScore,
    pairs: results,
    passedAA,
    totalPairs,
    passedAAA,
    warnings,
    errors,
    suggestions,
    minRatio,
    maxLevel,
  };
}

/* ─── Auto-fix: find accessible alternative ──────────────────────────────────── */

/**
 * Find the nearest accessible color for a foreground on a given background.
 * Searches within a small hue/saturation range and adjusts lightness.
 */
export function findAccessibleColor(
  foreground: string,
  background: string,
  level: WCAGLevel = 'AA',
  largeText = false,
): { color: string; ratio: number; adjusted: boolean } {
  const minRatio = level === 'AAA' ? 7.0 : level === 'AA' ? 4.5 : 3.0;

  const fgRgb = hexToRgb(foreground);
  const bgRgb = hexToRgb(background);
  if (!fgRgb || !bgRgb) {
    return { color: foreground, ratio: 0, adjusted: false };
  }

  const fgOklch = rgbToOklch(fgRgb);
  const bgOklch = rgbToOklch(bgRgb);
  const bgL = bgOklch.l;

  // Check original
  let ratio = contrastRatio(fgRgb, bgRgb);
  if (ratio >= minRatio) {
    return { color: foreground, ratio, adjusted: false };
  }

  // Try adjusting lightness — determine direction based on which is lighter
  const fgLighter = fgOklch.l > bgL;
  let bestColor = foreground;
  let bestRatio = ratio;

  // If foreground is lighter, try going lighter; if darker, try darker
  const startL = fgOklch.l;
  const step = fgLighter ? 0.05 : -0.05;
  const limit = fgLighter ? 0.97 : 0.03;

  for (let l = startL; fgLighter ? l <= limit : l >= limit; l += step) {
    const testOklch: OKLCH = { l: Math.max(0.01, Math.min(0.99, l)), c: fgOklch.c, h: fgOklch.h };
    const testRgb = oklchToRgb(testOklch);
    const testHex = rgbToHex(testRgb);
    const testRgbParsed = hexToRgb(testHex);
    if (!testRgbParsed) continue;
    const r = contrastRatio(testRgbParsed, bgRgb);
    if (r > bestRatio) {
      bestRatio = r;
      bestColor = testHex;
      if (r >= minRatio) break;
    }
  }

  // If still failing, try slightly adjusting saturation
  if (bestRatio < minRatio) {
    for (let c = fgOklch.c + 0.02; c <= 0.3; c += 0.03) {
      for (const l of [0.1, 0.2, 0.8, 0.9]) {
        const testOklch: OKLCH = { l, c, h: fgOklch.h };
        const testRgb = oklchToRgb(testOklch);
        const testHex = rgbToHex(testRgb);
        const testRgbParsed = hexToRgb(testHex);
        if (!testRgbParsed) continue;
        const r = contrastRatio(testRgbParsed, bgRgb);
        if (r > bestRatio) {
          bestRatio = r;
          bestColor = testHex;
          if (r >= minRatio) break;
        }
      }
      if (bestRatio >= minRatio) break;
    }
  }

  return {
    color: bestColor,
    ratio: Math.round(bestRatio * 100) / 100,
    adjusted: bestColor !== foreground,
  };
}

/* ─── Theme audit ───────────────────────────────────────────────────────────── */

export function auditTheme(theme: ThemeAuditResult): AccessibilityReport {
  const pairs = getThemeAuditPairs(theme);
  return generateReport(pairs);
}

/* ─── Report export ─────────────────────────────────────────────────────────── */

export function exportReportAsJSON(report: AccessibilityReport): string {
  return JSON.stringify({
    overallScore: report.overallScore,
    maxLevel: report.maxLevel,
    passedAA: `${report.passedAA}/${report.totalPairs}`,
    passedAAA: `${report.passedAAA}/${report.totalPairs}`,
    minRatio: report.minRatio,
    pairs: report.pairs.map(p => ({
      label: p.label,
      ratio: p.ratio,
      level: p.level,
      passesAA: p.passesAA,
      passesAAA: p.passesAAA,
    })),
    warnings: report.warnings,
    errors: report.errors,
    suggestions: report.suggestions,
    generatedAt: new Date().toISOString(),
  }, null, 2);
}

export function exportReportAsCSV(report: AccessibilityReport): string {
  const rows = [['Label', 'Foreground', 'Background', 'Ratio', 'Level', 'Passes AA', 'Passes AAA']];
  for (const p of report.pairs) {
    rows.push([p.label, p.foreground, p.background, p.ratio.toFixed(2), p.level, p.passesAA ? 'Yes' : 'No', p.passesAAA ? 'Yes' : 'No']);
  }
  return rows.map(row => row.join(',')).join('\n');
}

export function exportReportAsText(report: AccessibilityReport): string {
  const lines: string[] = [];
  lines.push('='.repeat(50));
  lines.push('  ACCESSIBILITY REPORT');
  lines.push('='.repeat(50));
  lines.push(`  Overall Score: ${report.overallScore}%`);
  lines.push(`  Max Level: ${report.maxLevel.toUpperCase()}`);
  lines.push(`  Passed AA: ${report.passedAA}/${report.totalPairs}`);
  lines.push(`  Passed AAA: ${report.passedAAA}/${report.totalPairs}`);
  lines.push(`  Min Ratio: ${report.minRatio.toFixed(2)}:1`);
  lines.push('-'.repeat(50));
  lines.push('  DETAILS:');
  for (const p of report.pairs) {
    const status = p.passesAAA ? '✓✓' : p.passesAA ? '✓' : '✗';
    lines.push(`  ${status} ${p.label}: ${p.ratio.toFixed(2)}:1 (${p.level.toUpperCase()})`);
  }
  if (report.errors.length > 0) {
    lines.push('-'.repeat(50));
    lines.push('  ERRORS:');
    for (const e of report.errors) lines.push(`  ✗ ${e}`);
  }
  if (report.warnings.length > 0) {
    lines.push('-'.repeat(50));
    lines.push('  WARNINGS:');
    for (const w of report.warnings) lines.push(`  ! ${w}`);
  }
  if (report.suggestions.length > 0) {
    lines.push('-'.repeat(50));
    lines.push('  SUGGESTIONS:');
    for (const s of report.suggestions) lines.push(`  › ${s}`);
  }
  lines.push('='.repeat(50));
  return lines.join('\n');
}

export type ReportExportFormat = 'json' | 'csv' | 'text';

export const REPORT_EXPORT_FORMATS: { value: ReportExportFormat; label: string }[] = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'text', label: 'Text Report' },
];

export function exportReport(report: AccessibilityReport, format: ReportExportFormat): string {
  switch (format) {
    case 'json': return exportReportAsJSON(report);
    case 'csv': return exportReportAsCSV(report);
    case 'text': return exportReportAsText(report);
  }
}
