import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

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
  } satisfies SEOProductPage);
}

export default async function ImageStudioLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('image');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Image Studio', href: `/${locale}/image-studio` },
        ]}
      />

      <main className="flex-1">
        {/* 1. Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/image-studio/tool`}
        />

        {/* 2. Features */}
        <FeatureGrid features={config.features} />

        {/* 3. FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* 4. CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/image-studio/tool`}
        />
      </main>
    </div>
  );
}
