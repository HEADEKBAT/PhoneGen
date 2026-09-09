'use client';

import Link from 'next/link';
import {
  CreditCard, CreditCardIcon, Search, ShieldCheck, Layers, Terminal, Bug,
  type LucideIcon,
} from 'lucide-react';
import { ALL_PAYMENT_SEO_PAGES } from '@/lib/config/paymentSEOPages';

interface PaymentToolGridProps {
  locale: string;
}

const TOOL_ICONS: Record<string, LucideIcon> = {
  'credit-card-generator': CreditCard,
  'visa-card-generator': CreditCardIcon,
  'mastercard-generator': CreditCardIcon,
  'amex-card-generator': CreditCardIcon,
  'discover-card-generator': CreditCardIcon,
  'jcb-card-generator': CreditCardIcon,
  'test-credit-card-numbers': Layers,
  'credit-card-validator': ShieldCheck,
  'bin-lookup': Search,
  'cvv-generator': ShieldCheck,
  'bulk-credit-card-generator': Layers,
};

export default function PaymentToolGrid({ locale }: PaymentToolGridProps) {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Payment Testing Tools
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Choose from 11 powerful payment testing tools
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ALL_PAYMENT_SEO_PAGES.map((tool) => {
            const Icon = TOOL_ICONS[tool.id] || CreditCard;
            return (
              <Link
                key={tool.id}
                href={`/${locale}/${tool.slug}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-card hover:border-emerald-500/40 hover:shadow-sm transition-all group"
              >
                <div className="size-10 rounded-lg bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-foreground text-center leading-tight group-hover:text-emerald-500 transition-colors">
                  {tool.title}
                </span>
                <span className="text-[11px] text-muted-foreground text-center leading-tight line-clamp-2">
                  {tool.description}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
