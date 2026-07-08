import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'ITF-14 Generator — Create Shipping Carton Barcodes',
  'ru': 'ITF-14 Generator — Create Shipping Carton Barcodes',
  'de': 'ITF-14 Generator — Create Shipping Carton Barcodes',
  'es': 'ITF-14 Generator — Create Shipping Carton Barcodes',
  'fr': 'ITF-14 Generator — Create Shipping Carton Barcodes',
  'pt': 'ITF-14 Generator — Create Shipping Carton Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
  'ru': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
  'de': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
  'es': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
  'fr': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
  'pt': 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/itf14-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['itf14-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
