import { type Metadata } from 'next';
import { QRStudioLoader } from '@/components/dynamic';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'QR Studio — Free Online QR Code Generator & Designer',
  fr: 'QR Studio — Générateur et designer de codes QR gratuit en ligne',
  es: 'QR Studio — Generador y diseñador de códigos QR gratuito',
  pt: 'QR Studio — Gerador e designer de códigos QR grátis',
  de: 'QR Studio — Kostenloser Online-QR-Code-Generator & Designer',
  ru: 'QR Studio — Бесплатный онлайн генератор и дизайнер QR-кодов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Create, customize, and export professional QR codes — URLs, Wi-Fi, vCard, email, SMS, social media, and 30+ content types. Free online QR studio with live preview, logo upload, and multiple export formats.',
  fr: 'Créez, personnalisez et exportez des codes QR professionnels — URL, Wi-Fi, vCard, email, SMS, réseaux sociaux et plus de 30 types de contenu. Studio gratuit avec aperçu en direct.',
  es: 'Cree, personalice y exporte códigos QR profesionales — URL, Wi-Fi, vCard, email, SMS, redes sociales y más de 30 tipos de contenido. Estudio gratuito con vista previa en vivo.',
  pt: 'Crie, personalize e exporte códigos QR profissionais — URLs, Wi-Fi, vCard, email, SMS, redes sociais e mais de 30 tipos de conteúdo. Estúdio gratuito com pré-visualização.',
  de: 'Erstellen, anpassen und exportieren Sie professionelle QR-Codes — URLs, WLAN, vCard, E-Mail, SMS, soziale Medien und über 30 Inhaltstypen. Kostenloses Studio mit Live-Vorschau.',
  ru: 'Создавайте, настраивайте и экспортируйте профессиональные QR-коды — URL, Wi-Fi, vCard, email, SMS, соцсети и 30+ типов контента. Бесплатная студия с предпросмотром.',
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

export default async function QRStudioToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'QR Code Generator', href: `/${locale}/qr-generator` },
          { label: 'QR Studio', href: `/${locale}/qr-generator/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            QR Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <QRStudioLoader />
      </main>
    </div>
  );
}
