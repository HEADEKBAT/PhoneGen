import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Tailwind Theme Generator — Create Tailwind CSS Color Configurations',
  fr: 'Générateur de thème Tailwind — Créez des configurations de couleurs Tailwind CSS',
  es: 'Generador de temas Tailwind — Cree configuraciones de color Tailwind CSS',
  pt: 'Gerador de temas Tailwind — Crie configurações de cores Tailwind CSS',
  de: 'Tailwind-Theme-Generator — Erstellen Sie Tailwind-CSS-Farbkonfigurationen',
  ru: 'Генератор тем Tailwind — Создавайте конфигурации цветов Tailwind CSS',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free Tailwind theme generator. Create complete Tailwind CSS v4 color configurations from one color — 50-950 scales, semantic tokens, and ready-to-export config.',
  fr: 'Générateur de thème Tailwind gratuit. Créez des configurations Tailwind CSS v4 complètes — échelles 50-950, jetons sémantiques, export prêt à l\'emploi.',
  es: 'Generador de temas Tailwind gratuito. Cree configuraciones Tailwind CSS v4 completas — escalas 50-950, tokens semánticos, exportación lista.',
  pt: 'Gerador de temas Tailwind gratuito. Crie configurações Tailwind CSS v4 completas — escalas 50-950, tokens semânticos, exportação pronta.',
  de: 'Kostenloser Tailwind-Theme-Generator. Erstellen Sie komplette Tailwind-CSS-v4-Farbkonfigurationen — 50-950 Skalen, semantische Tokens, exportfertig.',
  ru: 'Бесплатный генератор тем Tailwind. Создавайте полные конфигурации цветов Tailwind CSS v4 — шкалы 50-950, семантические токены, готовый экспорт.',
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

export default async function TailwindThemeGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Tailwind Theme Generator', href: `/${locale}/tailwind-theme-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=theme`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=theme`}
        />
      </main>
    </div>
  );
}
