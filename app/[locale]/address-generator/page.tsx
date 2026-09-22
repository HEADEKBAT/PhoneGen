import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Address Generator',
  fr: 'Générateur d\'adresses',
  es: 'Generador de direcciones',
  pt: 'Gerador de endereços',
  de: 'Adressgenerator',
  ru: 'Генератор адресов',
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
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('address')}
      crumb={{ label: t('products.address.title'), href: `/${locale}/address-generator` }}
      ctaHref={`/${locale}/address-generator/tool`}
      example={`123 Main St, New York, NY 10001, United States`}
      productSlug={'address-generator'}
      countriesHref={`/${locale}/address-generator/tool?country={code}`}
    />
  );
}
