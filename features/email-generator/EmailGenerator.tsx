'use client';

import { Suspense, useCallback, useState } from 'react';
import { Mail, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportBar from '@/features/ExportBar';
import { generateEmails } from '@/lib/generators';
import type { EmailResult, EmailMode } from '@/lib/generators/email';

/* ── Constants ──────────────────────────────────────────────────────────── */

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100, 500, 1000] as const;

const MODES: { id: EmailMode; label: string; desc: string }[] = [
  { id: 'random', label: 'Random', desc: 'Popular providers' },
  { id: 'professional', label: 'Professional', desc: 'Business-style' },
  { id: 'corporate', label: 'Corporate', desc: 'Fictional domains' },
  { id: 'disposable', label: 'Disposable', desc: 'Temp mail style' },
  { id: 'nickname', label: 'Nickname', desc: 'Creative handles' },
];

/* ── Component ──────────────────────────────────────────────────────────── */

function EmailContent() {
  const [mode, setMode] = useState<EmailMode>('random');
  const [quantity, setQuantity] = useState<number>(5);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    requestAnimationFrame(() => {
      const data = generateEmails({ quantity, mode });
      setResults(data);
      setLoading(false);
    });
  }, [quantity, mode]);

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
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">Email Generator</h1>
            <p className="text-sm text-muted-foreground mt-2">Generate realistic email addresses for testing and development</p>
          </div>

          {/* Controls */}
          <div className="rounded-xl border border-border bg-card p-4 sm:p-5 mb-6 space-y-4">
            {/* Mode picker */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MODES.map((m) => {
                const isActive = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-lg border p-2.5 text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                        : 'border-border bg-background hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {m.label}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</p>
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
            {results.length > 0 && <ExportBar data={results} filename="emails" />}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((item, i) => (
                <div
                  key={`${item.email}-${i}`}
                  className="rounded-xl border border-border bg-card p-4 hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground break-all">
                        <Mail size={14} className="inline mr-1 text-muted-foreground shrink-0" />
                        {item.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Domain: {item.domain} · Mode: {item.mode}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.email, i)}
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

export default function EmailGeneratorPage() {
  return (
    <Suspense fallback={null}>
      <EmailContent />
    </Suspense>
  );
}
