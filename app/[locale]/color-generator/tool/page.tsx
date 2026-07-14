import { type Metadata } from 'next';
import { ColorStudioLoader } from '@/components/dynamic';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Color Studio — Free Online Color Palette, Gradient & Converter Tool',
  fr: 'Color Studio — Outil de palette de couleurs, dégradés et conversion gratuit',
  es: 'Color Studio — Herramienta gratuita de paletas, degradados y conversión de colores',
  pt: 'Color Studio — Ferramenta gratuita de paletas, gradientes e conversão de cores',
  de: 'Color Studio — Kostenloses Online-Tool für Farbpaletten, Verläufe und Konverter',
  ru: 'Color Studio — Бесплатный онлайн инструмент для цветовых палитр, градиентов и конвертации',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Create, convert, and analyze colors — palettes, gradients, WCAG contrast checking, color harmonies, and developer-friendly exports. Free online color studio.',
  fr: 'Créez, convertissez et analysez les couleurs — palettes, dégradés, vérification de contraste WCAG. Studio gratuit.',
  es: 'Cree, convierta y analice colores — paletas, degradados, verificación de contraste WCAG. Estudio gratuito.',
  pt: 'Crie, converta e analise cores — paletas, gradientes, verificação de contraste WCAG. Estúdio gratuito.',
  de: 'Farben erstellen, konvertieren und analysieren — Paletten, Verläufe, WCAG-Kontrastprüfung. Kostenloses Studio.',
  ru: 'Создавайте, конвертируйте и анализируйте цвета — палитры, градиенты, проверка контраста WCAG. Бесплатная студия.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('color')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function ColorStudioToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Color Studio', href: `/${locale}/color-generator` },
          { label: 'Color Studio', href: `/${locale}/color-generator/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Color Studio
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <ColorStudioLoader />
      </main>
    </div>
  );
}
