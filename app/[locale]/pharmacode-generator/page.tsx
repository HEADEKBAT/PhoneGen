import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
  'ru': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
  'de': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
  'es': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
  'fr': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
  'pt': 'Pharmacode Generator — Create Pharmaceutical Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
  'ru': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
  'de': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
  'es': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
  'fr': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
  'pt': 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/pharmacode-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['pharmacode-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
