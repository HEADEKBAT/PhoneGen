import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Free Online Image Tools — Image Studio',
  fr: 'Outils d\'image en ligne — Image Studio',
  es: 'Herramientas de imagen online — Image Studio',
  pt: 'Ferramentas de imagem online — Image Studio',
  de: 'Online-Bildtools — Image Studio',
  ru: 'Онлайн-инструменты для изображений — Image Studio',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Professional image processing toolkit — remove backgrounds, upscale images, apply filters, and edit photos. Free online image studio with AI-powered tools.',
  fr: 'Boîte à outils professionnelle de traitement d\'image — suppression d\'arrière-plan, agrandissement, filtres et édition. Studio gratuit en ligne avec outils IA.',
  es: 'Kit de herramientas profesional de procesamiento de imágenes — eliminar fondos, ampliar, aplicar filtros y editar fotos. Estudio gratuito en línea.',
  de: 'Professionelles Bildbearbeitungs-Toolkit — Hintergrund entfernen, hochskalieren, Filter anwenden und Fotos bearbeiten. Kostenloses Online-Studio.',
  ru: 'Профессиональный набор инструментов для обработки изображений — удаление фона, увеличение, фильтры и редактирование. Бесплатная онлайн-студия.',
  pt: 'Kit de ferramentas profissional de processamento de imagens — remover fundo, ampliar, aplicar filtros e editar fotos. Estúdio gratuito online.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('image')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function ImageStudioLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('image')}
      crumb={{ label: t('products.image.title'), href: `/${locale}/image-studio` }}
      ctaHref={`/${locale}/image-studio/tool`}
    />
  );
}
