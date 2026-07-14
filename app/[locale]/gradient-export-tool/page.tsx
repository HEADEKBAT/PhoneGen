import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Gradient Export Tool — Export Gradients to CSS, SVG, Tailwind & More',
  fr: 'Outil d\'export de dégradés — Exportez en CSS, SVG, Tailwind et plus',
  es: 'Herramienta de exportación de degradados — Exporte a CSS, SVG, Tailwind y más',
  pt: 'Ferramenta de exportação de gradientes — Exporte para CSS, SVG, Tailwind e mais',
  de: 'Farbverlauf-Export-Tool — Export nach CSS, SVG, Tailwind uvm.',
  ru: 'Инструмент экспорта градиентов — Экспорт в CSS, SVG, Tailwind и другие',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free gradient export tool. Export your gradients to 10+ formats: CSS, Tailwind CSS, SVG, JSON, React, Vue, SCSS, LESS, and Style Dictionary. Perfect for developers and designers.',
  fr: 'Outil d\'export gratuit. Exportez vos dégradés en 10+ formats: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS et Style Dictionary.',
  es: 'Herramienta de exportación gratuita. Exporte sus degradados a 10+ formatos: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS y Style Dictionary.',
  pt: 'Ferramenta de exportação gratuita. Exporte seus gradientes para 10+ formatos: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS e Style Dictionary.',
  de: 'Kostenloses Export-Tool. Exportieren Sie Farbverläufe in 10+ Formate: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS und Style Dictionary.',
  ru: 'Бесплатный инструмент экспорта. Экспортируйте градиенты в 10+ форматов: CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS и Style Dictionary.',
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

export default async function GradientExportToolLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Gradient Export Tool', href: `/${locale}/gradient-export-tool` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=export`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=export`}
        />
      </main>
    </div>
  );
}
