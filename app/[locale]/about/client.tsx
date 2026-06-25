'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslations } from '@/lib/i18n';
import { CheckCircle2, Globe, Zap, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Flag from 'react-world-flags';
import { COUNTRIES } from '@/lib/phoneGenerator';

export default function AboutClient() {
  const { t } = useTranslations();

  const countries = Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name));

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  const features = [
    { icon: Globe, key: '35plus', color: 'text-primary' },
    { icon: Zap, key: '3formats', color: 'text-accent' },
    { icon: CheckCircle2, key: 'valid', color: 'text-primary' },
    { icon: Users, key: 'free', color: 'text-accent' },
  ];

  const faqs = [
    { q: 'q1', a: 'a1' },
    { q: 'q2', a: 'a2' },
    { q: 'q3', a: 'a3' },
    { q: 'q4', a: 'a4' },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              {t('about.heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t('about.heroDesc')}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 space-y-16">
          {/* What is it */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              {t('about.whatTitle')}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{t('about.whatDesc1')}</p>
              <p>{t('about.whatDesc2')}</p>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t('about.featuresTitle')}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, key, color }) => (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-card p-4 sm:p-5 space-y-3"
                >
                  <Icon size={24} className={color} />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">
                      {t(`about.features_${key}_title` as any)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t(`about.features_${key}_desc` as any)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Countries */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              {t('about.countriesTitle')} · {countries.length}
            </h2>
            <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    <Flag
                      code={getCountryCode(country.code)}
                      style={{ width: '14px', height: '10px', borderRadius: '1px', objectFit: 'cover', flexShrink: 0 }}
                      title={t('countries.' + country.code)}
                    />
                    <span className="text-[11px] font-medium text-foreground truncate leading-none">
                      {country.code}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t('about.useCasesTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['dev', 'qa', 'analyst', 'edu'] as const).map((key) => (
                <div
                  key={key}
                  className="rounded-xl border border-border bg-card p-5 space-y-3"
                >
                  <h3 className="font-heading font-semibold text-foreground">
                    {t(`about.useCases_${key}_title`)}
                  </h3>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {[1, 2, 3, 4].map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{t(`about.useCases_${key}_${i}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t('about.faqTitle')}
            </h2>
            <div className="space-y-2">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  className="rounded-xl border border-border bg-card group [[open]]:bg-muted/30 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none">
                    <span className="text-sm font-medium text-foreground pr-4">
                      {t(`about.faq_${q}`)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground shrink-0 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`about.faq_${a}`)}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {t('about.ctaTitle')}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              {t('about.ctaDesc')}
            </p>
            <Link
              href="/phone-generator"
              className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              {t('about.ctaButton')}
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
