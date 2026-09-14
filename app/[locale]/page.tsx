import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOHomePage } from '@/lib/config/seo';
import { getT } from '@/lib/i18n/server';
import GenCoreHomePage from './home-client';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Locale-aware metadata for the GenCore platform homepage.
 *
 * The title and description are resolved here rather than inside the SEO
 * registry: `lib/config/seo` is re-exported to client components, so it must
 * never import the server dictionary (that shipped all six locale JSONs into
 * every client bundle). This page is a Server Component, so it can.
 *
 * The brand is appended once, by the `title.template` in the locale layout.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);

  return seoGenerateMetadata({
    type: 'home',
    locale,
    title: t('platformHome.meta.title'),
    description: t('platformHome.meta.description'),
  } satisfies SEOHomePage);
}

export default async function PlatformHomePage() {
  return <GenCoreHomePage />;
}
