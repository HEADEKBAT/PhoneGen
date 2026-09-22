'use client';

import Link from 'next/link';
import Flag from 'react-world-flags';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from '@/lib/i18n';
import { getCountry } from '@/lib/phoneGenerator';
import { getCountryName } from '@/lib/i18n/countryNames';
import { REVEAL_VIEWPORT, revealCard, stagger } from '@/components/home/motion';
import LandingSection from './LandingSection';

interface PopularCountriesProps {
  countryCodes: string[];
  locale: string;
  productSlug: string;
  toolTypeSlug?: string;
  heading?: string;
  /** URL pattern with `{code}` placeholder (e.g. `/${locale}/user-generator/tool?country={code}`) */
  hrefPattern?: string;
}

/** The dozen countries most people arrive looking for, as a row of flags. */
export default function PopularCountries({
  countryCodes,
  locale,
  productSlug,
  toolTypeSlug,
  heading,
  hrefPattern,
}: PopularCountriesProps) {
  const { t, language } = useTranslations();
  const reduced = useReducedMotion();

  if (!countryCodes || countryCodes.length === 0) return null;

  /* "UK" is not an ISO 3166-1 code; the flag set files that flag under GB. */
  const getCountryCode = (code: string) => (code === 'UK' ? 'GB' : code);

  const defaultPattern = toolTypeSlug
    ? `/${locale}/${productSlug}/${toolTypeSlug}/{code}`
    : `/${locale}/${productSlug}/{code}`;

  const pattern = hrefPattern || defaultPattern;
  const hrefFor = (code: string) => pattern.replace('{code}', code);

  return (
    <LandingSection
      tone="muted"
      title={heading || t('productLanding.popularCountries')}
      note={t('productLanding.popularCountriesDesc')}
    >
      <motion.ul
        variants={stagger(0.03)}
        initial={reduced ? false : 'hidden'}
        whileInView="shown"
        viewport={REVEAL_VIEWPORT}
        className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      >
        {countryCodes.map((code) => {
          const country = getCountry(code);
          if (!country) return null;
          const name = getCountryName(t, language, country.code);

          return (
            <motion.li key={code} variants={revealCard} className="list-none">
              <Link
                href={hrefFor(code)}
                className="group flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 shadow-card transition-colors duration-200 hover:border-action/40"
              >
                <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-background ring-1 ring-border">
                  <Flag
                    code={getCountryCode(country.code)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    title={name}
                  />
                </span>
                <span className="text-center text-xs font-medium leading-tight text-foreground transition-colors group-hover:text-action">
                  {country.countryCode}
                </span>
                <span className="line-clamp-1 text-center text-[10px] leading-tight text-muted-foreground">
                  {name}
                </span>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>
    </LandingSection>
  );
}
