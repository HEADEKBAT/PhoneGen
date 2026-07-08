import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Code 93 Generator — Create Compact Industrial Barcodes',
  'ru': 'Code 93 Generator — Create Compact Industrial Barcodes',
  'de': 'Code 93 Generator — Create Compact Industrial Barcodes',
  'es': 'Code 93 Generator — Create Compact Industrial Barcodes',
  'fr': 'Code 93 Generator — Create Compact Industrial Barcodes',
  'pt': 'Code 93 Generator — Create Compact Industrial Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
  'ru': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
  'de': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
  'es': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
  'fr': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
  'pt': 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/code93-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['code93-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
