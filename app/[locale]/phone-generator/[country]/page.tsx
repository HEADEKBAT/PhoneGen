import { permanentRedirect, notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import { COUNTRIES } from '@/lib/phoneGenerator';

type Props = {
  params: Promise<{ locale: string; country: string }>;
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
 * Locale-aware metadata for a country-specific phone-generator page.
 *
 * Each country+locale combination gets:
 *  - A canonical URL (e.g. /en/phone-generator/US)
 *  - Hreflang alternates pointing to the same country in every locale
 *
 * When unique per-country content is added later, this page will render
 * it directly. For now it issues a permanent redirect to the main
 * phone-generator page with the country pre-selected via query param.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country } = await params;

  /* Return 404 for unknown country codes */
  if (!(country in COUNTRIES)) {
    return {};
  }

  const countryName = COUNTRIES[country]!.name;
  const title = `${TITLES[locale] || TITLES.en} — ${countryName}`;
  const description = `${DESCRIPTIONS[locale] || DESCRIPTIONS.en} Free generator for ${countryName}.`;
  const alternates = generateLocaleAlternates(locale, `/phone-generator/${country}`);

  return {
    title,
    description,
    alternates,
  };
}

/**
 * Country-specific phone-generator page.
 *
 * @phase 3 — Redirect-only. Future phases will add unique per-country
 * content (localised descriptions, statistics, carrier info).
 *
 * The redirect preserves the pre-selected country via `?country=` so the
 * client component's existing URL-param logic works unchanged.
 */
export default async function CountryPage({ params }: Props) {
  const { locale, country } = await params;

  if (!(country in COUNTRIES)) {
    notFound();
  }

  permanentRedirect(`/${locale}/phone-generator?country=${country}`);
}
