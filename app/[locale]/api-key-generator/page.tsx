import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'API Key Generator — Create Test API Keys Online',
  'ru': 'Генератор API ключей — Создайте тестовые ключи API',
  'de': 'API-Key-Generator — Erstellen Sie Test-API-Schlüssel',
  'es': 'Generador de claves API — Cree claves de prueba',
  'fr': 'Générateur de clés API — Créez des clés de test',
  'pt': 'Gerador de chaves de API — Crie chaves de teste',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate realistic API keys for testing. Supports Stripe-style, GitHub-style prefixes, and more. Free client-side API key generator.',
  'ru': 'Создавайте реалистичные ключи API. Бесплатный генератор.',
  'de': 'Erstellen Sie realistische API-Schlüssel. Kostenloser Generator.',
  'es': 'Cree claves API realistas. Generador gratuito.',
  'fr': 'Créez des clés API réalistes. Générateur gratuit.',
  'pt': 'Crie chaves de API realistas. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/api-key-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function ApiKeyGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['api-key-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
