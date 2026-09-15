import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRelatedCountries, type RelatedCountry } from '@/lib/phone/related';
import { getT } from '@/lib/i18n/server';

/**
 * Links out of a country page.
 *
 * Every one of these URLs used to be a dead end — it carried the long-tail
 * search intent, ranked for it, and then offered no way onward that a crawler
 * could follow, because the only navigation was a `<select>`.
 *
 * The first group is the regions on the same calling code, which is a real
 * fact about numbering rather than a related-links box: on a United States
 * page it is the rest of the North American Numbering Plan, and on a French
 * page it is empty and does not render at all.
 */
export default function CountryRelated({
  locale,
  country,
}: {
  locale: string;
  country: string;
}) {
  const t = getT(locale);
  const { sameCode, popular, callingCode } = getRelatedCountries(locale, country);

  if (sameCode.length === 0 && popular.length === 0) return null;

  return (
    <section className="border-t border-border bg-muted/20">
      <nav
        aria-label={t('phoneCountry.related.title')}
        className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6"
      >
        <div className="relative mb-4 border-b border-border pb-2.5">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            {t('phoneCountry.related.title')}
          </h2>
          <span
            aria-hidden="true"
            className="absolute -bottom-px left-0 h-0.5 w-9 rounded-full bg-action"
          />
        </div>

        {sameCode.length > 0 && (
          <Group
            label={t('phoneCountry.related.sameCode', { code: callingCode })}
            countries={sameCode}
            locale={locale}
          />
        )}

        {popular.length > 0 && (
          <Group
            label={t('phoneCountry.related.popular')}
            countries={popular}
            locale={locale}
          />
        )}

        <Link
          href={`/${locale}/phone-generator#countries`}
          className="group mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-action"
        >
          {t('phoneCountry.related.all')}
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </nav>
    </section>
  );
}

function Group({
  label,
  countries,
  locale,
}: {
  label: string;
  countries: RelatedCountry[];
  locale: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <h3 className="mb-2 font-mono text-[0.6875rem] tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      <ul className="flex list-none flex-wrap gap-2 p-0">
        {countries.map((country) => (
          <li key={country.iso} className="list-none">
            <Link
              href={`/${locale}/phone-generator/${country.iso}`}
              className="inline-flex items-baseline gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[0.8125rem] text-foreground transition-colors duration-200 hover:border-action/40 hover:text-action"
            >
              {country.name}
              <span className="font-mono text-[0.6875rem] text-muted-foreground">
                {country.callingCode}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
