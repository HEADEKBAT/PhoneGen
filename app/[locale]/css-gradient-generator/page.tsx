import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'CSS Gradient Generator — Generate CSS Gradient Code Online',
  fr: 'Générateur de dégradé CSS — Générer du code de dégradé CSS en ligne',
  es: 'Generador de degradado CSS — Genere código de degradado CSS en línea',
  pt: 'Gerador de gradiente CSS — Gere código de gradiente CSS online',
  de: 'CSS-Verlauf-Generator — CSS-Verlaufscode online erstellen',
  ru: 'CSS генератор градиентов — Создавайте CSS код градиентов онлайн',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free CSS gradient generator. Generate clean CSS gradient code with multiple formats including linear, radial, conic, and repeating gradients. Export with Tailwind, SVG, and React support.',
  fr: 'Générateur de dégradé CSS gratuit. Générez du code de dégradé CSS avec export Tailwind, SVG et React.',
  es: 'Generador de degradado CSS gratuito. Genere código de degradado CSS con exportación a Tailwind, SVG y React.',
  pt: 'Gerador de gradiente CSS gratuito. Gere código de gradiente CSS com exportação para Tailwind, SVG e React.',
  de: 'Kostenloser CSS-Verlauf-Generator. Generieren Sie sauberen CSS-Verlaufscode mit Export nach Tailwind, SVG und React.',
  ru: 'Бесплатный CSS генератор градиентов. Создавайте чистый CSS код градиентов с экспортом в Tailwind, SVG и React.',
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

export default async function CssGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'CSS Gradient Generator', href: `/${locale}/css-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient&sub=export&format=css`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient&sub=export&format=css`}
        />
      </main>
    </div>
  );
}
