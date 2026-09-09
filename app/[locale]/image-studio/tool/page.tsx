import { type Metadata } from 'next';
import { ImageStudioLoader } from '@/components/dynamic';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Image Studio — Free Online Image Tools: Background Remover, Upscaler & Editor',
  fr: 'Studio d\'image — Outils d\'image gratuits en ligne : Suppression d\'arrière-plan, agrandissement et édition',
  es: 'Image Studio — Herramientas de imagen gratuitas en línea: eliminación de fondos, ampliación y edición',
  pt: 'Image Studio — Ferramentas de imagem gratuitas online: remoção de fundo, upscaling e edição',
  de: 'Image Studio — Kostenlose Online-Bildtools: Hintergrund entfernen, Hochskalieren und Bearbeiten',
  ru: 'Image Studio — Бесплатные онлайн-инструменты для изображений: удаление фона, увеличение и редактирование',
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
    // This page is not the product landing page, so it declares its own
    // canonical URL rather than inheriting the product slug.
    path: '/image-studio/tool',
  } satisfies SEOProductPage);
}

export default async function ImageStudioToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Image Studio', href: `/${locale}/image-studio` },
          { label: 'Image Studio', href: `/${locale}/image-studio/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Image Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <ImageStudioLoader />
      </main>
    </div>
  );
}
