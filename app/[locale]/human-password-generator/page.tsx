import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Human Password Generator — Memorable & Secure Phrases',
  fr: 'Générateur de mots de passe lisibles — Phrases mémorables et sécurisées',
  es: 'Generador de contraseñas legibles — Frases memorables y seguras',
  pt: 'Gerador de senhas legíveis — Frases memoráveis e seguras',
  de: 'Menschenlesbarer Passwort-Generator — Einprägsame & sichere Phrasen',
  ru: 'Генератор человеческих паролей — Запоминающиеся фразы',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Create grammatically coherent, memorable passwords like "MyDogLikesPizza92!" — easy to remember, hard to crack.',
  fr: 'Créez des mots de passe grammaticalement cohérents comme "MyDogLikesPizza92!" — faciles à retenir, difficiles à cracker.',
  es: 'Cree contraseñas gramaticalmente coherentes como "MyDogLikesPizza92!" — fáciles de recordar, difíciles de descifrar.',
  pt: 'Crie senhas gramaticalmente coerentes como "MyDogLikesPizza92!" — fáceis de lembrar, difíceis de quebrar.',
  de: 'Erstellen Sie grammatikalisch kohärente, einprägsame Passwörter wie "MyDogLikesPizza92!" — leicht zu merken, schwer zu knacken.',
  ru: 'Создавайте грамматически связные запоминающиеся пароли вроде "MyDogLikesPizza92!" — легко запомнить, сложно взломать.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/human-password-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function HumanPasswordGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'passwords', passwordMode: 'human' }} />;
}
