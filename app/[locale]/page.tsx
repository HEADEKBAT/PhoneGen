import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import GenCoreHomePage from './home-client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'GenCore — Data Generation Platform for Developers',
  fr: 'GenCore — Plateforme de génération de données pour développeurs',
  es: 'GenCore — Plataforma de generación de datos para desarrolladores',
  pt: 'GenCore — Plataforma de geração de dados para desenvolvedores',
  de: 'GenCore — Datengenerierungsplattform für Entwickler',
  ru: 'GenCore — Платформа генерации данных для разработчиков',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'GenCore helps developers generate realistic, valid test data. Start with the Phone Generator — free, fast, and powered by libphonenumber-js for 85+ countries.',
  fr: 'GenCore aide les développeurs à générer des données de test réalistes et valides. Commencez par le générateur de numéros de téléphone — gratuit, rapide et alimenté par libphonenumber-js pour plus de 85 pays.',
  es: 'GenCore ayuda a los desarrolladores a generar datos de prueba realistas y válidos. Comience con el generador de números de teléfono — gratuito, rápido y con tecnología libphonenumber-js para más de 85 países.',
  pt: 'GenCore ajuda desenvolvedores a gerar dados de teste realistas e válidos. Comece com o gerador de números de telefone — grátis, rápido e com tecnologia libphonenumber-js para mais de 85 países.',
  de: 'GenCore hilft Entwicklern, realistische und gültige Testdaten zu generieren. Beginnen Sie mit dem Telefonnummern-Generator — kostenlos, schnell und unterstützt durch libphonenumber-js für über 85 Länder.',
  ru: 'GenCore помогает разработчикам генерировать реалистичные и валидные тестовые данные. Начните с генератора номеров телефона — бесплатно, быстро, на базе libphonenumber-js для 85+ стран.',
};

/**
 * Locale-aware metadata for the GenCore platform homepage.
 *
 * The homepage is accessible at /[locale] (e.g. /en, /fr).
 * Root URL (/) redirects here via the proxy.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const alternates = generateLocaleAlternates(locale, '');

  return {
    title,
    description,
    alternates,
  };
}

export default async function PlatformHomePage() {
  return <GenCoreHomePage />;
}
