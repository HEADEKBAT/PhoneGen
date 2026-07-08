import { Scan, Globe, Book, Newspaper, Music, Box, Pill, type LucideIcon } from 'lucide-react';
import type { StandardItem } from '@/lib/config/barcode';

interface SupportedStandardsProps {
  standards: StandardItem[];
  locale: string;
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Scan, Globe, Book, Newspaper, Music, Box, Pill,
};

export default function SupportedStandards({ standards, locale, title, subtitle }: SupportedStandardsProps) {
  const productStandards = standards.filter(s => s.category === 'product');
  const industrialStandards = standards.filter(s => s.category === 'industrial');

  return (
    <section id="standards" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || 'Supported Barcode Standards'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || 'Every major barcode symbology — from retail to industrial'}
          </p>
        </div>

        {/* Product Barcodes */}
        <div className="mb-10">
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <Scan size={14} className="text-primary" />
            Product Barcodes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {productStandards.map((s) => {
              const Icon = ICON_MAP[s.icon] || Scan;
              return (
                <a
                  key={s.id}
                  href={`/${locale}/${s.id}-generator`}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="size-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Industrial Barcodes */}
        <div>
          <h3 className="font-heading font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <Box size={14} className="text-primary" />
            Industrial & Logistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {industrialStandards.map((s) => {
              const Icon = ICON_MAP[s.icon] || Scan;
              return (
                <a
                  key={s.id}
                  href={`/${locale}/${s.id}-generator`}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="size-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {s.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
