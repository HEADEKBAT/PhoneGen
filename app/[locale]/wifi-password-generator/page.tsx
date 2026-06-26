import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'WiFi Password Generator — Create Secure Router Passwords',
  fr: 'Générateur de mot de passe WiFi — Créez des mots de passe routeur sécurisés',
  es: 'Generador de contraseñas WiFi — Cree contraseñas de router seguras',
  pt: 'Gerador de senhas WiFi — Crie senhas de roteador seguras',
  de: 'WiFi-Passwort-Generator — Erstellen Sie sichere Router-Passwörter',
  ru: 'Генератор паролей WiFi — Создавайте безопасные пароли роутера',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate strong WiFi router passwords — 20 characters with all character classes, excluding ambiguous characters. Perfect for router admin and network security.',
  fr: 'Générez des mots de passe WiFi robustes — 20 caractères avec toutes les classes, sans caractères ambigus.',
  es: 'Genere contraseñas WiFi seguras — 20 caracteres con todas las clases, excluyendo caracteres ambiguos.',
  pt: 'Gere senhas WiFi fortes — 20 caracteres com todas as classes, excluindo caracteres ambíguos.',
  de: 'Generieren Sie starke WiFi-Passwörter — 20 Zeichen mit allen Zeichenklassen, ohne mehrdeutige Zeichen.',
  ru: 'Генерируйте надежные пароли WiFi — 20 символов со всеми классами, исключая неоднозначные символы.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/wifi-password-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function WifiPasswordGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'passwords', passwordMode: 'random' }} />;
}
