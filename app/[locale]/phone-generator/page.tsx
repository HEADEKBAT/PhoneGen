import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import PhoneGeneratorClient from './client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Phone Generator — Generate Valid Phone Numbers',
  fr: 'Générateur de numéros de téléphone — Numéros valides',
  es: 'Generador de números de teléfono — Números válidos',
  pt: 'Gerador de números de telefone — Números válidos',
  de: 'Telefonnummern-Generator — Gültige Nummern',
  ru: 'Генератор номеров телефона — Валидные номера',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 85+ countries with international, national, and E.164 formats.',
  fr: 'Générez des numéros de téléphone valides qui passent la validation libphonenumber-js. Générateur gratuit pour plus de 85 pays.',
  es: 'Genere números de teléfono válidos que pasen la validación de libphonenumber-js. Generador gratuito para más de 85 países.',
  pt: 'Gere números de telefone válidos que passam na validação libphonenumber-js. Gerador gratuito para mais de 85 países.',
  de: 'Generieren Sie gültige Telefonnummern, die die libphonenumber-js-Validierung bestehen. Kostenloser Generator für über 85 Länder.',
  ru: 'Генерируйте валидные номера телефонов, проходящие проверку libphonenumber-js. Бесплатный генератор для 85+ стран.',
};

/**
 * Locale-aware metadata for the phone-generator page.
 * Each locale gets its own canonical URL and hreflang alternates
 * pointing to the equivalent page in every other locale.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const alternates = generateLocaleAlternates(locale, '/phone-generator');

  return {
    title,
    description,
    alternates,
  };
}

export default async function PhoneGeneratorPage() {
  return <PhoneGeneratorClient />;
}
