import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Passphrase Generator — Memorable XKCD-Style Passphrases',
  'ru': 'Генератор кодовых фраз — Запоминающиеся фразы-пароли',
  'de': 'Passphrasen-Generator — Einprägsame XKCD-Phrasen',
  'es': 'Generador de frases de contraseña — Frases memorables',
  'fr': 'Générateur de phrases de passe — Phrases mémorables',
  'pt': 'Gerador de frases secretas — Frases memoráveis',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate memorable passphrases using random word lists. More secure than traditional passwords and easier to remember. Free passphrase generator.',
  'ru': 'Создавайте запоминающиеся кодовые фразы. Бесплатный генератор.',
  'de': 'Erstellen Sie einprägsame Passphrasen. Kostenloser Generator.',
  'es': 'Cree frases de contraseña memorables. Generador gratuito.',
  'fr': 'Créez des phrases de passe mémorables. Générateur gratuit.',
  'pt': 'Crie frases secretas memoráveis. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/passphrase-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function PassphraseGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['passphrase-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
