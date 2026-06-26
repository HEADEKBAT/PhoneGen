import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Passphrase Generator — XKCD-Style Secure Word Sequences',
  fr: 'Générateur de phrases de passe — Séquences de mots sécurisées',
  es: 'Generador de frases de contraseña — Secuencias de palabras seguras',
  pt: 'Gerador de frases secretas — Sequências de palavras seguras',
  de: 'Passphrasen-Generator — XKCD-Style sichere Wortfolgen',
  ru: 'Генератор парольных фраз — Безопасные последовательности слов',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate XKCD-style passphrases: random word sequences that are easy to remember but mathematically secure. Customizable word count, separator, and capitalization.',
  fr: 'Générez des phrases de passe style XKCD : séquences de mots aléatoires faciles à retenir mais mathématiquement sécurisées.',
  es: 'Genere frases de contraseña estilo XKCD: secuencias de palabras aleatorias fáciles de recordar pero matemáticamente seguras.',
  pt: 'Gere frases secretas estilo XKCD: sequências de palavras aleatórias fáceis de lembrar mas matematicamente seguras.',
  de: 'Generieren Sie XKCD-artige Passphrasen: zufällige Wortfolgen, die leicht zu merken, aber mathematisch sicher sind.',
  ru: 'Создавайте парольные фразы в стиле XKCD: случайные последовательности слов, которые легко запомнить, но математически безопасны.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/passphrase-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function PassphraseGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'passwords', passwordMode: 'passphrase' }} />;
}
