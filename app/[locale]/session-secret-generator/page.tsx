import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Session Secret Generator — Secure Session Keys',
  'ru': 'Генератор секретов сессий — Безопасные ключи сессий',
  'de': 'Session-Secret-Generator — Sichere Sitzungsschlüssel',
  'es': 'Generador de secretos de sesión — Claves de sesión seguras',
  'fr': 'Générateur de secret de session — Clés de session sécurisées',
  'pt': 'Gerador de segredos de sessão — Chaves de sessão seguras',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate secure session signing secrets for web application cookies. Free client-side session secret generator.',
  'ru': 'Создавайте безопасные секреты сессий. Бесплатный генератор.',
  'de': 'Erstellen Sie sichere Sitzungsgeheimnisse. Kostenloser Generator.',
  'es': 'Cree secretos de sesión seguros. Generador gratuito.',
  'fr': 'Créez des secrets de session sécurisés. Générateur gratuit.',
  'pt': 'Crie segredos de sessão seguros. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/session-secret-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SessionSecretGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['session-secret-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
