import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Password Generator — Create Strong Random Passwords',
  'ru': 'Генератор паролей — Создайте надежные случайные пароли',
  'de': 'Passwort-Generator — Erstellen Sie starke Zufallspasswörter',
  'es': 'Generador de contraseñas — Cree contraseñas seguras',
  'fr': 'Générateur de mots de passe — Créez des mots de passe forts',
  'pt': 'Gerador de senhas — Crie senhas fortes e aleatórias',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate strong, secure random passwords with configurable length, character types, and complexity. Free client-side password generator.',
  'ru': 'Создавайте надежные случайные пароли с настраиваемой длиной и сложностью. Бесплатный генератор паролей.',
  'de': 'Erstellen Sie starke, sichere Zufallspasswörter. Kostenloser Passwort-Generator.',
  'es': 'Cree contraseñas seguras con longitud y tipos de caracteres configurables. Generador gratuito.',
  'fr': 'Créez des mots de passe forts et sécurisés. Générateur gratuit.',
  'pt': 'Crie senhas fortes e seguras. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/password-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function PasswordGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['password-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
