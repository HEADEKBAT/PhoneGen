/**
 * Localized SEO metadata for phone-generator country pages.
 *
 * Each (locale, country) combination gets unique, localized title,
 * description, OpenGraph, Twitter, canonical and hreflang tags.
 *
 * Uses Intl.DisplayNames for country name localization — no manual
 * translation tables.
 */

import { getLocalizedCountryName } from './countryRegistry';
import { generateLocaleAlternates, BASE_URL } from './seo';

/* ── Title templates per locale ─────────────────────────────────────── */

const TITLE_TEMPLATES: Record<string, (name: string) => string> = {
  en: (name) => `Random ${name} Phone Number Generator`,
  ru: (name) => `Генератор номеров телефона ${name}`,
  fr: (name) => `Générateur de numéros de téléphone ${name}`,
  de: (name) => `${name} Telefonnummern Generator`,
  es: (name) => `Generador de números de teléfono ${name}`,
  pt: (name) => `Gerador de números de telefone ${name}`,
};

/* ── Description templates per locale ───────────────────────────────── */

const DESC_TEMPLATES: Record<string, (name: string) => string> = {
  en: (name) =>
    `Generate valid ${name} phone numbers for testing, QA and development. Free online generator with international, national and E.164 formats.`,
  ru: (name) =>
    `Генерируйте валидные номера телефонов ${name} для тестирования, QA и разработки. Бесплатный онлайн-генератор с международным и локальным форматами.`,
  fr: (name) =>
    `Générez des numéros de téléphone ${name} valides pour les tests, le QA et le développement. Générateur en ligne gratuit avec formats international et national.`,
  de: (name) =>
    `Generieren Sie gültige ${name}-Telefonnummern für Tests, QA und Entwicklung. Kostenloser Online-Generator mit internationalen und nationalen Formaten.`,
  es: (name) =>
    `Genere números de teléfono ${name} válidos para pruebas, control de calidad y desarrollo. Generador en línea gratuito con formatos internacional y nacional.`,
  pt: (name) =>
    `Gere números de telefone ${name} válidos para testes, QA e desenvolvimento. Gerador online gratuito com formatos internacional e nacional.`,
};

/* ── Public API ─────────────────────────────────────────────────────── */

export interface PhonePageMetadata {
  title: string;
  description: string;
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  openGraph: {
    title: string;
    description: string;
    locale: string;
    siteName: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
}

/**
 * Generate full SEO metadata for a phone-generator country page.
 *
 * @param locale   Current page locale (e.g. "en", "ru")
 * @param country  ISO 3166-1 Alpha-2 country code (e.g. "US", "DE")
 * @param product  Product slug (default: "phone-generator")
 */
export function generatePhonePageMetadata(
  locale: string,
  country: string,
  product: string = 'phone-generator',
): PhonePageMetadata {
  const name = getLocalizedCountryName(locale, country);
  const title = (TITLE_TEMPLATES[locale] || TITLE_TEMPLATES.en)(name);
  const description =
    (DESC_TEMPLATES[locale] || DESC_TEMPLATES.en)(name);
  const alternates = generateLocaleAlternates(
    locale,
    `/${product}/${country}`,
  );

  const ogLocale =
    locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`;

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      locale: ogLocale,
      siteName: 'GenCore',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}
