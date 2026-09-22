import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Username Generator',
  fr: 'Générateur de nom d\'utilisateur',
  es: 'Generador de nombres de usuario',
  pt: 'Gerador de nome de usuário',
  de: 'Benutzernamen-Generator',
  ru: 'Генератор имен пользователей',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate unique usernames in 7 styles: classic, modern, developer, gaming, professional, corporate, and random. Free online username generator.',
  fr: 'Générez des noms d\'utilisateur uniques en 7 styles. Générateur gratuit.',
  es: 'Genere nombres de usuario únicos en 7 estilos. Generador gratuito.',
  pt: 'Gere nomes de usuário únicos em 7 estilos. Gerador gratuito.',
  de: 'Generieren Sie einzigartige Benutzernamen in 7 Stilen. Kostenloser Generator.',
  ru: 'Генерируйте уникальные имена пользователей в 7 стилях. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('username')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function UsernameGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('username')}
      crumb={{ label: t('products.username.title'), href: `/${locale}/username-generator` }}
      ctaHref={`/${locale}/username-generator/tool`}
      example={`johndoe_42`}
    />
  );
}
