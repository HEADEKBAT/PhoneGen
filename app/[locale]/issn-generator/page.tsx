import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'ISSN Generator — Create Serial Publication Barcodes',
  'ru': 'ISSN Generator — Create Serial Publication Barcodes',
  'de': 'ISSN Generator — Create Serial Publication Barcodes',
  'es': 'ISSN Generator — Create Serial Publication Barcodes',
  'fr': 'ISSN Generator — Create Serial Publication Barcodes',
  'pt': 'ISSN Generator — Create Serial Publication Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
  'ru': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
  'de': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
  'es': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
  'fr': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
  'pt': 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/issn-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['issn-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
