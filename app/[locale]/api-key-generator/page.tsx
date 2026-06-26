import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'API Key Generator — Create Secure API Keys & Tokens',
  fr: 'Générateur de clés API — Créez des clés et tokens API sécurisés',
  es: 'Generador de claves API — Cree claves y tokens API seguros',
  pt: 'Gerador de chaves de API — Crie chaves e tokens de API seguros',
  de: 'API-Schlüssel-Generator — Erstellen Sie sichere API-Schlüssel und Tokens',
  ru: 'Генератор API ключей — Создавайте безопасные ключи и токены API',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate secure API keys, JWT secrets, webhook secrets, hex strings, and base64 tokens for authentication and authorization systems.',
  fr: 'Générez des clés API sécurisées, secrets JWT, secrets webhook, chaînes hex et tokens base64 pour les systèmes d\'authentification.',
  es: 'Genere claves API seguras, secretos JWT, secretos webhook, cadenas hex y tokens base64 para sistemas de autenticación.',
  pt: 'Gere chaves de API seguras, segredos JWT, segredos webhook, strings hex e tokens base64 para sistemas de autenticação.',
  de: 'Generieren Sie sichere API-Schlüssel, JWT-Geheimnisse, Webhook-Geheimnisse, Hex-Strings und Base64-Tokens für Authentifizierungssysteme.',
  ru: 'Генерируйте безопасные API ключи, JWT секреты, webhook секреты, hex-строки и base64 токены для систем аутентификации.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/api-key-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function ApiKeyGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'pins-secrets', secretMode: 'api-key' }} />;
}
