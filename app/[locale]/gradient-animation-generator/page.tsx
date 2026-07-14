import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Gradient Animation Generator — Animated CSS Gradient Maker',
  fr: 'Générateur d\'animation de dégradé — Créateur d\'animation CSS dégradé',
  es: 'Generador de animación de degradado — Creador de animación CSS degradada',
  pt: 'Gerador de animação de gradiente — Criador de animação CSS gradiente',
  de: 'Farbverlauf-Animation-Generator — Animierter CSS-Verlaufs-Editor',
  ru: 'Генератор анимации градиента — Создатель анимированных CSS градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free animated gradient generator. Create stunning CSS gradient animations with 9 animation types. Control speed, direction, timing, and export ready-to-use CSS keyframes.',
  fr: 'Générateur d\'animation de dégradé gratuit. Créez des animations CSS avec 9 types d\'animation, contrôles de vitesse et export.',
  es: 'Generador de animación de degradado gratuito. Cree animaciones CSS con 9 tipos, control de velocidad y exportación.',
  pt: 'Gerador de animação de gradiente gratuito. Crie animações CSS com 9 tipos, controle de velocidade e exportação.',
  de: 'Kostenloser Farbverlauf-Animation-Generator. Erstellen Sie CSS-Verlaufsanimationen mit 9 Animationsarten und Export.',
  ru: 'Бесплатный генератор анимации градиентов. Создавайте CSS анимацию с 9 типами, контролем скорости и экспортом.',
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

export default async function GradientAnimationGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Gradient Animation Generator', href: `/${locale}/gradient-animation-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=animation`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=animation`}
        />
      </main>
    </div>
  );
}
