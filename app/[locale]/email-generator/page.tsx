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
  en: 'Email Generator — Create Realistic Email Addresses',
  fr: 'Générateur d\'email — Créez des adresses email réalistes',
  es: 'Generador de emails — Cree direcciones de correo realistas',
  pt: 'Gerador de email — Crie endereços de email realistas',
  de: 'E-Mail-Generator — Erstellen Sie realistische E-Mail-Adressen',
  ru: 'Генератор email — Создавайте реалистичные email адреса',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic email addresses in 5 modes. Free online email generator for developers — random, professional, corporate, disposable, and nickname.',
  fr: 'Générez des adresses email réalistes en 5 modes. Générateur gratuit pour les développeurs.',
  es: 'Genere direcciones de correo electrónico realistas en 5 modos. Generador gratuito para desarrolladores.',
  pt: 'Gere endereços de email realistas em 5 modos. Gerador gratuito para desenvolvedores.',
  de: 'Generieren Sie realistische E-Mail-Adressen in 5 Modi. Kostenloser Generator für Entwickler.',
  ru: 'Генерируйте реалистичные email адреса в 5 режимах. Бесплатный генератор для разработчиков.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('email')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function EmailGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const config = getProductLandingConfig('email');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Email Generator', href: `/${locale}/email-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/email-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="user@example.com"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/email-generator/tool`}
        />
      </main>
    </div>
  );
}
