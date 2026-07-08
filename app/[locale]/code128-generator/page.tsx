import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Code 128 Generator — Create High-Density Barcodes',
  'ru': 'Code 128 Generator — Create High-Density Barcodes',
  'de': 'Code 128 Generator — Create High-Density Barcodes',
  'es': 'Code 128 Generator — Create High-Density Barcodes',
  'fr': 'Code 128 Generator — Create High-Density Barcodes',
  'pt': 'Code 128 Generator — Create High-Density Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
  'ru': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
  'de': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
  'es': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
  'fr': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
  'pt': 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/code128-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['code128-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
