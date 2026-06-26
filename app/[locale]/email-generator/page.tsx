import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import EmailGeneratorPage from '@/features/email-generator/EmailGenerator';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Email Generator — Create Realistic Email Addresses',
  fr: 'Générateur d\'email — Créez des adresses email réalistes',
  es: 'Generador de emails — Cree direcciones de correo realistas',
  pt: 'Gerador de email — Crie endereços de email realistas',
  de: 'E-Mail-Generator — Erstellen Sie realistische E-Mail-Adressen',
  ru: 'Генератор email — Создавайте реалистичные email адреса',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic email addresses in 5 modes: random, professional, corporate, disposable, and nickname. Free online email generator for developers.',
  fr: 'Générez des adresses email réalistes en 5 modes : aléatoire, professionnel, corporate, jetable et pseudo. Générateur gratuit.',
  es: 'Genere direcciones de correo electrónico realistas en 5 modos: aleatorio, profesional, corporativo, desechable y apodo. Generador gratuito.',
  pt: 'Gere endereços de email realistas em 5 modos: aleatório, profissional, corporativo, descartável e apelido. Gerador gratuito.',
  de: 'Generieren Sie realistische E-Mail-Adressen in 5 Modi: zufällig, professionell, Unternehmens-, Wegwerf- und Spitzname. Kostenlos.',
  ru: 'Генерируйте реалистичные email адреса в 5 режимах: случайный, профессиональный, корпоративный, одноразовый и псевдоним. Бесплатно.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/email-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function EmailGeneratorPageRoute() {
  return <EmailGeneratorPage />;
}
