import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Fake User Generator',
  fr: "Générateur d'utilisateurs fictifs — Créez des profils réalistes",
  es: 'Generador de usuarios ficticios',
  pt: 'Gerador de usuários fictícios',
  de: 'Benutzer-Generator',
  ru: 'Генератор пользователей',
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
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('user')}
      crumb={{ label: t('products.user.title'), href: `/${locale}/user-generator` }}
      ctaHref={`/${locale}/user-generator/tool`}
      example={`John Doe\njohn.doe@example.com\n+1 (555) 123-4567\n123 Main St, New York, NY 10001`}
      productSlug={'user-generator'}
      countriesHref={`/${locale}/user-generator/tool?country={code}`}
    />
  );
}
