'use client';

import { Suspense, useCallback, useState } from 'react';
import { Fingerprint, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportBar from '@/features/ExportBar';
import { generateUsernames } from '@/lib/generators';
import type { UsernameResult, UsernameStyle } from '@/lib/generators/username';

/* ── Constants ──────────────────────────────────────────────────────────── */

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100, 500, 1000] as const;

const STYLES: { id: UsernameStyle; label: string; example: string }[] = [
  { id: 'classic', label: 'Classic', example: 'johnsmith' },
  { id: 'modern', label: 'Modern', example: 'blueswan' },
  { id: 'developer', label: 'Developer', example: 'jd_dev' },
  { id: 'gaming', label: 'Gaming', example: 'SwiftTiger42' },
  { id: 'professional', label: 'Professional', example: 'john.smith' },
  { id: 'corporate', label: 'Corporate', example: 'jsmith' },
  { id: 'random', label: 'Random', example: 'Mix of styles' },
];

/* ── Component ──────────────────────────────────────────────────────────── */

function UsernameContent() {
  const [style, setStyle] = useState<UsernameStyle>('random');
  const [quantity, setQuantity] = useState<number>(5);
  const [results, setResults] = useState<UsernameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    requestAnimationFrame(() => {
      const data = generateUsernames({ quantity, style });
      setResults(data);
      setLoading(false);
    });
  }, [quantity, style]);

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
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Username Generator</h1>
            <p className="text-sm text-muted-foreground mt-2">Generate unique usernames in multiple styles</p>
          </div>

          {/* Controls */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-6 space-y-4">
            {/* Style picker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {STYLES.map((s) => {
                const isActive = style === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`rounded-lg border p-2.5 text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-background hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {s.label}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{s.example}</p>
                  </button>
                );
              })}
            </div>

            {/* Quantity */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Quantity</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-9 w-28 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                {QUANTITY_OPTIONS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
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
            {results.length > 0 && <ExportBar data={results} filename="usernames" />}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, i) => (
                <div
                  key={`${item.username}-${i}`}
                  className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground font-mono">
                        <Fingerprint size={14} className="inline mr-2 text-muted-foreground shrink-0" />
                        {item.username}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Style: {item.style}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.username, i)}
                      className="shrink-0 size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                      title="Copy"
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

export default function UsernameGeneratorPage() {
  return (
    <Suspense fallback={null}>
      <UsernameContent />
    </Suspense>
  );
}
