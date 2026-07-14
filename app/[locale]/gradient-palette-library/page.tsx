import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Gradient Palette Library — Collection of 200+ Curated Gradients',
  fr: 'Bibliothèque de palettes de dégradés — 200+ dégradés organisés',
  es: 'Biblioteca de paletas de degradados — 200+ degradados seleccionados',
  pt: 'Biblioteca de paletas de gradientes — 200+ gradientes selecionados',
  de: 'Farbverlauf-Palettenbibliothek — 200+ kuratierte Farbverläufe',
  ru: 'Библиотека градиентных палитр — 200+ тщательно отобранных градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free gradient palette library. Browse 200+ curated gradients across 25 categories — minimal, corporate, tech, nature, cyberpunk, and more. Search, filter, and save your favorites.',
  fr: 'Bibliothèque de dégradés gratuite. Parcourez 200+ dégradés organisés en 25 catégories. Recherchez, filtrez et sauvegardez vos favoris.',
  es: 'Biblioteca de degradados gratuita. Explore 200+ degradados en 25 categorías. Busque, filtre y guarde sus favoritos.',
  pt: 'Biblioteca de gradientes gratuita. Navegue por 200+ gradientes em 25 categorias. Pesquise, filtre e salve seus favoritos.',
  de: 'Kostenlose Farbverlauf-Bibliothek. Durchsuchen Sie 200+ kuratierte Farbverläufe in 25 Kategorien.',
  ru: 'Бесплатная библиотека градиентов. 200+ тщательно отобранных градиентов в 25 категориях.',
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

export default async function GradientPaletteLibraryLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Gradient Palette Library', href: `/${locale}/gradient-palette-library` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=collections`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=collections`}
        />
      </main>
    </div>
  );
}
