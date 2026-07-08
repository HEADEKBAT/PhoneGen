import { Scan, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { BarcodeHeroData } from '@/lib/config/barcode';

interface BarcodeHeroProps {
  hero: BarcodeHeroData;
  locale: string;
}

export default function BarcodeHero({ hero, locale }: BarcodeHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-primary/[0.02] to-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium mb-6">
            <Scan size={14} />
            <span>Barcode Studio</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            {hero.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            {hero.subtitle}
          </p>

          {/* Benefits badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {hero.benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                {benefit}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/barcode-generator/tool`}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {hero.ctaPrimary}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="#standards"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl border border-border bg-card text-foreground font-medium hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
