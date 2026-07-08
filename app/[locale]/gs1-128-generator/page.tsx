import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
  'ru': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
  'de': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
  'es': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
  'fr': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
  'pt': 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
  'ru': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
  'de': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
  'es': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
  'fr': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
  'pt': 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/gs1-128-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['gs1-128-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
