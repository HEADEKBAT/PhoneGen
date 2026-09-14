import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ProductHero,
  FeatureGrid,
  ExampleSection,
  FAQSection,
  CTASection,
} from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Username Generator',
  fr: 'Générateur de nom d\'utilisateur',
  es: 'Generador de nombres de usuario',
  pt: 'Gerador de nome de usuário',
  de: 'Benutzernamen-Generator',
  ru: 'Генератор имен пользователей',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate unique usernames in 7 styles: classic, modern, developer, gaming, professional, corporate, and random. Free online username generator.',
  fr: 'Générez des noms d\'utilisateur uniques en 7 styles. Générateur gratuit.',
  es: 'Genere nombres de usuario únicos en 7 estilos. Generador gratuito.',
  pt: 'Gere nomes de usuário únicos em 7 estilos. Gerador gratuito.',
  de: 'Generieren Sie einzigartige Benutzernamen in 7 Stilen. Kostenloser Generator.',
  ru: 'Генерируйте уникальные имена пользователей в 7 стилях. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('username')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function UsernameGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const config = getProductLandingConfig('username');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Username Generator', href: `/${locale}/username-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/username-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="johndoe_42"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/username-generator/tool`}
        />
      </main>
    </div>
  );
}
