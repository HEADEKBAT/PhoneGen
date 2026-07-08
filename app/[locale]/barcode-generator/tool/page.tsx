import { type Metadata } from 'next';
import BarcodeStudioClient from '@/components/barcode/BarcodeStudioClient';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Barcode Studio — Free Online Barcode Generator & Creator',
  fr: 'Barcode Studio — Générateur de codes-barres gratuit en ligne',
  es: 'Barcode Studio — Generador de códigos de barras gratuito',
  pt: 'Barcode Studio — Gerador de códigos de barras gratuito',
  de: 'Barcode Studio — Kostenloser Online-Barcode-Generator',
  ru: 'Barcode Studio — Бесплатный онлайн генератор штрихкодов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Create, validate, and export professional barcodes — EAN-13, UPC, Code 128, ISBN, and more. Free online barcode studio with live preview, check digit calculator, and bulk generation.',
  fr: 'Créez, validez et exportez des codes-barres professionnels — EAN-13, UPC, Code 128, ISBN. Studio gratuit avec aperçu en direct.',
  es: 'Cree, valide y exporte códigos de barras profesionales — EAN-13, UPC, Code 128, ISBN. Estudio gratuito con vista previa en vivo.',
  pt: 'Crie, valide e exporte códigos de barras profissionais — EAN-13, UPC, Code 128, ISBN. Estúdio gratuito com pré-visualização.',
  de: 'Erstellen, validieren und exportieren Sie professionelle Barcodes — EAN-13, UPC, Code 128, ISBN. Kostenloses Studio mit Live-Vorschau.',
  ru: 'Создавайте, проверяйте и экспортируйте профессиональные штрихкоды — EAN-13, UPC, Code 128, ISBN. Бесплатная студия с предпросмотром.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('barcode')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function BarcodeStudioToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Barcode Generator', href: `/${locale}/barcode-generator` },
          { label: 'Barcode Studio', href: `/${locale}/barcode-generator/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Barcode Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <BarcodeStudioClient />
      </main>
    </div>
  );
}
