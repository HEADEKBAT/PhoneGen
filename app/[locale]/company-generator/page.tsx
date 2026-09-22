import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Company Generator',
  fr: 'Générateur d\'entreprise',
  es: 'Generador de empresas',
  pt: 'Gerador de empresas',
  de: 'Unternehmens-Generator',
  ru: 'Генератор компаний',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic company profiles with name, industry, department, job titles, website, and slogan. Free company generator for developers and QA.',
  fr: 'Générez des profils d\'entreprise réalistes avec nom, secteur, département, postes, site web et slogan. Générateur gratuit.',
  es: 'Genere perfiles empresariales realistas con nombre, industria, departamento, cargos, sitio web y eslogan. Generador gratuito.',
  pt: 'Gere perfis empresariais realistas com nome, indústria, departamento, cargos, site e slogan. Gerador gratuito.',
  de: 'Generieren Sie realistische Firmenprofile mit Name, Branche, Abteilung, Stellenbezeichnungen, Website und Slogan. Kostenlos.',
  ru: 'Генерируйте реалистичные профили компаний с названием, отраслью, отделом, должностями, сайтом и слоганом. Бесплатно.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('company')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function CompanyGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('company')}
      crumb={{ label: t('products.company.title'), href: `/${locale}/company-generator` }}
      ctaHref={`/${locale}/company-generator/tool`}
      example={`Acme Corporation\nTechnology\nwww.acme-corp.com`}
    />
  );
}
