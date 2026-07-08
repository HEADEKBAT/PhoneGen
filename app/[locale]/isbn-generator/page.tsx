import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
  'ru': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
  'de': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
  'es': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
  'fr': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
  'pt': 'ISBN Generator — Create Book Barcodes (ISBN-13 &amp; ISBN-10)',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
  'ru': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
  'de': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
  'es': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
  'fr': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
  'pt': 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/isbn-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['isbn-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
