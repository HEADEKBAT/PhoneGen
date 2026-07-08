import Link from 'next/link';
import { Wifi, Database, Container, Lock, Key, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { UseCase } from '@/lib/config/credentialLanding';

interface UseCasesProps {
  useCases: UseCase[];
  locale: string;
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Wifi, Database, Container, Lock, Key, ShieldCheck,
};

export default function UseCases({ useCases, locale, title, subtitle }: UseCasesProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || "Common Use Cases"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || "One click to generate the right credential for any service"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc) => {
            const Icon = ICON_MAP[uc.icon] || Key;
            return (
              <Link
                key={uc.id}
                href={`/${locale}/credential-generator/tool?preset=${uc.preset}`}
                className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="size-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {uc.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{uc.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary">
                    Generate &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
