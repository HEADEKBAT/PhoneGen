'use client';

import { Suspense, useCallback, useState } from 'react';
import { Building, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportBar from '@/features/ExportBar';
import { generateCompanies } from '@/lib/generators';
import { SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from '@/lib/generators/country';
import type { CompanyResult } from '@/lib/generators/company';

/* ── Constants ──────────────────────────────────────────────────────────── */

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100, 500, 1000] as const;

/* ── Component ──────────────────────────────────────────────────────────── */

function CompanyContent() {
  const [country, setCountry] = useState('US');
  const [quantity, setQuantity] = useState<number>(5);
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    requestAnimationFrame(() => {
      const data = generateCompanies({ country, quantity });
      setResults(data);
      setLoading(false);
    });
  }, [country, quantity]);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch { /* noop */ }
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Company Generator</h1>
            <p className="text-sm text-muted-foreground mt-2">Generate realistic company profiles for any country</p>
          </div>

          {/* Controls */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-6">
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Country</span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {SUPPORTED_COUNTRY_CODES.map((code) => (
                    <option key={code} value={code}>{code} — {COUNTRY_NAMES[code]}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {QUANTITY_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Generate */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? 'Generating…' : 'Generate'}
            </button>
            {results.length > 0 && <ExportBar data={results} filename="companies" />}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((item, i) => (
                <div
                  key={`${item.name}-${i}`}
                  className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        <Building size={14} className="inline mr-1.5 text-muted-foreground" />
                        {item.name}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                        <span>Industry: {item.industry}</span>
                        <span>Department: {item.department}</span>
                        <span>Job Title: {item.jobTitle}</span>
                        <span>Type: {item.type}</span>
                        <span>Size: {item.size}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                        <span>Website: {item.website}</span>
                        <span>Email: @{item.emailDomain}</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic mt-1">&ldquo;{item.slogan}&rdquo;</p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.name, i)}
                      className="shrink-0 size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy company name"
                    >
                      {copiedIndex === i ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CompanyGeneratorPage() {
  return (
    <Suspense fallback={null}>
      <CompanyContent />
    </Suspense>
  );
}
