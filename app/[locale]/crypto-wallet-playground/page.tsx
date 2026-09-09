import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import {
  ProductHero,
  FeatureGrid,
  ExampleSection,
  FAQSection,
  CTASection,
} from '@/components/product-landing';
import DisclaimerBanner from '@/components/crypto/shared/DisclaimerBanner';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Crypto Wallet Playground — Free Online Web3 Testing Tools',
  fr: 'Crypto Wallet Playground — Outils de test Web3 gratuits en ligne',
  es: 'Crypto Wallet Playground — Herramientas de prueba Web3 gratuitas',
  pt: 'Crypto Wallet Playground — Ferramentas de teste Web3 grátis',
  de: 'Crypto Wallet Playground — Kostenlose Online-Web3-Testtools',
  ru: 'Crypto Wallet Playground — Бесплатные онлайн инструменты для Web3 тестирования',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate, validate, analyze, and explore cryptocurrency wallet addresses for 22+ blockchains. Educational and professional Web3 testing tools — all free and client-side.',
  fr: 'Générez, validez, analysez et explorez des adresses de portefeuille crypto pour 22+ blockchains. Outils de test Web3 éducatifs et professionnels — gratuits et côté client.',
  es: 'Genere, valide, analice y explore direcciones de billeteras cripto para 22+ blockchains. Herramientas de prueba Web3 educativas y profesionales — gratis y del lado del cliente.',
  pt: 'Gere, valide, analise e explore endereços de carteiras cripto para 22+ blockchains. Ferramentas de teste Web3 educacionais e profissionais — grátis e no navegador.',
  de: 'Generieren, validieren, analysieren und erkunden Sie Kryptowallet-Adressen für 22+ Blockchains. Bildungs- und Profi-Web3-Testtools — kostenlos und clientseitig.',
  ru: 'Генерируйте, проверяйте, анализируйте и изучайте адреса криптокошельков для 22+ блокчейнов. Образовательные и профессиональные инструменты Web3 тестирования — бесплатно и на стороне клиента.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('cryptoWallet')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function CryptoWalletLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('cryptoWallet');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Crypto Wallet Playground', href: `/${locale}/crypto-wallet-playground` },
        ]}
      />

      <main className="flex-1">
        {/* Disclaimer */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6">
          <DisclaimerBanner />
        </div>

        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/crypto-wallet-playground/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="Bitcoin Legacy: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa | Ethereum: 0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          titleKey="productLanding.ctaTitle"
          descKey="productLanding.ctaDesc"
          labelKey={config.ctaLabelKey}
          href={`/${locale}/crypto-wallet-playground/tool`}
        />
      </main>
    </div>
  );
}
