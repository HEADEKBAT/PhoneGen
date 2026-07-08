/**
 * SEO Check API Route
 *
 * POST /api/seo/check — Re-runs the SEO health check script
 * and returns the latest report JSON.
 *
 * Dev-only: returns 404 in production unless SEO_DASHBOARD env is set.
 */

import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export async function POST() {
  // Guard: dev-only
  if (process.env.NODE_ENV === 'production' && !process.env.SEO_DASHBOARD) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    const cwd = process.cwd();

    // Run the check script
    execSync('npx tsx scripts/seo/check.ts --report', {
      cwd,
      timeout: 120_000,
      stdio: 'pipe',
    });

    // Read the report
    const reportPath = path.resolve(cwd, 'reports', 'latest.json');
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { error: 'Report file not found after check' },
        { status: 500 },
      );
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
