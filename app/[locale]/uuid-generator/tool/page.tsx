import { type Metadata } from 'next';
import CredentialGeneratorClient from '../../credential-generator/client';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'UUID Generator — Create UUID v4 & v7 Identifiers Online',
  fr: 'Générateur d\'UUID — Créez des identifiants UUID v4 et v7 en ligne',
  es: 'Generador de UUID — Cree identificadores UUID v4 y v7 en línea',
  de: 'UUID-Generator — Erstellen Sie UUID v4 & v7 Identifikatoren online',
  pt: 'Gerador de UUID — Crie identificadores UUID v4 e v7 online',
  ru: 'Генератор UUID — Создайте UUID v4 и v7 онлайн',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate random UUID v4 and time-ordered UUID v7 identifiers. Free, client-side UUID generator for database keys, API IDs, and distributed systems.',
  fr: 'Générez des identifiants UUID v4 aléatoires et UUID v7 ordonnés dans le temps. Générateur gratuit côté client.',
  es: 'Genere identificadores UUID v4 aleatorios y UUID v7 ordenados por tiempo. Generador gratuito del lado del cliente.',
  de: 'Erstellen Sie zufällige UUID v4 und zeitgeordnete UUID v7 Identifikatoren. Kostenloser clientseitiger Generator.',
  pt: 'Gere identificadores UUID v4 aleatórios e UUID v7 ordenados por tempo. Gerador gratuito no lado do cliente.',
  ru: 'Создавайте случайные UUID v4 и упорядоченные по времени UUID v7. Бесплатный генератор на стороне клиента.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('uuid')!;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title,
    description,
  } satisfies SEOProductPage);
}

export default async function UuidGeneratorToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'UUID Generator', href: `/${locale}/uuid-generator` },
          { label: 'UUID Tool', href: `/${locale}/uuid-generator/tool` },
        ]}
      />

      <CredentialGeneratorClient initialMode={{ activeTab: 'pins-secrets', secretMode: 'uuid' }} />
    </div>
  );
}
