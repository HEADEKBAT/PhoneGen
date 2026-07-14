import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Linear Gradient Generator — CSS Linear Gradient Maker',
  fr: 'Générateur de dégradé linéaire — Créateur de dégradé linéaire CSS',
  es: 'Generador de degradado lineal — Creador de degradado lineal CSS',
  pt: 'Gerador de gradiente linear — Criador de gradiente linear CSS',
  de: 'Linearer Farbverlauf-Generator — CSS Linearverlauf-Editor',
  ru: 'Генератор линейного градиента — CSS конструктор линейных градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free linear gradient generator. Create beautiful CSS linear gradients with multiple color stops, angle control, and real-time preview. Export to CSS, Tailwind, and SVG.',
  fr: 'Générateur de dégradé linéaire gratuit. Créez de superbes dégradés linéaires CSS avec contrôles d\'angle et prévisualisation en direct.',
  es: 'Generador de degradado lineal gratuito. Cree hermosos degradados lineales CSS con control de ángulo y vista previa en vivo.',
  pt: 'Gerador de gradiente linear gratuito. Crie belos gradientes lineares CSS com controle de ângulo e pré-visualização em tempo real.',
  de: 'Kostenloser linearer Farbverlauf-Generator. Erstellen Sie schöne CSS-Linearverläufe mit Winkelsteuerung und Live-Vorschau.',
  ru: 'Бесплатный генератор линейных градиентов. Создавайте красивые CSS линейные градиенты с контролем угла и предпросмотром.',
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

export default async function LinearGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Linear Gradient Generator', href: `/${locale}/linear-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=linear`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=classic&type=linear`}
        />
      </main>
    </div>
  );
}
