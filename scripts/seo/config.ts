/**
 * SEO Health Check — Configuration
 *
 * Thresholds, weights, ignore patterns, and output paths.
 * Single source of truth for the checker's calibration.
 */

/* ── Shared Types ────────────────────────────────────────────────── */

export interface AffectedPage {
  locale: string;
  path: string;
  issue: string;
}

export interface CheckResult {
  checkId: string;
  label: string;
  status: 'pass' | 'warn' | 'fail' | 'error';
  score: number;       // 0–100 for this check
  maxScore: number;    // usually 100
  details: string[];
  affectedPages: AffectedPage[];
}

export interface CheckContext {
  /** All pages discovered by the scanner */
  allPages: ScannedPage[];
  /** Locale list */
  locales: string[];
  /** Check configuration */
  config: SeoCheckConfig;
}

export interface ScannedPage {
  locale: string;
  path: string;        // e.g. /en/phone-generator
  fullUrl: string;     // https://www.gencore.space/en/phone-generator
  source: 'product' | 'generator' | 'seo-page' | 'barcode-seo-page' | 'home' | 'about' | 'country' | 'extra';
  productId?: string;
  generatorId?: string;
}

export interface SeoCheckConfig {
  outputDir: string;
  baseUrl: string;
  weights: Record<string, number>;
  thresholds: {
    titleMinLen: number;
    titleMaxLen: number;
    descMinLen: number;
    descMaxLen: number;
    maxImageSizeKB: number;
    maxBundleSizeKB: number;
  };
  ignorePatterns: string[];
  status: string;
}

export interface SeoReport {
  timestamp: string;
  baseUrl: string;
  pagesDiscovered: number;
  locales: string[];
  checksRun: number;
  results: CheckResult[];
  overallScore: number;
  grade: string;
  issues: number;
}

export type CheckFn = (context: CheckContext) => Promise<CheckResult>;

/* ── Weights (total = 100) ───────────────────────────────────────── */

const WEIGHTS: Record<string, number> = {
  sitemap: 5,
  robots: 5,
  metadata: 10,
  canonical: 10,
  hreflang: 10,
  jsonld: 5,
  opengraph: 5,
  twitter: 5,
  links: 10,
  images: 5,
  pages: 5,
  generators: 5,
  registry: 5,
  localization: 10,
  accessibility: 3,
  performance: 2,
};

/* ── Configuration ───────────────────────────────────────────────── */

export const SEO_CHECK_CONFIG: SeoCheckConfig = {
  outputDir: 'reports',
  baseUrl: process.env.SEO_BASE_URL || 'https://www.gencore.space',
  weights: WEIGHTS,
  thresholds: {
    titleMinLen: 20,
    titleMaxLen: 65,
    descMinLen: 80,
    descMaxLen: 165,
    maxImageSizeKB: 200,
    maxBundleSizeKB: 300,
  },
  ignorePatterns: [
    '/dev/',
    '/api/',
    '/_next/',
    'favicon',
    '.json',
    '.xml',
    '.txt',
  ],
  status: 'active',
};

/* ── Helpers ─────────────────────────────────────────────────────── */

export function getGrade(score: number): string {
  if (score >= 90) return '🟢 Excellent';
  if (score >= 70) return '🟡 Good';
  if (score >= 50) return '🟠 Fair';
  return '🔴 Critical';
}

export function getStatusLabel(status: CheckResult['status']): string {
  switch (status) {
    case 'pass': return '✓ ';
    case 'warn': return '⚠ ';
    case 'fail': return '✗ ';
    case 'error': return '! ';
  }
}

export function checkPassed(result: CheckResult): boolean {
  return result.status === 'pass' || (result.status === 'warn');
}
