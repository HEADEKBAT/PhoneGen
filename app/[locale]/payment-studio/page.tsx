/**
 * Payment Studio — Product Landing Page
 *
 * Data-driven landing page with:
 *   Breadcrumb → Hero → Tools Grid → Features → FAQ → CTA
 */

import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { CTASection } from '@/components/product-landing';
import PaymentHero from '@/components/payment-studio/landing/PaymentHero';
import PaymentToolGrid from '@/components/payment-studio/landing/PaymentToolGrid';
import PaymentFAQ from '@/components/payment-studio/landing/PaymentFAQ';
import { PAYMENT_SEO_PAGES } from '@/lib/config/paymentSEOPages';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Payment Studio — Test Card Generator, BIN Lookup & Payment Testing Tools',
  ru: 'Payment Studio — Генератор тестовых карт, BIN поиск и инструменты тестирования',
  de: 'Payment Studio — Testkarten-Generator, BIN-Suche und Zahlungstest-Tools',
  es: 'Payment Studio — Generador de tarjetas de prueba, BIN lookup y herramientas',
  fr: 'Payment Studio — Générateur de cartes de test, recherche BIN et outils',
  pt: 'Payment Studio — Gerador de cartões de teste, BIN lookup e ferramentas',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate test credit card numbers for 15+ networks, validate cards, look up BIN/IIN numbers, and create test payment profiles. Free online payment testing tools.',
  ru: 'Создавайте тестовые номера кредитных карт для 15+ платежных систем. Бесплатные инструменты тестирования платежей.',
  de: 'Generieren Sie Testkreditkartennummern für 15+ Netzwerke. Kostenlose Zahlungstest-Tools.',
  es: 'Genere números de tarjetas de crédito de prueba para 15+ redes. Herramientas de prueba gratuitas.',
  fr: 'Générez des numéros de cartes de crédit de test pour 15+ réseaux. Outils de test gratuits.',
  pt: 'Gere números de cartão de crédito de teste para 15+ redes. Ferramentas de teste gratuitas.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('payment')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function PaymentStudioLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const masterConfig = PAYMENT_SEO_PAGES['credit-card-generator'];

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Payment Studio', href: `/${locale}/payment-studio` },
        ]}
      />

      <main className="flex-1">
        <PaymentHero locale={locale} />

        <PaymentToolGrid locale={locale} />

        <PaymentFAQ
          faqs={masterConfig.faqs}
          title="Frequently Asked Questions"
        />

        <CTASection
          labelKey="Open Credit Card Generator"
          href={`/${locale}/payment-studio/credit-card-generator`}
        />
      </main>
    </div>
  );
}
