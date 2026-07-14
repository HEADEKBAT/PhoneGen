import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Design System Generator — Build Complete Design Systems Online',
  fr: 'Générateur de systèmes de design — Créez des systèmes complets en ligne',
  es: 'Generador de sistemas de diseño — Cree sistemas completos en línea',
  pt: 'Gerador de sistemas de design — Crie sistemas completos online',
  de: 'Design-System-Generator — Erstellen Sie komplette Design-Systeme online',
  ru: 'Генератор дизайн-систем — Создавайте полные дизайн-системы онлайн',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free online design system generator. Build complete design systems from one color — color scales, semantic tokens, light/dark themes, and developer-ready exports.',
  fr: 'Générateur de systèmes de design gratuit. Créez des systèmes complets à partir d\'une couleur — échelles, jetons sémantiques, thèmes clair/sombre, exports développeur.',
  es: 'Generador de sistemas de diseño gratuito. Cree sistemas completos desde un color — escalas, tokens semánticos, temas claro/oscuro, exportaciones para desarrolladores.',
  pt: 'Gerador de sistemas de design gratuito. Crie sistemas completos a partir de uma cor — escalas, tokens semânticos, temas claro/escuro, exportações para desenvolvedores.',
  de: 'Kostenloser Design-System-Generator. Erstellen Sie komplette Design-Systeme aus einer Farbe — Farbskalen, semantische Tokens, Hell-/Dunkelmodus, Entwickler-Exports.',
  ru: 'Бесплатный генератор дизайн-систем. Создавайте полные дизайн-системы из одного цвета — цветовые шкалы, семантические токены, светлые/тёмные темы, экспорт для разработчиков.',
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

export default async function DesignSystemGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Design System Generator', href: `/${locale}/design-system-generator` },
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
