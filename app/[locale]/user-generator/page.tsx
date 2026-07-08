import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ProductHero,
  PopularCountries,
  FeatureGrid,
  ExampleSection,
  FAQSection,
  CTASection,
} from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Fake User Generator — Generate Realistic Test Users',
  fr: "Générateur d'utilisateurs fictifs — Créez des profils réalistes",
  es: 'Generador de usuarios ficticios — Cree perfiles realistas',
  pt: 'Gerador de usuários fictícios — Crie perfis realistas',
  de: 'Benutzer-Generator — Erstellen Sie realistische Testprofile',
  ru: 'Генератор пользователей — Создайте реалистичные профили',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic fake users with names, emails, phone numbers, addresses, companies, passwords and internet profiles. Perfect for developers and QA engineers.',
  fr: 'Générez des utilisateurs fictifs réalistes avec noms, emails, numéros de téléphone, adresses, entreprises, mots de passe et profils internet.',
  es: 'Genere usuarios ficticios realistas con nombres, correos electrónicos, números de teléfono, direcciones, empresas, contraseñas y perfiles de Internet.',
  pt: 'Gere usuários fictícios realistas com nomes, e-mails, números de telefone, endereços, empresas, senhas e perfis de internet.',
  de: 'Generieren Sie realistische Testbenutzer mit Namen, E-Mails, Telefonnummern, Adressen, Unternehmen, Passwörtern und Internetprofilen.',
  ru: 'Генерируйте реалистичных тестовых пользователей с именами, email, номерами телефонов, адресами, компаниями, паролями и интернет-профилями.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('user')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function UserGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const config = getProductLandingConfig('user');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'User Generator', href: `/${locale}/user-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/user-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Popular Countries */}
        {config.popularCountryCodes && (
          <PopularCountries
            countryCodes={config.popularCountryCodes}
            locale={locale}
            productSlug="user-generator"
            heading={config.popularCountriesDescKey}
            hrefPattern={`/${locale}/user-generator/tool?country={code}`}
          />
        )}

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="John Doe\njohn.doe@example.com\n+1 (555) 123-4567\n123 Main St, New York, NY 10001"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/user-generator/tool`}
        />
      </main>
    </div>
  );
}
