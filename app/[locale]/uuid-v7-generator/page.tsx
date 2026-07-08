import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'UUID v7 Generator — Time-Ordered UUIDs (RFC 9562)',
  'ru': 'Генератор UUID v7 — Упорядоченные по времени UUID',
  'de': 'UUID-v7-Generator — Zeitlich geordnete UUIDs',
  'es': 'Generador de UUID v7 — UUID ordenados por tiempo',
  'fr': 'Générateur d’UUID v7 — UUID ordonnés dans le temps',
  'pt': 'Gerador de UUID v7 — UUIDs ordenados por tempo',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate time-ordered UUID v7 identifiers per RFC 9562. Sortable by creation time. Free client-side UUID v7 generator.',
  'ru': 'Создавайте упорядоченные по времени UUID v7. Бесплатный генератор.',
  'de': 'Erstellen Sie zeitlich geordnete UUID v7. Kostenloser Generator.',
  'es': 'Cree UUID v7 ordenados por tiempo. Generador gratuito.',
  'fr': 'Créez des UUID v7 ordonnés dans le temps. Générateur gratuit.',
  'pt': 'Crie UUIDs v7 ordenados por tempo. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/uuid-v7-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function UuidV7GeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['uuid-v7-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
