import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
  'ru': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
  'de': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
  'es': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
  'fr': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
  'pt': 'UPC Generator — Create UPC-A &amp; UPC-E Barcodes Online',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
  'ru': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
  'de': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
  'es': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
  'fr': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
  'pt': 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/upc-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['upc-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
