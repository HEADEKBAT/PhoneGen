import { type Metadata } from 'next';
import { generateLocaleAlternates } from '@/lib/seo';
import UsernameGeneratorPage from '@/features/username-generator/UsernameGenerator';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Username Generator — Create Unique Usernames in 7 Styles',
  fr: 'Générateur de nom d\'utilisateur — Créez des noms uniques en 7 styles',
  es: 'Generador de nombres de usuario — Cree nombres únicos en 7 estilos',
  pt: 'Gerador de nome de usuário — Crie nomes únicos em 7 estilos',
  de: 'Benutzernamen-Generator — Erstellen Sie einzigartige Namen in 7 Stilen',
  ru: 'Генератор имен пользователей — Создайте уникальные имена в 7 стилях',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate unique usernames in 7 styles: classic, modern, developer, gaming, professional, corporate, and random. Free online username generator.',
  fr: 'Générez des noms d\'utilisateur uniques en 7 styles : classique, moderne, développeur, gaming, professionnel, corporate et aléatoire. Générateur gratuit.',
  es: 'Genere nombres de usuario únicos en 7 estilos: clásico, moderno, desarrollador, gaming, profesional, corporativo y aleatorio. Generador gratuito.',
  pt: 'Gere nomes de usuário únicos em 7 estilos: clássico, moderno, desenvolvedor, gaming, profissional, corporativo e aleatório. Gerador gratuito.',
  de: 'Generieren Sie einzigartige Benutzernamen in 7 Stilen: klassisch, modern, Entwickler, Gaming, professionell, Unternehmens- und zufällig. Kostenlos.',
  ru: 'Генерируйте уникальные имена пользователей в 7 стилях: классический, современный, разработчик, игровой, профессиональный, корпоративный и случайный. Бесплатно.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alternates = generateLocaleAlternates(locale, '/username-generator');
  return {
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    alternates,
  };
}

export default async function UsernameGeneratorPageRoute() {
  return <UsernameGeneratorPage />;
}
