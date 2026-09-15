'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import Flag from 'react-world-flags';
import CountrySelect from '@/components/CountrySelect';
import type { PhoneCountryExample } from '@/lib/phone/examples';
import { useTranslations } from '@/lib/i18n';
import { REVEAL_VIEWPORT, revealCard, revealUp, stagger } from '@/components/home/motion';

interface PhoneCountriesProps {
  locale: string;
  examples: PhoneCountryExample[];
}

/**
 * The way into the 245 country pages.
 *
 * Two of them, on purpose. The dropdown was the old landing's only route and
 * it is still the right one when you know which country you want — but a
 * `<select>` is invisible to a crawler, so those 245 pages had no internal
 * link pointing at them from anywhere on the site. The grid above it links to
 * the twelve most asked-for directly, with that country's real example number
 * on the card, so the section is navigation and demonstration at once.
 */
export default function PhoneCountries({ locale, examples }: PhoneCountriesProps) {
  const { t } = useTranslations();
  const router = useRouter();
  const reduced = useReducedMotion();
  const [country, setCountry] = useState('US');

  const handleGenerate = useCallback(() => {
    router.push(`/${locale}/phone-generator/${country}`);
  }, [country, locale, router]);

  return (
    <section id="countries" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <motion.div
        variants={revealUp}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="relative mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2.5"
      >
        <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          {t('productLanding.phone.countries.title')}
        </h2>
        <p className="text-[0.8125rem] text-muted-foreground">
          {t('productLanding.phone.countries.note')}
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
        />
      </motion.div>

      <motion.ul
        variants={stagger(0.03)}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3"
      >
        {examples.map((example) => (
          <motion.li key={example.iso} variants={revealCard} className="list-none">
            <Link
              href={`/${locale}/phone-generator/${example.iso}`}
              className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-elevated"
            >
              <div className="flex items-center gap-2.5">
                <Flag
                  code={example.iso}
                  title={example.name}
                  style={{ width: '22px', height: '16px', borderRadius: '2px', objectFit: 'cover' }}
                />
                <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
                  {example.name}
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {example.callingCode}
                </span>
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  className="ml-auto shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>

              {/* That country's own example, from the same metadata the
                  generator validates against. Data, not copy — identical in
                  every language. */}
              <code className="rounded-lg bg-muted/60 px-2.5 py-1.5 font-mono text-xs text-muted-foreground tabular-nums">
                {example.international}
              </code>
            </Link>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        variants={revealUp}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="mt-6 rounded-xl border border-border bg-card p-4 shadow-card sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label className="mb-1.5 ml-1 block text-xs font-medium text-muted-foreground">
              {t('phoneGenerator.countryLabel')}
            </label>
            <CountrySelect selectedCountry={country} onSelectCountry={setCountry} />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-action px-5 text-[0.8125rem] font-semibold text-white shadow-card transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.98]"
          >
            <Phone size={15} aria-hidden="true" />
            {t('productLanding.phone.cta.primary')}
          </button>
        </div>

        <p className="mt-3 text-[0.8125rem] text-muted-foreground">
          {t('productLanding.phone.countries.all')}
        </p>
      </motion.div>
    </section>
  );
}
