import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { isSupportedRegion } from '@/lib/countryRegistry';
import { LOCALES } from '@/lib/config';
import { generatePhonePageMetadata } from '@/lib/generatePhoneMetadata';
import { getCountryDisplayName, getT } from '@/lib/i18n/server';
import { PhoneGeneratorLoader } from '@/components/dynamic';
import Breadcrumb from '@/components/Breadcrumb';
import CountryPageHeader from './header';
import CountryFacts from './facts';
import CountryRelated from './related';

type Props = {
  params: Promise<{ locale: string; country: string }>;
};

/**
 * Pre-build every locale + country combination for SEO.
 * All ~245 libphonenumber regions × 6 locales = ~1470 pages.
 */
export async function generateStaticParams() {
  // We import dynamically so this only runs at build time,
  // not on every request.
  const { getAllRegionCodes } = await import('@/lib/countryRegistry');
  const regions = getAllRegionCodes();

  const params: { locale: string; country: string }[] = [];
  for (const locale of LOCALES) {
    for (const country of regions) {
      params.push({ locale, country });
    }
  }
  return params;
}

/**
 * Locale + country specific SEO metadata.
 *
 * Each combination gets unique title, description, canonical URL,
 * hreflang alternates pointing to the SAME country in every locale,
 * plus OpenGraph and Twitter cards.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;
  const upper = country.toUpperCase();

  if (!isSupportedRegion(upper)) {
    return {};
  }

  const seo = generatePhonePageMetadata(locale, upper);

  return {
    title: seo.title,
    description: seo.description,
    alternates: seo.alternates,
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  };
}

/**
 * Country-specific phone generator page.
 *
 * The country is passed as a prop to the client component — no searchParams,
 * no redirects. The URL is the single source of truth.
 *
 * Everything around the tool is server-rendered. The tool itself is deferred
 * (`ssr: false`) because it pulls in the whole generator, and for a long time
 * that meant the entire page was: 1470 URLs whose HTML held a skeleton and
 * nothing else. The heading, the numbering-plan facts and the links to other
 * countries are all rendered here instead, so the page answers its own search
 * query before a line of JavaScript runs.
 */
export default async function CountryPhonePage({ params }: Props) {
  const { locale, country } = await params;
  const upper = country.toUpperCase();

  if (!isSupportedRegion(upper)) {
    notFound();
  }

  const t = getT(locale);
  const name = getCountryDisplayName(locale, upper);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('phoneGenerator.pageTitle'), href: `/${locale}/phone-generator` },
          { label: name, href: `/${locale}/phone-generator/${upper}` },
        ]}
      />

      <main className="flex-1">
        <CountryPageHeader locale={locale} country={upper} />
        <PhoneGeneratorLoader country={upper} locale={locale} />
        <CountryFacts locale={locale} country={upper} />
        <CountryRelated locale={locale} country={upper} />
      </main>
    </div>
  );
}
