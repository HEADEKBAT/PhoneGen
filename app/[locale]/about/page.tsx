import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import AboutClient from './client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'About PhoneGen — Valid Phone Number Generator',
  fr: 'À propos de PhoneGen — Générateur de numéros de téléphone valides',
  es: 'Acerca de PhoneGen — Generador de números de teléfono válidos',
  pt: 'Sobre o PhoneGen — Gerador de números de telefone válidos',
  de: 'Über PhoneGen — Generator für gültige Telefonnummern',
  ru: 'О PhoneGen — Генератор валидных номеров телефонов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'PhoneGen generates valid phone numbers that pass libphonenumber-js validation. Free, fast, and supports 85+ countries. Learn more about the tool.',
  fr: 'PhoneGen génère des numéros de téléphone valides qui passent la validation libphonenumber-js. Gratuit, rapide et prend en charge plus de 85 pays.',
  es: 'PhoneGen genera números de teléfono válidos que pasan la validación de libphonenumber-js. Gratuito, rápido y compatible con más de 85 países.',
  pt: 'O PhoneGen gera números de telefone válidos que passam na validação libphonenumber-js. Grátis, rápido e compatível com mais de 85 países.',
  de: 'PhoneGen generiert gültige Telefonnummern, die die libphonenumber-js-Validierung bestehen. Kostenlos, schnell und unterstützt über 85 Länder.',
  ru: 'PhoneGen генерирует валидные номера телефонов, проходящие проверку libphonenumber-js. Бесплатно, быстро, поддерживает 85+ стран.',
};

/**
 * Locale-aware metadata for the about page.
 *
 * Each locale gets its own canonical URL and hreflang alternates
 * pointing to the equivalent page in every other locale.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const alternates = generateLocaleAlternates(locale, '/about');

  return {
    title,
    description,
    alternates,
  };
}

export default async function AboutPage() {
  return <AboutClient />;
}
