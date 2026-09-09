import { type Metadata } from 'next';
import { MediaStudioLoader } from '@/components/dynamic';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Media Studio — Free Online Video Converter, Compressor & Editor',
  fr: 'Media Studio — Convertisseur, compresseur et éditeur vidéo gratuit en ligne',
  es: 'Media Studio — Conversor, compresor y editor de vídeo gratuito en línea',
  pt: 'Media Studio — Conversor, compressor e editor de vídeo gratuito online',
  de: 'Media Studio — Kostenloser Online-Videokonverter, -kompressor und -editor',
  ru: 'Media Studio — Бесплатный онлайн-конвертер, компрессор и редактор видео',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Professional video processing toolkit — convert, compress, resize, and edit video files. Free online media studio powered by FFmpeg.wasm — all in your browser.',
  fr: 'Boîte à outils professionnelle de traitement vidéo — convertir, compresser, redimensionner et éditer des vidéos. Studio gratuit en ligne avec FFmpeg.wasm.',
  es: 'Kit de herramientas profesional de procesamiento de vídeo — convertir, comprimir, redimensionar y editar vídeos. Estudio gratuito en línea.',
  de: 'Professionelles Videobearbeitungs-Toolkit — konvertieren, komprimieren, skalieren und bearbeiten Sie Videos. Kostenloses Online-Studio.',
  pt: 'Kit de ferramentas profissional de processamento de vídeo — converter, comprimir, redimensionar e editar vídeos. Estúdio gratuito online.',
  ru: 'Профессиональный набор инструментов для обработки видео — конвертация, сжатие, изменение размера и редактирование. Бесплатная онлайн-студия.',
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

export default async function MediaStudioToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Media Studio', href: `/${locale}/media-studio` },
          { label: 'Video Converter', href: `/${locale}/media-studio/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Media Studio — Video Converter
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <MediaStudioLoader />
      </main>
    </div>
  );
}
