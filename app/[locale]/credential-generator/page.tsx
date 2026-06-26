import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from './client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Credential Generator — Password, PIN, Secret & API Key Generator',
  fr: 'Générateur de mots de passe — PIN, secrets et clés API',
  es: 'Generador de credenciales — Contraseñas, PIN, secretos y claves API',
  pt: 'Gerador de credenciais — Senhas, PIN, segredos e chaves de API',
  de: 'Passwort-Generator — PIN, Geheimnisse und API-Schlüssel',
  ru: 'Генератор учетных данных — Пароли, PIN, секреты и API ключи',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate secure passwords, memorable passphrases, PIN codes, API keys, JWT secrets, UUIDs, bulk credential pairs, and more. Free client-side generator.',
  fr: 'Générez des mots de passe sécurisés, phrases de passe, codes PIN, clés API, secrets JWT, UUID, paires de credentials et plus. Générateur côté client gratuit.',
  es: 'Genere contraseñas seguras, frases de contraseña, códigos PIN, claves API, secretos JWT, UUID, pares de credenciales y más. Generador gratuito del lado del cliente.',
  pt: 'Gere senhas seguras, frases secretas, códigos PIN, chaves de API, segredos JWT, UUID, pares de credenciais e muito mais. Gerador gratuito no lado do cliente.',
  de: 'Generieren Sie sichere Passwörter, einprägsame Passphrasen, PIN-Codes, API-Schlüssel, JWT-Geheimnisse, UUIDs, Bulk-Anmeldedatenpaare und mehr. Kostenloser Client-seitiger Generator.',
  ru: 'Генерируйте безопасные пароли, запоминающиеся фразы, PIN-коды, API ключи, JWT секреты, UUID, пары учетных данных и многое другое. Бесплатный генератор на стороне клиента.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const alternates = generateLocaleAlternates(locale, '/credential-generator');

  return {
    title,
    description,
    alternates,
  };
}

export default async function CredentialGeneratorPage() {
  return <CredentialGeneratorClient />;
}
