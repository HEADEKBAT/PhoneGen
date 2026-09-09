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

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'QR Code Generator — Create Custom QR Codes Online Free',
  fr: 'Générateur de QR Code — Créez des codes QR personnalisés gratuitement',
  es: 'Generador de Códigos QR — Cree códigos QR personalizados gratis',
  pt: 'Gerador de QR Code — Crie códigos QR personalizados grátis',
  de: 'QR-Code-Generator — Erstellen Sie individuelle QR-Codes kostenlos',
  ru: 'Генератор QR-кодов — Создавайте кастомные QR-коды онлайн бесплатно',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Generate custom QR codes for URLs, Wi-Fi, vCard, email, social media, and 30+ data types. Free online QR code generator with designer, logo upload, and multiple export formats.',
  fr: 'Générez des codes QR personnalisés pour les URL, Wi-Fi, vCard, email, réseaux sociaux et 30+ types de données. Générateur gratuit avec designer et export.',
  es: 'Genere códigos QR personalizados para URL, Wi-Fi, vCard, email, redes sociales y más de 30 tipos de datos. Generador gratuito con diseñador y exportación.',
  pt: 'Gere códigos QR personalizados para URLs, Wi-Fi, vCard, email, redes sociais e mais de 30 tipos de dados. Gerador gratuito com designer e exportação.',
  de: 'Generieren Sie individuelle QR-Codes für URLs, WLAN, vCard, E-Mail, soziale Medien und über 30 Datentypen. Kostenloser Generator mit Designer und Export.',
  ru: 'Создавайте кастомные QR-коды для URL, Wi-Fi, vCard, email, соцсетей и 30+ типов данных. Бесплатный генератор с дизайнером, логотипом и экспортом.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('qr')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function QRCodeGeneratorLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('qr');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'QR Code Generator', href: `/${locale}/qr-generator` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/qr-generator/tool`}
        />

        {/* Features */}
        <FeatureGrid features={config.features} />

        {/* Example */}
        <ExampleSection
          labelKey={config.exampleLabelKey}
          exampleText="QR Code with Wi-Fi, vCard, URL, and 30+ content types"
        />

        {/* FAQ */}
        <FAQSection faqs={config.faqs} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/qr-generator/tool`}
        />
      </main>
    </div>
  );
}
