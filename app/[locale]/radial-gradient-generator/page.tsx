import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Radial Gradient Generator — CSS Radial Gradient Maker',
  fr: 'Générateur de dégradé radial — Créateur de dégradé radial CSS',
  es: 'Generador de degradado radial — Creador de degradado radial CSS',
  pt: 'Gerador de gradiente radial — Criador de gradiente radial CSS',
  de: 'Radialer Farbverlauf-Generator — CSS Radialverlauf-Editor',
  ru: 'Генератор радиального градиента — CSS конструктор радиальных градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free radial gradient generator. Create stunning CSS radial gradients with shape, size, and position controls. Multiple color stops with real-time preview.',
  fr: 'Générateur de dégradé radial gratuit. Créez de superbes dégradés radiaux CSS avec contrôles de forme, taille et position.',
  es: 'Generador de degradado radial gratuito. Cree impresionantes degradados radiales CSS con control de forma, tamaño y posición.',
  pt: 'Gerador de gradiente radial gratuito. Crie impressionantes gradientes radiais CSS com controle de forma, tamanho e posição.',
  de: 'Kostenloser radialer Farbverlauf-Generator. Erstellen Sie beeindruckende CSS-Radialverläufe mit Form-, Größen- und Positionssteuerung.',
  ru: 'Бесплатный генератор радиальных градиентов. Создавайте впечатляющие CSS радиальные градиенты с контролем формы, размера и позиции.',
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

export default async function RadialGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Radial Gradient Generator', href: `/${locale}/radial-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=radial`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=radial`}
        />
      </main>
    </div>
  );
}
