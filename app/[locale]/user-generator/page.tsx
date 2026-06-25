import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import UserGenClient from './client';

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
  fr: 'Générez des utilisateurs fictifs réalistes avec noms, emails, numéros de téléphone, adresses, entreprises, mots de passe et profils internet. Parfait pour les développeurs et ingénieurs QA.',
  es: 'Genere usuarios ficticios realistas con nombres, correos electrónicos, números de teléfono, direcciones, empresas, contraseñas y perfiles de Internet. Perfecto para desarrolladores e ingenieros de QA.',
  pt: 'Gere usuários fictícios realistas com nomes, e-mails, números de telefone, endereços, empresas, senhas e perfis de internet. Perfeito para desenvolvedores e engenheiros de QA.',
  de: 'Generieren Sie realistische Testbenutzer mit Namen, E-Mails, Telefonnummern, Adressen, Unternehmen, Passwörtern und Internetprofilen. Perfekt für Entwickler und QA-Ingenieure.',
  ru: 'Генерируйте реалистичных тестовых пользователей с именами, email, номерами телефонов, адресами, компаниями, паролями и интернет-профилями. Идеально для разработчиков и QA инженеров.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const alternates = generateLocaleAlternates(locale, '/user-generator');

  return {
    title,
    description,
    alternates,
  };
}

export default async function UserGenPage() {
  return <UserGenClient />;
}
