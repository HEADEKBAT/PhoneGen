import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Aurora Gradient Generator — Dreamy Aurora Background Creator',
  fr: 'Générateur de dégradé aurora — Créateur de fond aurora',
  es: 'Generador de degradado aurora — Creador de fondos aurora',
  pt: 'Gerador de gradiente aurora — Criador de fundo aurora',
  de: 'Aurora-Farbverlauf-Generator — Verträumter Aurora-Hintergrund-Editor',
  ru: 'Генератор Aurora градиентов — Создатель атмосферных фонов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free aurora gradient generator. Create dreamy multi-layer aurora backgrounds with 15+ presets. Customize colors, blur, position, and animation for stunning visual effects.',
  fr: 'Générateur de dégradé aurora gratuit. Créez des fonds aurora multicouches avec 15+ styles prédéfinis.',
  es: 'Generador de degradado aurora gratuito. Cree fondos aurora multicapa con 15+ estilos predefinidos.',
  pt: 'Gerador de gradiente aurora gratuito. Crie fundos aurora multicamadas com 15+ estilos predefinidos.',
  de: 'Kostenloser Aurora-Farbverlauf-Generator. Erstellen Sie mehrschichtige Aurora-Hintergründe mit über 15 Voreinstellungen.',
  ru: 'Бесплатный генератор Aurora градиентов. Создавайте многослойные фоны с 15+ готовыми стилями.',
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

export default async function AuroraGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Aurora Gradient Generator', href: `/${locale}/aurora-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=aurora`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=aurora`}
        />
      </main>
    </div>
  );
}
