import { type Metadata } from 'next';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config';
import { BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOPage from '@/components/barcode/BarcodeSEOPage';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  'en': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
  'ru': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
  'de': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
  'es': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
  'fr': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
  'pt': 'Codabar Generator — Create Library &amp; Blood Bank Barcodes',
};

const DESCRIPTIONS: Record<string, string> = {
  'en': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
  'ru': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
  'de': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
  'es': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
  'fr': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
  'pt': 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/codabar-generator',
    title,
    description,
  } satisfies SEOCustomPage);
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  const config = BARCODE_SEO_PAGES['codabar-generator'];
  return (
    <BarcodeSEOPage
      locale={locale}
      config={config}
      title={TITLES[locale] || TITLES.en}
      description={DESCRIPTIONS[locale] || DESCRIPTIONS.en}
    />
  );
}
