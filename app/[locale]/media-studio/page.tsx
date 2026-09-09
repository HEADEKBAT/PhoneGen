import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

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
        {/* 1. Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/media-studio/tool`}
        />

        {/* 2. Features */}
        <FeatureGrid features={config.features} />

        {/* 3. FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* 4. CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/media-studio/tool`}
        />
      </main>
    </div>
  );
}
