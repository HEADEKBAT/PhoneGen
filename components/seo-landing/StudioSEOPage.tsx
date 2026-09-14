import Breadcrumb from '@/components/Breadcrumb';
import SEOHero from '@/components/credential-landing/SEOHero';
import CredentialFAQ from '@/components/credential-landing/CredentialFAQ';
import { CTASection } from '@/components/product-landing';
import { getT } from '@/lib/i18n/server';

export interface StudioSEOFaq {
  q: string;
  a: string;
}

/** Everything on the page that is written in one language. */
export interface StudioSEOCopy {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: StudioSEOFaq[];
}

/**
 * The shape the crypto, media and payment SEO registries already share.
 *
 * All three declared their own identical interface (CryptoSEOPageConfig,
 * MediaSEOPageConfig, PaymentSEOPageConfig). This is the structural type the
 * renderer needs, so a record from any of them satisfies it without conversion.
 *
 * English sits on the record itself; `locales` carries the translations. These
 * 29 pages served English to all six locales for their whole life — the same
 * title, the same h1, the same FAQ on /ru as on /en — which is 174 URLs that
 * could not rank for the words anyone would actually search in five of the six
 * languages.
 */
export interface StudioSEOConfig extends StudioSEOCopy {
  slug: string;
  locales?: Record<string, Partial<StudioSEOCopy>>;
}

/**
 * The copy for one locale, falling back field by field to English.
 *
 * Field by field rather than all-or-nothing so that a half-translated record
 * still serves the parts that exist, instead of reverting the whole page.
 */
export function resolveStudioSEOCopy(config: StudioSEOConfig, locale: string): StudioSEOCopy {
  const translated = config.locales?.[locale];

  return {
    title: translated?.title ?? config.title,
    description: translated?.description ?? config.description,
    heroTitle: translated?.heroTitle ?? config.heroTitle,
    heroSubtitle: translated?.heroSubtitle ?? config.heroSubtitle,
    ctaLabel: translated?.ctaLabel ?? config.ctaLabel,
    faqs: translated?.faqs ?? config.faqs,
  };
}

interface StudioSEOPageProps {
  locale: string;
  /** Already resolved for `locale` — see `resolveStudioSEOCopy`. */
  copy: StudioSEOCopy;
  /** The page's slug, for nothing but the breadcrumb key. */
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
 *
 * The section headings used to be built in English here ("About X", "X — FAQ",
 * "Open X") regardless of locale, so even a fully translated record would have
 * rendered two English headings. They come from the dictionary now — and the
 * "About" heading no longer interpolates the page title, because a title
 * dropped into a sentence needs a case ending in Russian and an article in
 * French, and "Что такое Генератор Bitcoin-адресов" is what you get without
 * one. The h1 directly above already names the tool.
 */
export default function StudioSEOPage({
  locale,
  copy,
  parentLabel,
  parentHref,
  ctaHref,
  path,
}: StudioSEOPageProps) {
  const t = getT(locale);
  const ctaLabel = copy.ctaLabel || t('studioSeo.open', { studio: parentLabel });

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: 'GenCore', href: `/${locale}` },
          { label: parentLabel, href: `/${locale}/${parentHref}` },
          { label: copy.heroTitle, href: `/${locale}/${path}` },
        ]}
      />

      <main className="flex-1">
        <SEOHero
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          ctaHref={`/${locale}/${ctaHref}`}
          ctaLabel={ctaLabel}
        />

        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              {t('studioSeo.about')}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{copy.description}</p>
          </div>
        </section>

        <CredentialFAQ faqs={copy.faqs} title={t('studioSeo.faq', { topic: copy.heroTitle })} />

        <CTASection labelKey={ctaLabel} href={`/${locale}/${ctaHref}`} />
      </main>
    </div>
  );
}
