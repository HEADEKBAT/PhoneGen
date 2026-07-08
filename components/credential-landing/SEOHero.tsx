import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SEOHeroProps {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel?: string;
}

export default function SEOHero({ title, subtitle, ctaHref, ctaLabel = 'Generate Now' }: SEOHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-primary/[0.02] to-background">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-20 pb-20 sm:pb-24 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
    </section>
  );
}
