import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Conic Gradient Generator — CSS Conic Gradient Maker',
  fr: 'Générateur de dégradé conique — Créateur de dégradé conique CSS',
  es: 'Generador de degradado cónico — Creador de degradado cónico CSS',
  pt: 'Gerador de gradiente cônico — Criador de gradiente cônico CSS',
  de: 'Konischer Farbverlauf-Generator — CSS Konischverlauf-Editor',
  ru: 'Генератор конического градиента — CSS конструктор конических градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free conic gradient generator. Create stunning CSS conic gradients with angle, position controls, and multiple color stops. Perfect for pie charts and color wheels.',
  fr: 'Générateur de dégradé conique gratuit. Créez de superbes dégradés coniques CSS — idéal pour diagrammes circulaires et roues chromatiques.',
  es: 'Generador de degradado cónico gratuito. Cree impresionantes degradados cónicos CSS — perfecto para gráficos circulares y ruedas de color.',
  pt: 'Gerador de gradiente cônico gratuito. Crie impressionantes gradientes cônicos CSS — perfeito para gráficos de pizza e rodas de cores.',
  de: 'Kostenloser konischer Farbverlauf-Generator. Erstellen Sie beeindruckende CSS-Konischverläufe — perfekt für Tortendiagramme und Farbkreise.',
  ru: 'Бесплатный генератор конических градиентов. Создавайте впечатляющие CSS конические градиенты — идеально для круговых диаграмм и цветовых кругов.',
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

export default async function ConicGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Conic Gradient Generator', href: `/${locale}/conic-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=conic`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=conic`}
        />
      </main>
    </div>
  );
}
