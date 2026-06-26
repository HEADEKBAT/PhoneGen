import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'UUID Generator — Generate UUID v4 Online',
  fr: 'Générateur d\'UUID — Générez des UUID v4 en ligne',
  es: 'Generador de UUID — Genere UUID v4 en línea',
  pt: 'Gerador de UUID — Gere UUID v4 online',
  de: 'UUID-Generator — Generieren Sie UUID v4 online',
  ru: 'Генератор UUID — Создавайте UUID v4 онлайн',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate random UUID v4 identifiers for databases, APIs, and distributed systems. Free client-side UUID generator with RFC 4122 compliance.',
  fr: 'Générez des identifiants UUID v4 aléatoires pour bases de données, API et systèmes distribués. Conforme RFC 4122.',
  es: 'Genere identificadores UUID v4 aleatorios para bases de datos, API y sistemas distribuidos. Cumplimiento RFC 4122.',
  pt: 'Gere identificadores UUID v4 aleatórios para bancos de dados, APIs e sistemas distribuídos. Conformidade RFC 4122.',
  de: 'Generieren Sie zufällige UUID-v4-Identifikatoren für Datenbanken, APIs und verteilte Systeme. RFC 4122-konform.',
  ru: 'Генерируйте случайные UUID v4 идентификаторы для баз данных, API и распределенных систем. Соответствие RFC 4122.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/uuid-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function UuidGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'pins-secrets', secretMode: 'uuid' }} />;
}
