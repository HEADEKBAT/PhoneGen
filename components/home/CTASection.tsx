'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

/**
 * CTA section — "Ready to generate?" with link to Phone Generator.
 */
export default function CTASection() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Ready to generate?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
          Start with the Phone Generator — create valid phone numbers for 245+ countries in seconds.
        </p>
        <Link
          href={`/${locale}/phone-generator`}
          className="inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          Get Started
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
