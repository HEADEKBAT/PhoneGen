#!/usr/bin/env tsx
/**
 * GenCore SEO Health Check — Entry Point
 *
 * Usage:
 *   npx tsx scripts/seo/check.ts           ← Full CLI check
 *   npx tsx scripts/seo/check.ts --report  ← Save reports only
 *   npx tsx scripts/seo/check.ts --score   ← Print score only (for CI)
 *   npx tsx scripts/seo/check.ts --json    ← Print JSON to stdout
 *
 * Exits with:
 *   0 if score >= 70 (pass / warn only)
 *   1 if score < 70  (fail or critical)
 */

import { SEO_CHECK_CONFIG, CheckResult, CheckContext } from './config';
import { scanAllPages, summarizeScan } from './scanner';
import { buildReport } from './score';
import { printCliReport, saveAllReports } from './report';

/* ── Check registry ─────────────────────────────────────────────────── */

interface CheckModule {
  checkId: string;
  label: string;
  run: (ctx: CheckContext) => Promise<CheckResult>;
}

async function loadChecks(): Promise<CheckModule[]> {
  const modules: CheckModule[] = [
    { checkId: 'sitemap', label: 'Sitemap', run: (await import('./checks/sitemap')).default },
    { checkId: 'robots', label: 'Robots', run: (await import('./checks/robots')).default },
    { checkId: 'metadata', label: 'Metadata', run: (await import('./checks/metadata')).default },
    { checkId: 'canonical', label: 'Canonical', run: (await import('./checks/canonical')).default },
    { checkId: 'hreflang', label: 'Hreflang', run: (await import('./checks/hreflang')).default },
    { checkId: 'jsonld', label: 'JSON-LD', run: (await import('./checks/jsonld')).default },
    { checkId: 'opengraph', label: 'OpenGraph', run: (await import('./checks/opengraph')).default },
    { checkId: 'twitter', label: 'Twitter', run: (await import('./checks/twitter')).default },
    { checkId: 'links', label: 'Links', run: (await import('./checks/links')).default },
    { checkId: 'images', label: 'Images', run: (await import('./checks/images')).default },
    { checkId: 'pages', label: 'Pages', run: (await import('./checks/pages')).default },
    { checkId: 'generators', label: 'Generators', run: (await import('./checks/generators')).default },
    { checkId: 'registry', label: 'Registry', run: (await import('./checks/registry')).default },
    { checkId: 'localization', label: 'Localization', run: (await import('./checks/localization')).default },
    { checkId: 'accessibility', label: 'Accessibility', run: (await import('./checks/accessibility')).default },
    { checkId: 'performance', label: 'Performance', run: (await import('./checks/performance')).default },
  ];
  return modules;
}

/* ── Main ────────────────────────────────────────────────────────────── */

async function main() {
  const args = process.argv.slice(2);
  const showOnlyReport = args.includes('--report');
  const showOnlyScore = args.includes('--score');
  const showJson = args.includes('--json');

  console.error('GenCore SEO Health Check — scanning pages...');

  /* 1. Scan all pages */
  const scannerResult = scanAllPages();
  const ctx: CheckContext = {
    allPages: scannerResult.pages,
    locales: scannerResult.locales,
    config: SEO_CHECK_CONFIG,
  };

  console.error(`  Discovered ${scannerResult.pages.length} pages across ${scannerResult.locales.length} locales`);
  const summary = summarizeScan(scannerResult);
  for (const [source, count] of Object.entries(summary)) {
    console.error(`    ${source}: ${count}`);
  }

  /* 2. Run all checks */
  const checks = await loadChecks();
  console.error(`\n  Running ${checks.length} checks...\n`);

  const results: CheckResult[] = [];
  for (const check of checks) {
    try {
      const result = await check.run(ctx);
      results.push(result);
    } catch (err) {
      results.push({
        checkId: check.checkId,
        label: check.label,
        status: 'error',
        score: 0,
        maxScore: 100,
        details: [`Check threw: ${err instanceof Error ? err.message : String(err)}`],
        affectedPages: [],
      });
    }
  }

  /* 3. Build report */
  const report = buildReport(results, {
    pagesDiscovered: scannerResult.pages.length,
    locales: scannerResult.locales,
  });

  /* 4. Output */
  if (showOnlyReport) {
    saveAllReports(report);
    return;
  }

  if (showOnlyScore) {
    console.log(report.overallScore);
    return;
  }

  if (showJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  // Default: CLI output + save reports
  printCliReport(report);
  saveAllReports(report);

  /* 5. Exit code */
  if (report.overallScore < 70) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('SEO Health Check failed:', err);
  process.exit(1);
});
