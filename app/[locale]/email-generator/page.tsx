import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Email Generator — Create Realistic Email Addresses',
  fr: 'Générateur d\'email',
  es: 'Generador de emails',
  pt: 'Gerador de email',
  de: 'E-Mail-Generator',
  ru: 'Генератор email',
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
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('email')}
      crumb={{ label: t('products.email.title'), href: `/${locale}/email-generator` }}
      ctaHref={`/${locale}/email-generator/tool`}
      example={`user@example.com`}
    />
  );
}
