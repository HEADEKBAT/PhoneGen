import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ProductHero,
  PopularCountries,
  FeatureGrid,
  ExampleSection,
  FAQSection,
  CTASection,
} from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Address Generator — Generate Realistic Addresses Worldwide',
  fr: 'Générateur d\'adresses — Créez des adresses réalistes dans le monde entier',
  es: 'Generador de direcciones — Cree direcciones realistas en todo el mundo',
  pt: 'Gerador de endereços — Crie endereços realistas em todo o mundo',
  de: 'Adressgenerator — Erstellen Sie realistische Adressen weltweit',
  ru: 'Генератор адресов — Создавайте реалистичные адреса по всему миру',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic addresses for 20+ countries. Includes street, city, postal code, region, and full address. Free online address generator for developers.',
  fr: 'Générez des adresses réalistes pour plus de 20 pays. Rue, ville, code postal, région et adresse complète. Générateur gratuit.',
  es: 'Genere direcciones realistas para más de 20 países. Incluye calle, ciudad, código postal, región y dirección completa. Generador gratuito.',
  pt: 'Gere endereços realistas para mais de 20 países. Inclui rua, cidade, código postal, região e endereço completo. Gerador gratuito.',
  de: 'Generieren Sie realistische Adressen für über 20 Länder. Inklusive Straße, Stadt, Postleitzahl, Region und vollständiger Adresse. Kostenlos.',
  ru: 'Генерируйте реалистичные адреса для 20+ стран. Улица, город, почтовый индекс, регион и полный адрес. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('address')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function AddressGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const config = getProductLandingConfig('address');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Address Generator', href: `/${locale}/address-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/address-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Popular Countries */}
        {config.popularCountryCodes && (
          <PopularCountries
            countryCodes={config.popularCountryCodes}
            locale={locale}
            productSlug="address-generator"
            heading={config.popularCountriesDescKey}
            hrefPattern={`/${locale}/address-generator/tool?country={code}`}
          />
        )}

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="123 Main St, New York, NY 10001, United States"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/address-generator/tool`}
        />
      </main>
    </div>
  );
}
