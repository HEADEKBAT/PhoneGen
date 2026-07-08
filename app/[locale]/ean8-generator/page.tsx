import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
  'ru': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
  'de': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
  'es': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
  'fr': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
  'pt': 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
  'ru': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
  'de': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
  'es': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
  'fr': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
  'pt': 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/ean8-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['ean8-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
