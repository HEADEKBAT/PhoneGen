import { type Metadata } from 'next';
import { CryptoPlaygroundLoader } from '@/components/dynamic';
import { getProduct, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Crypto Wallet Playground — Interactive Web3 Testing Toolkit',
  fr: 'Crypto Wallet Playground — Kit de test Web3 interactif',
  es: 'Crypto Wallet Playground — Kit de pruebas Web3 interactivo',
  pt: 'Crypto Wallet Playground — Kit de teste Web3 interativo',
  de: 'Crypto Wallet Playground — Interaktives Web3-Testkit',
  ru: 'Crypto Wallet Playground — Интерактивный набор инструментов для Web3 тестирования',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate wallet addresses, create BIP39 mnemonics, validate and analyze addresses, explore HD derivation trees, and more. All client-side.',
  fr: 'Générez des adresses de portefeuille, créez des mnémoniques BIP39, validez et analysez des adresses, explorez les arbres de dérivation HD, et plus. Tout côté client.',
  es: 'Genere direcciones de billetera, cree mnemónicos BIP39, valide y analice direcciones, explore árboles de derivación HD, y más. Todo del lado del cliente.',
  pt: 'Gere endereços de carteira, crie mnemônicos BIP39, valide e analise endereços, explore árvores de derivação HD, e mais. Tudo no navegador.',
  de: 'Generieren Sie Wallet-Adressen, erstellen Sie BIP39-Mnemoniken, validieren und analysieren Sie Adressen, erkunden Sie HD-Ableitungsbäume und mehr. Alles clientseitig.',
  ru: 'Генерируйте адреса кошельков, создавайте BIP39 мнемоники, проверяйте и анализируйте адреса, изучайте деревья деривации HD и многое другое. Всё на стороне клиента.',
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
    // This page is not the product landing page, so it declares its own
    // canonical URL rather than inheriting the product slug.
    path: '/crypto-wallet-playground/tool',
  } satisfies SEOProductPage);
}

export default async function CryptoWalletToolPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Crypto Wallet Playground', href: `/${locale}/crypto-wallet-playground` },
          { label: 'Tool', href: `/${locale}/crypto-wallet-playground/tool` },
        ]}
      />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-6 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Crypto Wallet Playground
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DESCRIPTIONS[locale] || DESCRIPTIONS.en}
          </p>
        </div>
        <CryptoPlaygroundLoader />
      </main>
    </div>
  );
}
