import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
  'ru': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
  'de': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
  'es': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
  'fr': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
  'pt': 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
  'ru': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
  'de': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
  'es': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
  'fr': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
  'pt': 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/ean13-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['ean13-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
