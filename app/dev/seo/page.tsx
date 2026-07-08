/**
 * SEO Health Dashboard — Dev-only page
 *
 * Shows interactive SEO status from the latest check report.
 * Only available in development (NODE_ENV !== 'production').
 */

import { redirect } from 'next/navigation';
import * as fs from 'fs';
import * as path from 'path';
import type { SeoReport } from '../../../scripts/seo/config';
import SEOHealthDashboard from './SEOHealthDashboard';

export const dynamic = 'force-dynamic';

export default async function SEODashboardPage() {
  // Guard: only available in dev
  if (process.env.NODE_ENV === 'production' && !process.env.SEO_DASHBOARD) {
    redirect('/');
  }

  let report: SeoReport | null = null;
  let error: string | null = null;

  try {
    const reportPath = path.resolve(process.cwd(), 'reports', 'latest.json');
    if (fs.existsSync(reportPath)) {
      const raw = fs.readFileSync(reportPath, 'utf-8');
      report = JSON.parse(raw);
    } else {
      error = 'No report found. Run `npm run seo:check` first.';
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to parse report';
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <SEODashboardShell report={report} error={error} />
    </div>
  );
}

/* ── Shell wrapper for the interactive dashboard ──────────────────────── */

function SEODashboardShell({
  report,
  error,
}: {
  report: SeoReport | null;
  error: string | null;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Health Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Dev-only internal tool — shows results from the last SEO check run
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Refresh
          </button>
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/seo/check', { method: 'POST' });
                if (res.ok) window.location.reload();
              } catch { /* ignore */ }
            }}
            className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
          >
            Re-run Check
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
          <h2 className="font-semibold">Error loading report</h2>
          <p className="mt-1 text-sm">{error}</p>
          <pre className="mt-2 text-xs">Run: npm run seo:check</pre>
        </div>
      ) : report ? (
        <SEOHealthDashboard report={report} />
      ) : (
        <div className="rounded-lg border p-6 text-center text-muted-foreground">
          <p>No report data available.</p>
          <p className="mt-2 text-sm">Run <code>npm run seo:check</code> in your terminal first.</p>
        </div>
      )}
    </div>
  );
}
