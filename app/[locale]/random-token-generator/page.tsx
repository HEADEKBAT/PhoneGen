import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Random Token Generator — Auth Tokens & One-Time Codes',
  'ru': 'Генератор случайных токенов — Токены авторизации',
  'de': 'Token-Generator — Auth-Tokens und Einmalcodes',
  'es': 'Generador de tokens aleatorios — Tokens de autenticación',
  'fr': 'Générateur de jetons aléatoires — Jetons d’authentification',
  'pt': 'Gerador de tokens aleatórios — Tokens de autenticação',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate cryptographically random tokens in hex, base64, and base64url formats. Free client-side token generator.',
  'ru': 'Создавайте криптографически случайные токены. Бесплатный генератор.',
  'de': 'Erstellen Sie kryptographisch zufällige Tokens. Kostenloser Generator.',
  'es': 'Cree tokens aleatorios criptográficamente. Generador gratuito.',
  'fr': 'Créez des jetons aléatoires cryptographiquement. Générateur gratuit.',
  'pt': 'Crie tokens aleatórios criptograficamente. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/random-token-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function RandomTokenGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['random-token-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
