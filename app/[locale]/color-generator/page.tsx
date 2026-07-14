import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Color Studio — Professional Color Palette & Gradient Generator',
  fr: 'Color Studio — Générateur de palettes de couleurs et dégradés',
  es: 'Color Studio — Generador de paletas de colores y degradados',
  pt: 'Color Studio — Gerador de paletas de cores e gradientes',
  de: 'Color Studio — Farbpaletten- und Verlaufsgenerator',
  ru: 'Color Studio — Генератор цветовых палитр и градиентов',
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

export default async function ColorStudioLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Color Studio', href: `/${locale}/color-generator` },
        ]}
      />

      <main className="flex-1">
        {/* 1. Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool`}
        />

        {/* 2. Features */}
        <FeatureGrid features={config.features} />

        {/* 3. FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* 4. CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool`}
        />
      </main>
    </div>
  );
}
