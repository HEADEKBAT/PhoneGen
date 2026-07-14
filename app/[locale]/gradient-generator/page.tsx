import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Gradient Generator — Modern CSS Gradient Maker',
  fr: 'Générateur de dégradés — Créateur de dégradés CSS moderne',
  es: 'Generador de degradados — Creador moderno de degradados CSS',
  pt: 'Gerador de gradientes — Criador moderno de gradientes CSS',
  de: 'Farbverlauf-Generator — Moderner CSS-Verlaufs-Editor',
  ru: 'Генератор градиентов — Современный CSS конструктор градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free modern gradient generator. Create linear, radial, conic, mesh, and aurora gradients with multiple color stops, blend modes, and noise. Export to CSS, Tailwind, SVG, and more.',
  fr: 'Générateur de dégradés gratuit. Créez des dégradés linéaires, radiaux, coniques, mesh et aurora. Exportez en CSS, Tailwind, SVG et plus.',
  es: 'Generador de degradados gratuito. Cree degradados lineales, radiales, cónicos, mesh y aurora. Exporte a CSS, Tailwind, SVG y más.',
  pt: 'Gerador de gradientes gratuito. Crie gradientes lineares, radiais, cônicos, mesh e aurora. Exporte para CSS, Tailwind, SVG e mais.',
  de: 'Kostenloser Farbverlauf-Generator. Erstellen Sie lineare, radiale, konische, Mesh- und Aurora-Verläufe. Export nach CSS, Tailwind, SVG uvm.',
  ru: 'Бесплатный генератор градиентов. Создавайте линейные, радиальные, конические, mesh и aurora градиенты. Экспорт в CSS, Tailwind, SVG и другие.',
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

export default async function GradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Gradient Generator', href: `/${locale}/gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient`}
        />
      </main>
    </div>
  );
}
