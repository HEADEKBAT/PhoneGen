import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'UI Color Generator — Color Systems for User Interface Design',
  fr: 'Générateur de couleurs UI — Systèmes de couleurs pour le design d\'interface',
  es: 'Generador de colores UI — Sistemas de color para diseño de interfaces',
  pt: 'Gerador de cores UI — Sistemas de cores para design de interface',
  de: 'UI-Farbgenerator — Farbsysteme für das UI-Design',
  ru: 'Генератор цветов UI — Цветовые системы для дизайна интерфейсов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free UI color generator. Create accessible color systems for your user interfaces — 50-950 scales, semantic colors, light/dark themes, and Tailwind-ready tokens.',
  fr: 'Générateur de couleurs UI gratuit. Créez des systèmes de couleurs accessibles — échelles 50-950, couleurs sémantiques, thèmes clair/sombre, jetons Tailwind.',
  es: 'Generador de colores UI gratuito. Cree sistemas de color accesibles — escalas 50-950, colores semánticos, temas claro/oscuro, tokens Tailwind.',
  pt: 'Gerador de cores UI gratuito. Crie sistemas de cores acessíveis — escalas 50-950, cores semânticas, temas claro/escuro, tokens Tailwind.',
  de: 'Kostenloser UI-Farbgenerator. Erstellen Sie zugängliche Farbsysteme — 50-950 Skalen, semantische Farben, Hell-/Dunkelmodus, Tailwind-Tokens.',
  ru: 'Бесплатный генератор цветов UI. Создавайте доступные цветовые системы — шкалы 50-950, семантические цвета, светлые/тёмные темы, Tailwind-токены.',
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

export default async function UIColorGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'UI Color Generator', href: `/${locale}/ui-color-generator` },
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
