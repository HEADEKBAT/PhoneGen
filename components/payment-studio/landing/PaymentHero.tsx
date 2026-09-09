'use client';

import { CreditCard, Search, ShieldCheck, Download, Zap, Globe } from 'lucide-react';

interface PaymentHeroProps {
  locale: string;
}

const FEATURES = [
  { icon: CreditCard, title: '15+ Card Networks', desc: 'Visa, Mastercard, Amex, Discover, JCB, UnionPay, and 10 more' },
  { icon: ShieldCheck, title: 'Luhn Validated', desc: 'All generated numbers pass the Luhn checksum algorithm' },
  { icon: Search, title: 'BIN Lookup', desc: 'Identify card networks from BIN/IIN prefixes instantly' },
  { icon: Download, title: 'Multiple Exports', desc: 'Export as TXT, CSV, JSON, SQL, XML, or YAML' },
  { icon: Zap, title: 'Client-Side Only', desc: 'All generation happens in your browser, nothing is sent to servers' },
  { icon: Globe, title: '6 Generation Modes', desc: 'Quick, Advanced, BIN, Bulk, Developer, and Negative Testing' },
];

export default function PaymentHero({ locale }: PaymentHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-emerald-500/10 via-emerald-500/[0.02] to-background">
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6 mx-auto">
            <CreditCard size={24} />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Payment Studio
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate test credit card numbers for 15+ payment networks, validate cards,
            look up BIN/IIN numbers, and create test payment profiles — all locally in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
