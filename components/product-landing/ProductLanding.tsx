import type { ReactNode } from 'react';
import type { ProductLandingConfig } from '@/lib/config/productLanding';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';
import LandingHero from './LandingHero';
import LandingSection from './LandingSection';
import LandingCards from './LandingCards';
import LandingExample from './LandingExample';
import LandingFaq from './LandingFaq';
import LandingClosing from './LandingClosing';
import PopularCountries from './PopularCountries';
import { toFeatureCards } from './featureCards';

interface ProductLandingProps {
  locale: string;
  config: ProductLandingConfig;
  /** The crumb for this page. Home is prepended. */
  crumb: { label: string; href: string };
  /** Overrides the product's own hero copy — an SEO sub-landing has its own. */
  title?: string;
  lede?: string;
  /** Where every call to action on the page points, locale-prefixed. */
  ctaHref: string;
  /** A real line of this product's output, shown with a copy button. */
  example?: string;
  /** Link pattern for the countries grid, with a `{code}` placeholder. */
  countriesHref?: string;
  /** Slug for the countries grid's default link pattern. */
  productSlug?: string;
  /** Sits between the breadcrumb and the hero — the crypto disclaimer. */
  beforeHero?: ReactNode;
}

/**
 * The standard product landing: hero, what you get, countries, an example,
 * the FAQ and the closing button.
 *
 * Eight pages had this written out by hand — address, user, company, email,
 * username, crypto, colour and image — in the same order, with the same five
 * components, differing only in their strings and which of the two optional
 * sections they kept. `createLandingPage` rendered four of the same six for
 * seventeen more. Twenty-five pages, two renderers, and neither could be
 * restyled without touching the other.
 *
 * It is a server component: every string is resolved here with `getT`, so the
 * client components below it take finished text and the page ships its copy in
 * the HTML.
 */
export default function ProductLanding({
  locale,
  config,
  crumb,
  title,
  lede,
  ctaHref,
  example,
  countriesHref,
  productSlug,
  beforeHero,
}: ProductLandingProps) {
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[{ label: t('nav.home'), href: `/${locale}` }, crumb]}
      />

      <main className="flex-1">
        {beforeHero}

        <LandingHero
          title={title ?? t(config.heroTitleKey)}
          titleWidth="max-w-[20ch]"
          lede={lede ?? t(config.heroDescKey)}
          actions={[{ label: t(config.ctaLabelKey), href: ctaHref }]}
        />

        {config.features.length > 0 && (
          <LandingSection title={t('productLanding.featuresTitle')}>
            <LandingCards items={toFeatureCards(config.features, t)} />
          </LandingSection>
        )}

        {config.popularCountryCodes && productSlug && (
          <PopularCountries
            countryCodes={config.popularCountryCodes}
            locale={locale}
            productSlug={productSlug}
            heading={config.popularCountriesDescKey ? t(config.popularCountriesDescKey) : undefined}
            hrefPattern={countriesHref}
          />
        )}

        {example && <LandingExample title={t(config.exampleLabelKey)} text={example} />}

        <LandingFaq
          title={t('productLanding.faqTitle')}
          items={config.faqs.map((faq) => ({
            question: t(faq.qKey),
            answer: t(faq.aKey),
          }))}
        />

        <LandingClosing
          title={t('productLanding.ctaTitle')}
          body={t('productLanding.ctaDesc')}
          cta={t(config.ctaLabelKey)}
          href={ctaHref}
        />
      </main>
    </div>
  );
}
