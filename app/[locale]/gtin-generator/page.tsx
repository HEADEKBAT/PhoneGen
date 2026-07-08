import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'GTIN Generator — Create Global Trade Item Numbers',
  'ru': 'GTIN Generator — Create Global Trade Item Numbers',
  'de': 'GTIN Generator — Create Global Trade Item Numbers',
  'es': 'GTIN Generator — Create Global Trade Item Numbers',
  'fr': 'GTIN Generator — Create Global Trade Item Numbers',
  'pt': 'GTIN Generator — Create Global Trade Item Numbers',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
  'ru': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
  'de': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
  'es': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
  'fr': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
  'pt': 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/gtin-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['gtin-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
