import { type Metadata } from 'next';
import {
  getProduct,
  getProductLandingConfig,
  generateMetadata as seoGenerateMetadata,
  type SEOProductPage,
} from '@/lib/config';
import { POPULAR_PHONE_COUNTRIES } from '@/lib/config/productLanding';
import { getPhoneCountryExamples } from '@/lib/phone/examples';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { PhoneHero, PhoneCountries, PhoneFormats } from '@/components/phone-landing';
import { LandingFaq, LandingClosing } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Phone Number Generator',
  fr: 'Générateur de numéros de téléphone',
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

/** How many of the popular countries the hero panel cycles through. */
const SHOWCASE_COUNT = 6;

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
  const config = getProductLandingConfig('phone');

  /* Formatted here rather than in the browser: `libphonenumber-js` plus its
     metadata is a few hundred kilobytes, and a page that only needs to *show*
     a dozen numbers has no reason to ship a parser to do it. The country pages
     load the real generator, where it is earned. */
  const examples = getPhoneCountryExamples(locale, POPULAR_PHONE_COUNTRIES);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('phoneGenerator.pageTitle'), href: `/${locale}/phone-generator` },
        ]}
      />

      <main className="flex-1">
        <PhoneHero examples={examples.slice(0, SHOWCASE_COUNT)} />
        <PhoneCountries locale={locale} examples={examples} />
        {examples.length > 0 && <PhoneFormats example={examples[0]} />}
        <LandingFaq faqs={config.faqs} />
        <LandingClosing
          titleKey="productLanding.phone.closing.title"
          bodyKey="productLanding.phone.closing.body"
          ctaKey="productLanding.phone.cta.secondary"
          href="#countries"
        />
      </main>
    </div>
  );
}
