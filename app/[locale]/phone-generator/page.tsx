import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { LandingGenerator } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Phone Number Generator — Generate Valid Phone Numbers',
  fr: 'Générateur de numéros de téléphone — Numéros valides',
  es: 'Generador de números de teléfono — Números válidos',
  pt: 'Gerador de números de telefone — Números válidos',
  de: 'Telefonnummern-Generator — Gültige Nummern',
  ru: 'Генератор номеров телефона — Валидные номера',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate valid phone numbers that pass libphonenumber-js validation. Free generator for 245+ countries with international, national, and E.164 formats.',
  fr: 'Générez des numéros de téléphone valides qui passent la validation libphonenumber-js. Générateur gratuit pour plus de 245 pays.',
  es: 'Genere números de teléfono válidos que pasen la validación de libphonenumber-js. Generador gratuito para más de 245 países.',
  pt: 'Gere números de telefone válidos que passam na validação libphonenumber-js. Gerador gratuito para mais de 245 países.',
  de: 'Generieren Sie gültige Telefonnummern, die die libphonenumber-js-Validierung bestehen. Kostenloser Generator für über 245 Länder.',
  ru: 'Генерируйте валидные номера телефонов, проходящие проверку libphonenumber-js. Бесплатный генератор для 245+ стран.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('phone')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function PhoneGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('phoneGenerator.pageTitle'), href: `/${locale}/phone-generator` },
        ]}
      />

      <main className="flex-1">
        <LandingGenerator locale={locale} />
      </main>
    </div>
  );
}
