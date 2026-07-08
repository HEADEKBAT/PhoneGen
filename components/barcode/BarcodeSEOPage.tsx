import Breadcrumb from '@/components/Breadcrumb';
import { CTASection } from '@/components/product-landing';
import { generateBarcode } from '@/lib/barcode/engine';
import { BARCODE_DISPLAY_NAMES } from '@/lib/barcode/types';
import type { BarcodeSEOPageConfig } from '@/lib/config/barcodeSEOPages';
import BarcodeSEOFAQ from './BarcodeSEOFAQ';

interface BarcodeSEOPageProps {
  locale: string;
  config: BarcodeSEOPageConfig;
  title: string;
  description: string;
}

/**
 * Renders an SEO landing page for a barcode generator sub-type.
 */
export default function BarcodeSEOPage({ locale, config, title, description }: BarcodeSEOPageProps) {
  const displayName = BARCODE_DISPLAY_NAMES[config.barcodeType as keyof typeof BARCODE_DISPLAY_NAMES] || config.barcodeType;

  // Render a sample barcode SVG (server-side)
  let sampleSvg = '';
  try {
    const sampleData = config.barcodeType === 'pharmacode' ? '12345'
      : config.barcodeType === 'codabar' ? 'A12345B'
      : config.barcodeType === 'code128' ? 'ABC-123'
      : config.barcodeType === 'code39' ? 'CODE39'
      : config.barcodeType === 'code93' ? 'CODE93'
      : config.barcodeType === 'ean8' ? '12345670'
      : config.barcodeType === 'isbn13' ? '9781234567897'
      : '5901234123457';
    const result = generateBarcode({
      type: config.barcodeType as any,
      data: sampleData,
      width: 1.5,
      height: 60,
      margin: 8,
      fontSize: 14,
    });
    sampleSvg = result.svg;
  } catch {
    sampleSvg = '';
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: 'Barcode Generator', href: `/${locale}/barcode-generator` },
          { label: config.heroTitle, href: `/${locale}/${config.slug}` },
        ]}
      />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 text-center">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {config.heroTitle}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {config.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Sample Preview */}
        {sampleSvg && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
              <div className="flex flex-col items-center gap-6">
                <div className="p-8 rounded-xl border border-border bg-card">
                  <div
                    className="max-w-full overflow-auto"
                    dangerouslySetInnerHTML={{ __html: sampleSvg }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Example {displayName} barcode</p>
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              About {config.heroTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <BarcodeSEOFAQ faqs={config.faqs} title={`${config.heroTitle} — FAQ`} />

        {/* CTA */}
        <CTASection
          labelKey={config.ctaLabel || `Generate ${config.heroTitle}`}
          href={`/${locale}/barcode-generator/tool?type=${config.barcodeType}`}
        />
      </main>
    </div>
  );
}
