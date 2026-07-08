'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/lib/i18n';

interface CTASectionProps {
  labelKey: string;
  href: string;
  titleKey?: string;
  descKey?: string;
}

export default function CTASection({
  labelKey,
  href,
  titleKey = 'productLanding.ctaTitle',
  descKey = 'productLanding.ctaDesc',
}: CTASectionProps) {
  const { t } = useTranslations();

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t(titleKey)}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          {t(descKey)}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          {t(labelKey)}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
