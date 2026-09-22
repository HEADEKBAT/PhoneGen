import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Color Generator — Palettes & Converters',
  fr: 'Générateur de couleurs — palettes et conversion',
  es: 'Generador de colores — paletas y conversión',
  pt: 'Gerador de cores — paletas e conversão',
  de: 'Farbgenerator — Paletten und Konverter',
  ru: 'Генератор цветов — палитры и конвертеры',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Professional color toolkit — palettes, gradients, converters, WCAG accessibility checks, and developer exports. Free online color studio.',
  fr: 'Boîte à outils couleur professionnelle — palettes, dégradés, convertisseurs, vérification d\'accessibilité WCAG. Studio gratuit.',
  es: 'Kit de herramientas de color profesional — paletas, degradados, convertidores, verificación de accesibilidad WCAG. Estudio gratuito.',
  pt: 'Kit de ferramentas de cores profissional — paletas, gradientes, conversores, verificação de acessibilidade WCAG. Estúdio gratuito.',
  de: 'Professionelles Farbset — Paletten, Verläufe, Konverter, WCAG-Barrierefreiheitsprüfung. Kostenloses Studio.',
  ru: 'Профессиональный набор цветовых инструментов — палитры, градиенты, конвертеры, проверка доступности WCAG. Бесплатная студия.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('color')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function ColorGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('color')}
      crumb={{ label: t('products.color.title'), href: `/${locale}/color-generator` }}
      ctaHref={`/${locale}/color-generator/tool`}
    />
  );
}
