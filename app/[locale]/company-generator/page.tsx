import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ProductHero,
  FeatureGrid,
  ExampleSection,
  FAQSection,
  CTASection,
} from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Company Generator — Generate Realistic Company Profiles',
  fr: 'Générateur d\'entreprise — Créez des profils d\'entreprise réalistes',
  es: 'Generador de empresas — Cree perfiles empresariales realistas',
  pt: 'Gerador de empresas — Crie perfis empresariais realistas',
  de: 'Unternehmens-Generator — Erstellen Sie realistische Firmenprofile',
  ru: 'Генератор компаний — Создавайте реалистичные профили компаний',
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
  const config = getProductLandingConfig('company');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Company Generator', href: `/${locale}/company-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/company-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="Acme Corporation\nTechnology\nwww.acme-corp.com"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/company-generator/tool`}
        />
      </main>
    </div>
  );
}
