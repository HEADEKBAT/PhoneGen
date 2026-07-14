import { type Metadata } from 'next';
import { getProduct, getProductLandingConfig, generateMetadata as seoGenerateMetadata, type SEOProductPage } from '@/lib/config';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import { ProductHero, FeatureGrid, FAQSection, CTASection } from '@/components/product-landing';

type Props = {
  params: Promise<{ locale: string }>;
};

const TITLES: Record<string, string> = {
  en: 'Accessibility Color Checker — WCAG Contrast & Color Accessibility Tool',
  fr: 'Vérificateur de couleurs d\'accessibilité — Outil de contraste et accessibilité WCAG',
  es: 'Verificador de accesibilidad de color — Herramienta de contraste WCAG',
  pt: 'Verificador de acessibilidade de cores — Ferramenta de contraste WCAG',
  de: 'Barrierefreiheits-Farbprüfer — WCAG-Kontrast- und Farbzugänglichkeitstool',
  ru: 'Проверка цветов на доступность — Инструмент контраста и доступности WCAG',
};

const DESCRIPTIONS: Record<string, string> = {
  en: 'Free accessibility color checker. Test WCAG 2.1 contrast ratios, simulate color blindness, and generate accessible color systems with AA/AAA compliance.',
  fr: 'Vérificateur d\'accessibilité gratuit. Testez les ratios de contraste WCAG 2.1, simulez le daltonisme, créez des systèmes accessibles conformes AA/AAA.',
  es: 'Verificador de accesibilidad gratuito. Pruebe relaciones de contraste WCAG 2.1, simule daltonismo, cree sistemas accesibles conformes AA/AAA.',
  pt: 'Verificador de acessibilidade gratuito. Teste taxas de contraste WCAG 2.1, simule daltonismo, crie sistemas acessíveis com conformidade AA/AAA.',
  de: 'Kostenloser Barrierefreiheitsprüfer. Testen Sie WCAG-2.1-Kontrastverhältnisse, simulieren Sie Farbblindheit, erstellen Sie AA/AAA-konforme Farbsysteme.',
  ru: 'Бесплатная проверка доступности. Тестируйте коэффициенты контраста WCAG 2.1, симулируйте дальтонизм, создавайте доступные цветовые системы с AA/AAA.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const product = getProduct('color')!;

  return seoGenerateMetadata({
    type: 'product',
    locale,
    product,
    title: TITLES[locale] || TITLES.en,
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
  } satisfies SEOProductPage);
}

export default async function AccessibilityColorCheckerLanding({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);
  const config = getProductLandingConfig('color');

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: 'Accessibility Color Checker', href: `/${locale}/accessibility-color-checker` },
        ]}
      />

      <main className="flex-1">
        <ProductHero
          titleKey={config.heroTitleKey}
          descKey={config.heroDescKey}
          ctaLabelKey={config.ctaLabelKey}
          ctaHref={`/${locale}/color-generator/tool?mode=contrast`}
        />

        <FeatureGrid features={config.features} />

        <FAQSection faqs={config.faqs} />

        <CTASection
          labelKey={config.ctaLabelKey}
          href={`/${locale}/color-generator/tool?mode=contrast`}
        />
      </main>
    </div>
  );
}
