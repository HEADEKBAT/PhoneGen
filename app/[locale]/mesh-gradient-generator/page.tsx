import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Mesh Gradient Generator — Interactive Mesh Gradient Creator',
  fr: 'Générateur de dégradé mesh — Créateur de dégradé mesh interactif',
  es: 'Generador de degradado mesh — Creador de degradado mesh interactivo',
  pt: 'Gerador de gradiente mesh — Criador de gradiente mesh interativo',
  de: 'Mesh-Farbverlauf-Generator — Interaktiver Mesh-Verlaufs-Editor',
  ru: 'Генератор Mesh градиентов — Интерактивный конструктор сетчатых градиентов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free mesh gradient generator. Create stunning mesh gradients with draggable color points on an interactive canvas. Perfect for modern UI backgrounds and brand visuals.',
  fr: 'Générateur de dégradé mesh gratuit. Créez des dégradés mesh avec des points de couleur sur un canvas interactif.',
  es: 'Generador de degradado mesh gratuito. Cree degradados mesh con puntos de color en un lienzo interactivo.',
  pt: 'Gerador de gradiente mesh gratuito. Crie gradientes mesh com pontos de cor arrastáveis em uma tela interativa.',
  de: 'Kostenloser Mesh-Farbverlauf-Generator. Erstellen Sie Mesh-Verläufe mit ziehbaren Farbpunkten auf einer interaktiven Leinwand.',
  ru: 'Бесплатный генератор Mesh градиентов. Создавайте сетчатые градиенты с перетаскиваемыми цветовыми точками на интерактивном холсте.',
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

export default async function MeshGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Mesh Gradient Generator', href: `/${locale}/mesh-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=mesh`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=mesh`}
        />
      </main>
    </div>
  );
}
