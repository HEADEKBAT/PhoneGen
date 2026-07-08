import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import {
  BarcodeHero,
  AudienceSection,
  SupportedStandards,
  UseCases,
  LearnSection,
  BarcodeFAQ,
  EcosystemSection,
} from '@/components/barcode';
import { CTASection } from '@/components/product-landing';
import {
  BARCODE_HERO,
  BARCODE_AUDIENCE,
  BARCODE_STANDARDS,
  BARCODE_USE_CASES,
  BARCODE_LEARN_ARTICLES,
  BARCODE_FAQS,
  BARCODE_ECOSYSTEM,
} from '@/lib/config/barcode';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Barcode Generator — Generate EAN-13, UPC, Code 128 & More',
  fr: 'Générateur de codes-barres — EAN-13, UPC, Code 128',
  es: 'Generador de códigos de barras — EAN-13, UPC, Code 128',
  pt: 'Gerador de códigos de barras — EAN-13, UPC, Code 128',
  de: 'Barcode-Generator — EAN-13, UPC, Code 128 & mehr',
  ru: 'Генератор штрихкодов — EAN-13, UPC, Code 128',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate professional barcodes — EAN-13, UPC-A, Code 128, ISBN, GTIN, and many more. Free online barcode generator with check digit calculation, validation, and SVG/PNG export.',
  fr: 'Générez des codes-barres professionnels — EAN-13, UPC-A, Code 128, ISBN, GTIN. Générateur gratuit.',
  es: 'Genere códigos de barras profesionales — EAN-13, UPC-A, Code 128, ISBN, GTIN. Generador gratuito.',
  pt: 'Gere códigos de barras profissionais — EAN-13, UPC-A, Code 128, ISBN, GTIN. Gerador gratuito.',
  de: 'Generieren Sie professionelle Barcodes — EAN-13, UPC-A, Code 128, ISBN, GTIN. Kostenlos.',
  ru: 'Генерируйте профессиональные штрихкоды — EAN-13, UPC-A, Code 128, ISBN, GTIN. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('barcode')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function BarcodeGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Barcode Generator', href: `/${locale}/barcode-generator` },
        ]}
      />

      <main className="flex-1">
        {/* 1. Hero */}
        <BarcodeHero hero={BARCODE_HERO} locale={locale} />

        {/* 2. Who Is It For */}
        <AudienceSection audience={BARCODE_AUDIENCE} />

        {/* 3. Supported Standards */}
        <SupportedStandards standards={BARCODE_STANDARDS} locale={locale} />

        {/* 4. Use Cases */}
        <UseCases useCases={BARCODE_USE_CASES} locale={locale} />

        {/* 5. Learn */}
        <LearnSection articles={BARCODE_LEARN_ARTICLES} />

        {/* 6. FAQ */}
        <BarcodeFAQ faqs={BARCODE_FAQS} />

        {/* 7. Ecosystem */}
        <EcosystemSection links={BARCODE_ECOSYSTEM} locale={locale} />

        {/* 8. CTA */}
        <CTASection
          labelKey="Open Barcode Studio"
          href={`/${locale}/barcode-generator/tool`}
        />
      </main>
    </div>
  );
}
