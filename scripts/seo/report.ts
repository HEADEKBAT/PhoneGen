/**
 * SEO Health Check — Report Generator
 *
 * Produces three output formats:
 *   1. Colorized CLI output (stdout)
 *   2. Markdown report (reports/seo-check-YYYY-MM-DD.md)
 *   3. JSON report (reports/seo-check-YYYY-MM-DD.json + reports/latest.json)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  SEO_CHECK_CONFIG,
  getGrade,
  getStatusLabel,
  SeoReport,
  CheckResult,
} from './config';

/* ── CLI Output ──────────────────────────────────────────────────────── */

function colorize(text: string, color: string): string {
  const colors: Record<string, string> = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    reset: '\x1b[0m',
  };
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function statusColor(status: CheckResult['status']): string {
  switch (status) {
    case 'pass': return 'green';
    case 'warn': return 'yellow';
    case 'fail': return 'red';
    case 'error': return 'red';
  }
}

function scoreColor(score: number): string {
  if (score >= 90) return 'green';
  if (score >= 70) return 'yellow';
  return 'red';
}

function gradeColor(grade: string): string {
  if (grade.includes('Excellent')) return 'green';
  if (grade.includes('Good')) return 'yellow';
  if (grade.includes('Fair')) return 'yellow';
  return 'red';
}

export function printCliReport(report: SeoReport): void {
  const line = '─'.repeat(58);

  console.log();
  console.log(`╔${line}╗`);
  console.log(`║${colorize('           GenCore SEO Health Check Report          ', 'bold')} ║`);
  console.log(`║${colorize(`           ${new Date(report.timestamp).toISOString()}              `, 'dim')}║`);
  console.log(`╚${line}╝`);
  console.log();
  console.log(`  ${colorize('Pages discovered:', 'bold')} ${report.pagesDiscovered}`);
  console.log(`  ${colorize('Locales checked:', 'bold')}  ${report.locales.length} (${report.locales.join(', ')})`);
  console.log(`  ${colorize('Checks run:', 'bold')}       ${report.checksRun}/16`);
  console.log();
  console.log(` ${'─'.repeat(56)}`);
  console.log(`  ${colorize('CHECK', 'bold').padEnd(20)} ${colorize('STATUS', 'bold').padEnd(8)} ${colorize('SCORE', 'bold').padEnd(8)} ${colorize('DETAILS', 'bold')}`);
  console.log(` ${'─'.repeat(56)}`);

  for (const result of report.results) {
    const icon = getStatusLabel(result.status);
    const coloredStatus = colorize(
      `${icon}${result.status.toUpperCase()}`,
      statusColor(result.status),
    );
    const coloredScore = colorize(
      `${result.score}`,
      scoreColor(result.score),
    );
    const detail = result.details[0] || '';
    console.log(
      `  ${result.label.padEnd(18)} ${coloredStatus.padEnd(10)} ${coloredScore.padEnd(8)} ${detail}`,
    );
  }

  console.log(` ${'─'.repeat(56)}`);
  console.log();
  const gradeLabel = colorize(
    `  ${report.grade}`,
    gradeColor(report.grade),
  );
  const scoreDisplay = colorize(
    `OVERALL SEO SCORE:  ${report.overallScore} / 100`,
    scoreColor(report.overallScore),
  );
  console.log(`  ${scoreDisplay}`);
  console.log(`  ${gradeLabel}`);
  console.log();
  console.log(`  ${colorize('Issues requiring attention:', 'bold')} ${report.issues}`);
  console.log();
  console.log(`  Reports:`);
  const dateStr = new Date(report.timestamp).toISOString().slice(0, 10);
  console.log(`    ${SEO_CHECK_CONFIG.outputDir}/seo-check-${dateStr}.md`);
  console.log(`    ${SEO_CHECK_CONFIG.outputDir}/seo-check-${dateStr}.json`);
  console.log(`    ${SEO_CHECK_CONFIG.outputDir}/latest.json`);
  console.log();
}

/* ── Markdown Report ─────────────────────────────────────────────────── */

export function generateMarkdownReport(report: SeoReport): string {
  const dateStr = new Date(report.timestamp).toISOString().slice(0, 10);
  let md = `# GenCore SEO Health Check Report\n\n`;
  md += `**Date**: ${dateStr}\n\n`;
  md += `**Base URL**: ${report.baseUrl}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|---|---|\n`;
  md += `| Pages Discovered | ${report.pagesDiscovered} |\n`;
  md += `| Locales | ${report.locales.join(', ')} |\n`;
  md += `| Checks Run | ${report.checksRun} |\n`;
  md += `| Overall Score | ${report.overallScore}/100 |\n`;
  md += `| Grade | ${report.grade} |\n`;
  md += `| Issues | ${report.issues} |\n\n`;

  md += `## Check Results\n\n`;
  md += `| Check | Status | Score | Details |\n|---|---|---|---|\n`;

  for (const result of report.results) {
    const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    const detail = result.details.join('; ') || '-';
    md += `| ${result.label} | ${statusIcon} ${result.status.toUpperCase()} | ${result.score}/100 | ${detail} |\n`;

    if (result.affectedPages.length > 0) {
      md += `| | | | **Affected pages:** |\n`;
      for (const ap of result.affectedPages) {
        md += `| | | | \`${ap.locale}${ap.path}\` — ${ap.issue} |\n`;
      }
    }
  }

  return md;
}

/* ── File Output ─────────────────────────────────────────────────────── */

function getOutputDir(): string {
  const dir = path.resolve(process.cwd(), SEO_CHECK_CONFIG.outputDir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function saveJsonReport(report: SeoReport): { dated: string; latest: string } {
  const dir = getOutputDir();
  const dateStr = new Date(report.timestamp).toISOString().slice(0, 10);
  const datedPath = path.join(dir, `seo-check-${dateStr}.json`);
  const latestPath = path.join(dir, 'latest.json');

  const json = JSON.stringify(report, null, 2);
  fs.writeFileSync(datedPath, json, 'utf-8');
  fs.writeFileSync(latestPath, json, 'utf-8');

  return { dated: datedPath, latest: latestPath };
}

export function saveMarkdownReport(report: SeoReport): string {
  const dir = getOutputDir();
  const dateStr = new Date(report.timestamp).toISOString().slice(0, 10);
  const mdPath = path.join(dir, `seo-check-${dateStr}.md`);

  const md = generateMarkdownReport(report);
  fs.writeFileSync(mdPath, md, 'utf-8');

  // Also write latest.md
  const latestMdPath = path.join(dir, 'latest.md');
  fs.writeFileSync(latestMdPath, md, 'utf-8');

  return mdPath;
}

/* ── Combined ────────────────────────────────────────────────────────── */

export interface ReportPaths {
  jsonDated: string;
  jsonLatest: string;
  md: string;
}

export function saveAllReports(report: SeoReport): ReportPaths {
  const json = saveJsonReport(report);
  const md = saveMarkdownReport(report);

  console.log(`\n  Reports saved:`);
  console.log(`    ${json.dated}`);
  console.log(`    ${json.latest}`);
  console.log(`    ${md}`);

  return {
    jsonDated: json.dated,
    jsonLatest: json.latest,
    md,
  };
}
