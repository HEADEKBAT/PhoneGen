'use client';

import Link from 'next/link';
import Flag from 'react-world-flags';
import { useTranslations } from '@/lib/i18n';
import { getCountry } from '@/lib/phoneGenerator';
import { getCountryName } from '@/lib/i18n/countryNames';

interface PopularCountriesProps {
  countryCodes: string[];
  locale: string;
  productSlug: string;
  toolTypeSlug?: string;
  heading?: string;
  /** URL pattern with `{code}` placeholder (e.g. `/${locale}/user-generator/tool?country={code}`) */
  hrefPattern?: string;
}

export default function PopularCountries({
  countryCodes,
  locale,
  productSlug,
  toolTypeSlug,
  heading,
  hrefPattern,
}: PopularCountriesProps) {
  const { t, language } = useTranslations();

  if (!countryCodes || countryCodes.length === 0) return null;

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  const defaultPattern = toolTypeSlug
    ? `/${locale}/${productSlug}/${toolTypeSlug}/{code}`
    : `/${locale}/${productSlug}/{code}`;

  const pattern = hrefPattern || defaultPattern;

  const hrefFor = (code: string) => pattern.replace('{code}', code);

  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {heading || t('productLanding.popularCountries')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {t('productLanding.popularCountriesDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {countryCodes.map((code) => {
            const country = getCountry(code);
            if (!country) return null;
            return (
              <Link
                key={code}
                href={hrefFor(code)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <div className="size-10 rounded-lg overflow-hidden ring-1 ring-border bg-background flex items-center justify-center">
                  <Flag
                    code={getCountryCode(country.code)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    title={getCountryName(t, language, country.code)}
                  />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                  {country.countryCode}
                </span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-1">
                  {getCountryName(t, language, country.code)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
