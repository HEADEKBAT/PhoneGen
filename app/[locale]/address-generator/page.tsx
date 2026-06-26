import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import AddressGeneratorPage from '@/features/address-generator/AddressGenerator';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Address Generator — Generate Realistic Addresses Worldwide',
  fr: 'Générateur d\'adresses — Créez des adresses réalistes dans le monde entier',
  es: 'Generador de direcciones — Cree direcciones realistas en todo el mundo',
  pt: 'Gerador de endereços — Crie endereços realistas em todo o mundo',
  de: 'Adressgenerator — Erstellen Sie realistische Adressen weltweit',
  ru: 'Генератор адресов — Создавайте реалистичные адреса по всему миру',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate realistic addresses for 20+ countries. Includes street, city, postal code, region, and full address. Free online address generator for developers.',
  fr: 'Générez des adresses réalistes pour plus de 20 pays. Rue, ville, code postal, région et adresse complète. Générateur d\'adresses gratuit.',
  es: 'Genere direcciones realistas para más de 20 países. Incluye calle, ciudad, código postal, región y dirección completa. Generador gratuito.',
  pt: 'Gere endereços realistas para mais de 20 países. Inclui rua, cidade, código postal, região e endereço completo. Gerador gratuito.',
  de: 'Generieren Sie realistische Adressen für über 20 Länder. Inklusive Straße, Stadt, Postleitzahl, Region und vollständiger Adresse. Kostenlos.',
  ru: 'Генерируйте реалистичные адреса для 20+ стран. Улица, город, почтовый индекс, регион и полный адрес. Бесплатный генератор адресов.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/address-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function AddressGeneratorPageRoute() {
  return <AddressGeneratorPage />;
}
