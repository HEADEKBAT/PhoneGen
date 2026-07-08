import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'UUID Generator — Create Unique Identifiers Online',
  'ru': 'Генератор UUID — Создайте уникальные идентификаторы',
  'de': 'UUID-Generator — Erstellen Sie eindeutige Identifikatoren',
  'es': 'Generador de UUID — Cree identificadores únicos',
  'fr': 'Générateur d’UUID — Créez des identifiants uniques',
  'pt': 'Gerador de UUID — Crie identificadores únicos',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate random UUID v4 identifiers for use as database primary keys, API identifiers, and distributed system identifiers. Free client-side UUID generator.',
  'ru': 'Создавайте случайные UUID v4. Бесплатный генератор.',
  'de': 'Erstellen Sie zufällige UUID v4. Kostenloser Generator.',
  'es': 'Cree UUID v4 aleatorios. Generador gratuito.',
  'fr': 'Créez des UUID v4 aléatoires. Générateur gratuit.',
  'pt': 'Crie UUIDs v4 aleatórios. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/uuid-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function UuidGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['uuid-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
