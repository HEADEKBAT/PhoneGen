import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import {
  getHeroSymbol,
  getPayloadSamples,
  CONTENT_TYPE_COUNT,
} from '@/lib/qr/landingSamples';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { QRHero, QRPayloads, QRChecks } from '@/components/qr-landing';
import { LandingClosing, LandingFaq } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'QR Code Generator',
  fr: 'Générateur de QR Code',
  es: 'Generador de Códigos QR',
  pt: 'Gerador de QR Code',
  de: 'QR-Code-Generator',
  ru: 'Генератор QR-кодов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate custom QR codes for URLs, Wi-Fi, vCard, email, social media, and 37 data types. Free online QR code generator with designer, logo upload, and multiple export formats.',
  fr: 'Générez des codes QR personnalisés pour les URL, Wi-Fi, vCard, email, réseaux sociaux et 37 types de données. Générateur gratuit avec designer et export.',
  es: 'Genere códigos QR personalizados para URL, Wi-Fi, vCard, email, redes sociales y 37 tipos de datos. Generador gratuito con diseñador y exportación.',
  pt: 'Gere códigos QR personalizados para URLs, Wi-Fi, vCard, email, redes sociais e 37 tipos de dados. Gerador gratuito com designer e exportação.',
  de: 'Generieren Sie individuelle QR-Codes für URLs, WLAN, vCard, E-Mail, soziale Medien und 37 Datentypen. Kostenloser Generator mit Designer und Export.',
  ru: 'Создавайте кастомные QR-коды для URL, Wi-Fi, vCard, email, соцсетей и 37 типов данных. Бесплатный генератор с дизайнером, логотипом и экспортом.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('qr')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function QRCodeGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('qr');

  /* Encoded here, by the same code the studio runs. The hero shows a symbol a
     phone can read off the screen; the cards below show the literal text each
     kind of code carries. Neither can drift from the product, because neither
     is written down anywhere. */
  const symbol = getHeroSymbol();
  const samples = getPayloadSamples();

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          /* Was the literal string 'QR Code Generator', in all six languages,
             next to a sibling crumb that used the dictionary. */
          { label: t('products.qr.title'), href: `/${locale}/qr-generator` },
        ]}
      />

      <main className="flex-1">
        <QRHero locale={locale} symbol={symbol} typeCount={CONTENT_TYPE_COUNT} />

        <QRPayloads samples={samples} />

        <QRChecks />

        <LandingFaq faqs={config.faqs} />

        <LandingClosing
          titleKey="qrLanding.closing.title"
          bodyKey="qrLanding.closing.body"
          ctaKey="qrLanding.cta.primary"
          href={`/${locale}/qr-generator/tool`}
        />
      </main>
    </div>
  );
}

/*
 * Three sections are gone.
 *
 * The feature grid listed five cards — multiple content types, custom design,
 * logo support — which describe a QR generator rather than this one. The
 * example section printed the sentence "QR Code with Wi-Fi, vCard, URL, and
 * 30+ content types" inside a `<code>` block with a copy button, so the thing
 * it offered to put on your clipboard was a marketing line; it was also
 * hardcoded English on a site that serves six languages. Both are replaced by
 * the payload cards, which show the actual encoded text for eighteen types.
 *
 * The generic hero is replaced by one containing a working QR code.
 */
