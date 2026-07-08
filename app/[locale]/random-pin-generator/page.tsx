import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { SEO_PAGES } from '@/lib/config/credentialSEOPages';
import SEOLandingPage from '@/components/credential-landing/SEOLandingTemplate';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Random PIN Generator — Create Secure Numeric Codes',
  'ru': 'Генератор PIN-кодов — Создайте безопасные числовые коды',
  'de': 'PIN-Generator — Erstellen Sie sichere Zahlencodes',
  'es': 'Generador de PIN — Cree códigos numéricos seguros',
  'fr': 'Générateur de PIN — Créez des codes numériques sécurisés',
  'pt': 'Gerador de PIN — Crie códigos numéricos seguros',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate random numeric PIN codes with configurable length (4-8 digits). Free client-side PIN generator for ATM, mobile, and access codes.',
  'ru': 'Создавайте случайные PIN-коды. Бесплатный генератор.',
  'de': 'Erstellen Sie zufällige PIN-Codes. Kostenloser Generator.',
  'es': 'Cree códigos PIN aleatorios. Generador gratuito.',
  'fr': 'Créez des codes PIN aléatoires. Générateur gratuit.',
  'pt': 'Crie códigos PIN aleatórios. Gerador gratuito.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/random-pin-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function RandomPinGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const config = SEO_PAGES['random-pin-generator'];
  return <SEOLandingPage locale={locale} config={config} />;
}
