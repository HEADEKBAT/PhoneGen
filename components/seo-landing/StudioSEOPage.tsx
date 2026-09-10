import Breadcrumb from '@/components/Breadcrumb';
import SEOHero from '@/components/credential-landing/SEOHero';
import CredentialFAQ from '@/components/credential-landing/CredentialFAQ';
import { CTASection } from '@/components/product-landing';

export interface StudioSEOFaq {
  q: string;
  a: string;
}

/**
 * The shape the crypto, media and payment SEO registries already share.
 *
 * All three declared their own identical interface (CryptoSEOPageConfig,
 * MediaSEOPageConfig, PaymentSEOPageConfig). This is the structural type the
 * renderer needs, so a record from any of them satisfies it without conversion.
 */
export interface StudioSEOConfig {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: StudioSEOFaq[];
}

interface StudioSEOPageProps {
  locale: string;
  config: StudioSEOConfig;
  /** Breadcrumb label for the studio this page belongs to. */
  parentLabel: string;
  /** Studio landing path, without the locale prefix. */
  parentHref: string;
  /** Where both calls to action point, without the locale prefix. */
  ctaHref: string;
  /** The page's own path, without the locale prefix — the last breadcrumb. */
  path: string;
}

/**
 * Renders an SEO landing page for one of the studios.
 *
 * Deliberately the same five sections as the credential and barcode templates
 * — breadcrumb, hero, prose, FAQ, closing CTA — so a reader who knows one page
 * knows all of them. The only per-family variation is which studio the
 * breadcrumb and the buttons point at, and that arrives as props.
 */
export default function StudioSEOPage({
  locale,
  config,
  parentLabel,
  parentHref,
  ctaHref,
  path,
}: StudioSEOPageProps) {
  const ctaLabel = config.ctaLabel || `Open ${parentLabel}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: parentLabel, href: `/${locale}/${parentHref}` },
          { label: config.heroTitle, href: `/${locale}/${path}` },
        ]}
      />

      <main className="flex-1">
        <SEOHero
          title={config.heroTitle}
          subtitle={config.heroSubtitle}
          ctaHref={`/${locale}/${ctaHref}`}
          ctaLabel={ctaLabel}
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              About {config.heroTitle}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.description}</p>
          </div>
        </section>

        <CredentialFAQ faqs={config.faqs} title={`${config.heroTitle} — FAQ`} />

        <CTASection labelKey={ctaLabel} href={`/${locale}/${ctaHref}`} />
      </main>
    </div>
  );
}
