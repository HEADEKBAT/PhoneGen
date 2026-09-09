/**
 * Credit Card Generator — SEO Landing Page
 *
 * Lightweight landing page at /{locale}/credit-card-generator with:
 *   Breadcrumb → SEOHero → QuickPreview → FAQ → CTA
 *
 * The actual tool is at /{locale}/payment-studio/credit-card-generator.
 */

import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import Breadcrumb from '@/components/Breadcrumb';
import SEOHero from '@/components/credential-landing/SEOHero';
import { CTASection } from '@/components/product-landing';
import { getT } from '@/lib/i18n/server';
import { PAYMENT_SEO_PAGES } from '@/lib/config/paymentSEOPages';
import PaymentFAQ from '@/components/payment-studio/landing/PaymentFAQ';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Credit Card Generator — Generate Test Card Numbers for 15+ Networks',
  ru: 'Генератор кредитных карт — Тестовые номера для 15+ платежных систем',
  de: 'Kreditkartengenerator — Testkartennummern für 15+ Netzwerke',
  es: 'Generador de tarjetas de crédito — Números de prueba para 15+ redes',
  fr: 'Générateur de cartes de crédit — Numéros de test pour 15+ réseaux',
  pt: 'Gerador de cartões de crédito — Números de teste para 15+ redes',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and 10+ payment networks. Free online credit card generator with Luhn validation and multiple export formats.',
  ru: 'Создавайте тестовые номера кредитных карт для Visa, Mastercard, Amex и других платежных систем. Бесплатный генератор.',
  de: 'Generieren Sie gültige Testkreditkartennummern. Kostenloser Generator mit Luhn-Prüfung.',
  es: 'Genere números de tarjetas de crédito de prueba válidos. Generador gratuito con validación Luhn.',
  fr: 'Générez des numéros de cartes de crédit de test valides. Générateur gratuit avec validation Luhn.',
  pt: 'Gere números de cartão de crédito de teste válidos. Gerador gratuito com validação Luhn.',
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
    // This page is not the product landing page, so it declares its own
    // canonical URL rather than inheriting the product slug.
    path: '/credit-card-generator',
  } satisfies SEOProductPage);
}

export default async function CreditCardGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = PAYMENT_SEO_PAGES['credit-card-generator'];

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Payment Studio', href: `/${locale}/payment-studio'` },
          { label: config.heroTitle, href: `/${locale}/credit-card-generator` },
        ]}
      />

      <main className="flex-1">
        <SEOHero
          title={config.heroTitle}
          subtitle={config.heroSubtitle}
          ctaHref={`/${locale}/payment-studio/credit-card-generator`}
        />

        <PaymentFAQ
          faqs={config.faqs}
          title="Frequently Asked Questions"
        />

        <CTASection
          labelKey="Go to Credit Card Generator"
          href={`/${locale}/payment-studio/credit-card-generator`}
        />
      </main>
    </div>
  );
}
