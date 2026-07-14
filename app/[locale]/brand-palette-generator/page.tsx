import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Brand Palette Generator — Create Brand Color Palettes Online',
  fr: 'Générateur de palette de marque — Créez des palettes de couleurs de marque',
  es: 'Generador de paletas de marca — Cree paletas de colores de marca en línea',
  pt: 'Gerador de paletas de marca — Crie paletas de cores de marca online',
  de: 'Markenfarbpaletten-Generator — Erstellen Sie Markenfarbpaletten online',
  ru: 'Генератор палитр бренда — Создавайте цветовые палитры бренда онлайн',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free brand palette generator. Create professional brand color palettes — explore harmonious schemes, preview brand personalities, and export to CSS/Tailwind.',
  fr: 'Générateur de palette de marque gratuit. Créez des palettes professionnelles — explorez des harmonies, prévisualisez des personnalités de marque, exportez.',
  es: 'Generador de paletas de marca gratuito. Cree paletas de colores profesionales — explore armonías, previsualice personalidades de marca, exporte.',
  pt: 'Gerador de paletas de marca gratuito. Crie paletas de cores profissionais — explore harmonias, visualize personalidades de marca, exporte.',
  de: 'Kostenloser Markenfarbpaletten-Generator. Erstellen Sie professionelle Farbpaletten — erkunden Sie Harmonien, Markenpersönlichkeiten, Export.',
  ru: 'Бесплатный генератор палитр бренда. Создавайте профессиональные цветовые палитры — исследуйте гармонии, характеристики бренда, экспорт.',
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

export default async function BrandPaletteGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Brand Palette Generator', href: `/${locale}/brand-palette-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=brands`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=brands`}
        />
      </main>
    </div>
  );
}
