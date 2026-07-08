import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
  'ru': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
  'de': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
  'es': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
  'fr': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
  'pt': 'Check Digit Calculator — Calculate Barcode Check Digits Online',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
  'ru': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
  'de': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
  'es': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
  'fr': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
  'pt': 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/check-digit-calculator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['check-digit-calculator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
