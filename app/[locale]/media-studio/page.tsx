import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import {
  MediaHero,
  MediaCapabilities,
  MediaHow,
  MediaFaq,
  MediaClosing,
} from '@/components/media-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Free Online Video Tools — Media Studio',
  fr: 'Outils vidéo en ligne — Media Studio',
  es: 'Herramientas de vídeo online — Media Studio',
  pt: 'Ferramentas de vídeo online — Media Studio',
  de: 'Online-Videotools — Media Studio',
  ru: 'Онлайн-инструменты для видео — Media Studio',
};

/* The old ones listed "resize and edit", which the studio does not do, and
   read as a feature list rather than a sentence someone would click. */
const DESCRIPTIONS: Record<string, string> = {
  en: 'Convert, compress and repackage video in your browser. Files and m3u8 links, no upload, no account, no watermark.',
  fr: 'Convertissez, compressez et réencapsulez vos vidéos dans le navigateur. Fichiers et liens m3u8, sans téléversement ni compte.',
  es: 'Convierta, comprima y reempaquete vídeo en el navegador. Archivos y enlaces m3u8, sin subidas y sin cuenta.',
  pt: 'Converta, comprima e reempacote vídeo no navegador. Arquivos e links m3u8, sem upload e sem cadastro.',
  de: 'Video im Browser umwandeln, komprimieren und umpacken. Dateien und m3u8-Links, ohne Upload, ohne Konto.',
  ru: 'Конвертируйте, сжимайте и перепаковывайте видео в браузере. Файлы и ссылки m3u8, без загрузки и без регистрации.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('media')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function MediaStudioLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('media');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Media Studio', href: `/${locale}/media-studio` },
        ]}
      />

      <main className="flex-1">
        <MediaHero />
        <MediaCapabilities />
        <MediaHow />
        <MediaFaq faqs={config.faqs} />
        <MediaClosing />
      </main>
    </div>
  );
}
