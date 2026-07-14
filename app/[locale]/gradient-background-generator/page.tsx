import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Gradient Background Generator — Beautiful Gradient Backgrounds',
  fr: 'Générateur de fond dégradé — Beaux fonds d\'écran dégradés',
  es: 'Generador de fondos degradados — Hermosos fondos degradados',
  pt: 'Gerador de fundo gradiente — Lindos fundos gradientes',
  de: 'Farbverlauf-Hintergrund-Generator — Schöne Farbverlauf-Hintergründe',
  ru: 'Генератор градиентных фонов — Красивые градиентные фоны',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free gradient background generator. Create beautiful context-aware gradient backgrounds for landing pages, dashboards, and apps. Smart suggestions for every mood and context.',
  fr: 'Générateur de fond dégradé gratuit. Créez de beaux fonds dégradés adaptés au contexte pour pages d\'accueil, tableaux de bord et applications.',
  es: 'Generador de fondos degradados gratuito. Cree hermosos fondos degradados para páginas de inicio, paneles y aplicaciones.',
  pt: 'Gerador de fundo gradiente gratuito. Crie lindos fundos gradientes para páginas iniciais, painéis e aplicativos.',
  de: 'Kostenloser Farbverlauf-Hintergrund-Generator. Erstellen Sie schöne kontextbewusste Farbverlaufshintergründe.',
  ru: 'Бесплатный генератор градиентных фонов. Создавайте красивые контекстно-зависимые градиентные фоны.',
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

export default async function GradientBackgroundGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Gradient Background Generator', href: `/${locale}/gradient-background-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=background`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=background`}
        />
      </main>
    </div>
  );
}
