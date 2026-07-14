import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Smart Gradient Generator — AI-Powered Gradient Suggestions',
  fr: 'Générateur de dégradé intelligent — Suggestions de dégradés par IA',
  es: 'Generador de degradado inteligente — Sugerencias de degradados por IA',
  pt: 'Gerador de gradiente inteligente — Sugestões de gradiente por IA',
  de: 'Intelligenter Farbverlauf-Generator — KI-gestützte Verlaufsvorschläge',
  ru: 'Умный генератор градиентов — Предложения градиентов с ИИ',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free smart gradient generator. Describe your desired gradient in natural language and get instant matching suggestions. Type "warm sunset" or "dark cyberpunk" and find the perfect gradient.',
  fr: 'Générateur intelligent gratuit. Décrivez votre dégradé en langage naturel et obtenez des suggestions instantanées.',
  es: 'Generador inteligente gratuito. Describa su degradado en lenguaje natural y obtenga sugerencias instantáneas.',
  pt: 'Gerador inteligente gratuito. Descreva seu gradiente em linguagem natural e obtenha sugestões instantâneas.',
  de: 'Kostenloser intelligenter Farbverlauf-Generator. Beschreiben Sie Ihren Wunschverlauf und erhalten Sie sofort passende Vorschläge.',
  ru: 'Бесплатный умный генератор градиентов. Опишите желаемый градиент на естественном языке и получите мгновенные предложения.',
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

export default async function SmartGradientGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Smart Gradient Generator', href: `/${locale}/smart-gradient-generator` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=gradient`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=gradient`}
        />
      </main>
    </div>
  );
}
