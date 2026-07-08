import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'JWT Secret Generator — Create HMAC Signing Secrets',
  'ru': 'Генератор JWT секретов — Создайте секреты подписи HMAC',
  'de': 'JWT-Secret-Generator — Erstellen Sie HMAC-Signaturgeheimnisse',
  'es': 'Generador de secretos JWT — Cree secretos de firma HMAC',
  'fr': 'Générateur de secret JWT — Créez des secrets de signature',
  'pt': 'Gerador de segredos JWT — Crie segredos de assinatura',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate cryptographically strong JWT secrets for HS256 and other HMAC algorithms. Free client-side JWT secret generator.',
  'ru': 'Создавайте криптографически стойкие секреты JWT. Бесплатный генератор.',
  'de': 'Erstellen Sie kryptographisch starke JWT-Geheimnisse. Kostenloser Generator.',
  'es': 'Cree secretos JWT criptográficamente seguros. Generador gratuito.',
  'fr': 'Créez des secrets JWT cryptographiquement forts. Générateur gratuit.',
  'pt': 'Crie segredos JWT criptograficamente fortes. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/jwt-secret-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function JwtSecretGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['jwt-secret-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
