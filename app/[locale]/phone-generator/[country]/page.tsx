import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { isSupportedRegion } from '@/lib/countryRegistry';
import { LOCALES } from '@/lib/config';
import { generatePhonePageMetadata } from '@/lib/generatePhoneMetadata';
import { PhoneGeneratorLoader } from '@/components/dynamic';

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
 */
export default async function CountryPhonePage({ params }: Props) {
  const { locale, country } = await params;
  const upper = country.toUpperCase();

  if (!isSupportedRegion(upper)) {
    notFound();
  }

  return <PhoneGeneratorLoader country={upper} locale={locale} />;
}
