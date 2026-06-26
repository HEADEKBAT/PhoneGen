import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import CredentialGeneratorClient from '../credential-generator/client';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'PIN Generator — Create Secure PIN Codes (4, 6, 8 Digit)',
  fr: 'Générateur de code PIN — Créez des codes PIN sécurisés',
  es: 'Generador de PIN — Cree códigos PIN seguros',
  pt: 'Gerador de PIN — Crie códigos PIN seguros',
  de: 'PIN-Generator — Erstellen Sie sichere PIN-Codes',
  ru: 'Генератор PIN-кодов — Создавайте безопасные PIN-коды',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate secure PIN codes in 4, 6, or 8 digit lengths with optional no-consecutive-repeats constraint. Free client-side PIN generator.',
  fr: 'Générez des codes PIN sécurisés en 4, 6 ou 8 chiffres avec option sans répétitions consécutives. Générateur gratuit côté client.',
  es: 'Genere códigos PIN seguros de 4, 6 u 8 dígitos con opción sin repeticiones consecutivas. Generador gratuito.',
  pt: 'Gere códigos PIN seguros de 4, 6 ou 8 dígitos com opção sem repetições consecutivas. Gerador gratuito.',
  de: 'Generieren Sie sichere PIN-Codes in 4, 6 oder 8 Ziffern mit optionaler Vermeidung aufeinanderfolgender Wiederholungen. Kostenlos.',
  ru: 'Генерируйте безопасные PIN-коды длиной 4, 6 или 8 цифр с опцией запрета последовательных повторов. Бесплатно.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/pin-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function PinGeneratorPage() {
  return <CredentialGeneratorClient initialMode={{ activeTab: 'pins-secrets' }} />;
}
