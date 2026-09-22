import { type Metadata } from 'next';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import { ProductLanding } from '@/components/product-landing';
import DisclaimerBanner from '@/components/crypto/shared/DisclaimerBanner';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Crypto Wallet Generator & Validator — Playground',
  fr: 'Générer et valider un portefeuille — Playground',
  es: 'Generar y validar monederos cripto — Playground',
  pt: 'Gerar e validar carteiras cripto — Playground',
  de: 'Krypto-Wallet erzeugen und prüfen — Playground',
  ru: 'Генератор и проверка криптокошельков — Playground',
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

export default async function CryptoWalletPlaygroundLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <ProductLanding
      locale={locale}
      config={getProductLandingConfig('cryptoWallet')}
      crumb={{ label: t('products.cryptoWallet.title'), href: `/${locale}/crypto-wallet-playground` }}
      ctaHref={`/${locale}/crypto-wallet-playground/tool`}
      example={`Bitcoin Legacy: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\nEthereum:      0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18`}
      beforeHero={<div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6"><DisclaimerBanner /></div>}
    />
  );
}
