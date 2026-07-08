import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOHomePage } from '@/lib/config/seo';
import GenCoreHomePage from './home-client';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Locale-aware metadata for the GenCore platform homepage.
 *
 * Uses the centralized SEO registry.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return seoGenerateMetadata({ type: 'home', locale } satisfies SEOHomePage);
}

export default async function PlatformHomePage() {
  return <GenCoreHomePage />;
}
