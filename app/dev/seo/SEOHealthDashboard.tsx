'use client';

/**
 * SEO Health Dashboard — Client Component
 *
 * Interactive dashboard showing SEO check results with score gauge,
 * expandable check list, and affected pages grouped by issue.
 */

import { useState, useMemo } from 'react';
import type { SeoReport, CheckResult } from '../../../scripts/seo/config';

interface Props {
  report: SeoReport;
}

/* ── Color helpers ───────────────────────────────────────────────────── */

function scoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

function scoreBg(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-red-500';
}

function statusIcon(status: CheckResult['status']): string {
  switch (status) {
    case 'pass': return '✅';
    case 'warn': return '⚠️';
    case 'fail': return '❌';
    case 'error': return '💥';
  }
}

/* ── Component ───────────────────────────────────────────────────────── */

export default function SEOHealthDashboard({ report }: Props) {
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocale, setFilterLocale] = useState<string>('all');

  const filteredResults = useMemo(() => {
    return report.results.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterLocale !== 'all') {
        const hasLocale = r.affectedPages.some((ap) => ap.locale === filterLocale);
        if (!hasLocale) return false;
      }
      return true;
    });
  }, [report.results, filterStatus, filterLocale]);

  return (
    <>
      {/* Score gauge */}
      <ScoreGauge score={report.overallScore} grade={report.grade} />

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Pages" value={report.pagesDiscovered.toLocaleString()} />
        <SummaryCard label="Locales" value={report.locales.length.toString()} />
        <SummaryCard label="Checks" value={`${report.checksRun}/16`} />
        <SummaryCard label="Issues" value={report.issues.toString()} severity="warn" />
      </div>

      {/* Report metadata */}
      <div className="mt-4 text-xs text-muted-foreground">
        <span>Report: {new Date(report.timestamp).toLocaleString()}</span>
        <span className="ml-4">Base URL: {report.baseUrl}</span>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pass">Pass</option>
          <option value="warn">Warning</option>
          <option value="fail">Fail</option>
          <option value="error">Error</option>
        </select>
        <select
          value={filterLocale}
          onChange={(e) => setFilterLocale(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="all">All locales</option>
          {report.locales.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Check list */}
      <div className="mt-6 space-y-2">
        <h2 className="text-lg font-semibold">Check Results</h2>
        {filteredResults.length === 0 && (
          <p className="text-sm text-muted-foreground">No results match the filter.</p>
        )}
        {filteredResults.map((result) => (
          <CheckResultCard
            key={result.checkId}
            result={result}
            isExpanded={expandedCheck === result.checkId}
            onToggle={() =>
              setExpandedCheck(
                expandedCheck === result.checkId ? null : result.checkId,
              )
            }
          />
        ))}
      </div>
    </>
  );
}

/* ── Score Gauge ──────────────────────────────────────────────────────── */

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? '#22c55e' : score >= 70 ? '#eab308' : '#ef4444';

  return (
    <div className="flex items-center gap-6 rounded-lg border p-6">
      <div className="relative h-40 w-40 flex-shrink-0">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted/20"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{grade}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {score >= 90
            ? 'All SEO checks pass or are within acceptable ranges.'
            : score >= 70
              ? 'Most checks pass. Review warnings for improvement opportunities.'
              : score >= 50
                ? 'Several checks need attention. Prioritize fix items.'
                : 'Critical SEO issues detected. Immediate action recommended.'}
        </p>
      </div>
    </div>
  );
}

/* ── Summary Card ─────────────────────────────────────────────────────── */

function SummaryCard({
  label,
  value,
  severity,
}: {
  label: string;
  value: string;
  severity?: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          severity === 'warn' ? 'text-yellow-600' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ── Check Result Card ────────────────────────────────────────────────── */

function CheckResultCard({
  result,
  isExpanded,
  onToggle,
}: {
  result: CheckResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasIssues = result.status !== 'pass' && result.affectedPages.length > 0;

  return (
    <div className="rounded-lg border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{statusIcon(result.status)}</span>
          <div>
            <span className="font-medium">{result.label}</span>
            {result.details.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {result.details[0]}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-bold ${scoreColor(result.score)}`}>
            {result.score}
          </span>
          <span className="text-xs text-muted-foreground transition-transform">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t px-4 py-3">
          {/* Details */}
          {result.details.map((d, i) => (
            <p key={i} className="text-sm text-muted-foreground">{d}</p>
          ))}

          {/* Affected pages */}
          {result.affectedPages.length > 0 && (
            <div className="mt-3">
              <p className="mb-1 text-sm font-medium">
                Affected pages ({result.affectedPages.length})
              </p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {result.affectedPages.map((ap, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded bg-muted/30 px-2 py-1 text-xs"
                  >
                    <span className="rounded bg-muted px-1 py-0.5 font-mono">
                      {ap.locale}
                    </span>
                    <a
                      href={`${ap.locale === 'all' ? '/en' : `/${ap.locale}`}${ap.path}`}
                      className="font-mono text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {ap.path}
                    </a>
                    <span className="text-muted-foreground">— {ap.issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score breakdown */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>Score: {result.score}/{result.maxScore}</span>
            <span className={`rounded px-1.5 py-0.5 ${
              result.status === 'pass' ? 'bg-green-100 text-green-700' :
              result.status === 'warn' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {result.status.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
