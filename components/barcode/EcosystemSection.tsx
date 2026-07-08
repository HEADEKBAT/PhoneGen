import Link from 'next/link';
import { Users, Phone, Key, Building, ArrowRight, type LucideIcon } from 'lucide-react';
import type { EcosystemLink } from '@/lib/config/barcode';

interface EcosystemSectionProps {
  links: EcosystemLink[];
  locale: string;
  title?: string;
  subtitle?: string;
  flowTitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Users, Phone, Key, Building,
};

export default function EcosystemSection({ links, locale, title, subtitle, flowTitle }: EcosystemSectionProps) {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || 'Part of the GenCore Ecosystem'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            {subtitle || 'Barcode Studio works great with other GenCore tools to create complete product data'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {links.map((link) => {
            const Icon = ICON_MAP[link.icon] || Users;
            return (
              <Link
                key={link.id}
                href={`/${locale}${link.href}`}
                className="flex flex-col items-center text-center gap-2 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <div className="size-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </span>
                <span className="text-xs text-muted-foreground leading-tight line-clamp-2">
                  {link.desc}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Flow diagram */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-heading font-semibold text-sm text-foreground mb-4 text-center">
              {flowTitle || 'Generate a Complete Product Profile'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <FlowStep label="Company Generator" />
              <ArrowRight size={14} className="text-muted-foreground" />
              <FlowStep label="Barcode Studio" />
              <ArrowRight size={14} className="text-muted-foreground" />
              <FlowStep label="Export Product Card" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowStep({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-xs font-medium text-primary whitespace-nowrap">
      {label}
    </span>
  );
}
