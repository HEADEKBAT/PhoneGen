import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Password Generator — Create Strong Random Passwords',
  fr: 'Générateur de mot de passe — Créez des mots de passe forts',
  es: 'Generador de contraseñas — Cree contraseñas seguras',
  pt: 'Gerador de senhas — Crie senhas fortes',
  de: 'Passwort-Generator — Erstellen Sie starke Passwörter',
  ru: 'Генератор паролей — Создавайте надежные пароли',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate strong random passwords with custom length, uppercase, lowercase, numbers, symbols, and exclusions. Free client-side password generator.',
  fr: 'Générez des mots de passe forts avec longueur personnalisée, majuscules, minuscules, chiffres, symboles et exclusions. Générateur gratuit côté client.',
  es: 'Genere contraseñas seguras con longitud personalizada, mayúsculas, minúsculas, números, símbolos y exclusiones. Generador gratuito.',
  pt: 'Gere senhas fortes com comprimento personalizado, maiúsculas, minúsculas, números, símbolos e exclusões. Gerador gratuito.',
  de: 'Generieren Sie starke Passwörter mit benutzerdefinierter Länge, Großbuchstaben, Kleinbuchstaben, Zahlen, Symbolen und Ausschlüssen. Kostenloser Generator.',
  ru: 'Генерируйте надежные случайные пароли с настраиваемой длиной, заглавными/строчными буквами, цифрами, символами и исключениями. Бесплатный генератор.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/password-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function PasswordGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'passwords', passwordMode: 'random' }} />;
}
