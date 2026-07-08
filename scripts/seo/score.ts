/**
 * SEO Health Check — Scoring Engine
 *
 * Weighted score calculation per category.
 * Total = sum over checks of (score × weight / 100)
 */

import { SEO_CHECK_CONFIG, getGrade, CheckResult, SeoReport } from './config';

/* ── Scoring ─────────────────────────────────────────────────────────── */

export interface ScoreBreakdown {
  checkId: string;
  label: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
}

export interface ScoreResult {
  overallScore: number;
  grade: string;
  breakdown: ScoreBreakdown[];
  totalIssues: number;
}

/**
 * Calculate the weighted SEO score from check results.
 */
export function calculateScore(results: CheckResult[]): ScoreResult {
  const { weights } = SEO_CHECK_CONFIG;
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const breakdown: ScoreBreakdown[] = [];
  let weightedSum = 0;

  for (const result of results) {
    const weight = weights[result.checkId] || 5; // default weight if not mapped
    const weighted = (result.score / 100) * weight;
    weightedSum += weighted;

    breakdown.push({
      checkId: result.checkId,
      label: result.label,
      weight,
      rawScore: result.score,
      weightedScore: Math.round(weighted * 100) / 100,
    });
  }

  const overallScore = Math.round((weightedSum / totalWeight) * 100);
  const grade = getGrade(overallScore);
  const totalIssues = results.reduce(
    (sum, r) => sum + (r.status !== 'pass' ? r.affectedPages.length : 0),
    0,
  );

  return { overallScore, grade, breakdown, totalIssues };
}

/**
 * Build the final SeoReport from check results.
 */
export function buildReport(
  results: CheckResult[],
  scannerInfo: {
    pagesDiscovered: number;
    locales: string[];
  },
): SeoReport {
  const score = calculateScore(results);

  return {
    timestamp: new Date().toISOString(),
    baseUrl: SEO_CHECK_CONFIG.baseUrl,
    pagesDiscovered: scannerInfo.pagesDiscovered,
    locales: scannerInfo.locales,
    checksRun: results.length,
    results,
    overallScore: score.overallScore,
    grade: score.grade,
    issues: score.totalIssues,
  };
}
