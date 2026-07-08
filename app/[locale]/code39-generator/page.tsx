import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Code 39 Generator — Create Alphanumeric Barcodes',
  'ru': 'Code 39 Generator — Create Alphanumeric Barcodes',
  'de': 'Code 39 Generator — Create Alphanumeric Barcodes',
  'es': 'Code 39 Generator — Create Alphanumeric Barcodes',
  'fr': 'Code 39 Generator — Create Alphanumeric Barcodes',
  'pt': 'Code 39 Generator — Create Alphanumeric Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
  'ru': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
  'de': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
  'es': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
  'fr': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
  'pt': 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/code39-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['code39-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
