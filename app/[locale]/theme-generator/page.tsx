import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Theme Generator — Create Complete Design Systems from One Color',
  fr: 'Générateur de thèmes — Créez des systèmes de design complets à partir d\'une couleur',
  es: 'Generador de temas — Cree sistemas de diseño completos desde un color',
  pt: 'Gerador de temas — Crie sistemas de design completos a partir de uma cor',
  de: 'Theme Generator — Erstellen Sie komplette Design-Systeme aus einer Farbe',
  ru: 'Генератор тем — Создавайте полные дизайн-системы из одного цвета',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free online theme generator. Create a complete design system from a single color — 50-950 scales, semantic colors, light/dark themes with WCAG accessibility.',
  fr: 'Générateur de thèmes gratuit. Créez un système de design complet à partir d\'une seule couleur — échelles 50-950, couleurs sémantiques, thèmes clair/sombre.',
  es: 'Generador de temas gratuito. Cree un sistema de diseño completo desde un solo color — escalas 50-950, colores semánticos, temas claro/oscuro.',
  pt: 'Gerador de temas gratuito. Crie um sistema de design completo a partir de uma única cor — escalas 50-950, cores semânticas, temas claro/escuro.',
  de: 'Kostenloser Theme-Generator. Erstellen Sie ein komplettes Design-System aus einer Farbe — 50-950 Skalen, semantische Farben, Hell-/Dunkelmodus.',
  ru: 'Бесплатный генератор тем. Создайте полную дизайн-систему из одного цвета — шкалы 50-950, семантические цвета, светлая/тёмная темы.',
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

export default async function ThemeGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Theme Generator', href: `/${locale}/theme-generator` },
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
