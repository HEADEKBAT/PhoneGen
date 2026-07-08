import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Webhook Secret Generator — Create Signing Secrets',
  'ru': 'Генератор секретов вебхуков — Создайте секреты подписи',
  'de': 'Webhook-Secret-Generator — Erstellen Sie Signaturgeheimnisse',
  'es': 'Generador de secretos de webhook — Cree secretos de firma',
  'fr': 'Générateur de secret webhook — Créez des secrets de signature',
  'pt': 'Gerador de segredos de webhook — Crie segredos de assinatura',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate secure webhook signing secrets for verifying incoming webhook payloads. Free client-side webhook secret generator.',
  'ru': 'Создавайте безопасные секреты подписи вебхуков. Бесплатный генератор.',
  'de': 'Erstellen Sie sichere Webhook-Signaturgeheimnisse. Kostenloser Generator.',
  'es': 'Cree secretos de firma de webhook seguros. Generador gratuito.',
  'fr': 'Créez des secrets de signature webhook sécurisés. Générateur gratuit.',
  'pt': 'Crie segredos de assinatura de webhook seguros. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/webhook-secret-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function WebhookSecretGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['webhook-secret-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
