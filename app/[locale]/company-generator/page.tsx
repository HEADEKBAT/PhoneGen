import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CompanyGeneratorPage from '@/features/company-generator/CompanyGenerator';

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
  const alternates = generateLocaleAlternates(locale, '/company-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function CompanyGeneratorPageRoute() {
  return <CompanyGeneratorPage />;
}
