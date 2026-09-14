import { type Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Braces, FlaskConical, LineChart, GraduationCap } from 'lucide-react';
import { generateMetadata as seoGenerateMetadata, type SEOCustomPage } from '@/lib/config/seo';
import { getProduct } from '@/lib/config/products';
import { CATALOGUE_GROUPS } from '@/lib/config/homeCatalogue';
import { getT } from '@/lib/i18n/server';
import Breadcrumb from '@/components/Breadcrumb';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * About page.
 *
 * It described PhoneGen — a product that no longer exists under that name —
 * in every one of the six locales, down to an h1 reading «PhoneGen» and a grid
 * of the 106 countries the phone generator covers. The page is linked from the
 * header, the footer and the sitemap, so the most-linked page on the site was
 * introducing the wrong product.
 *
 * It also rendered its own <Header> and <Footer> on top of the ones the layout
 * already provides, so the document carried two of each, and its call to action
 * linked to '/phone-generator' with no locale prefix — a 308 that dropped a
 * Russian reader onto the English page.
 *
 * Now it is a server component (nothing here needs the client: the FAQ is a
 * plain <details>), the copy is about the platform, and the tool list is built
 * from CATALOGUE_GROUPS — the same grouping the home page uses, with the same
 * translated product names, so the two cannot drift apart.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);

  return seoGenerateMetadata({
    type: 'custom',
    locale,
    path: '/about',
    /* Not `about.heroTitle`: the h1 reads «О GenCore», and the layout's
       title.template appends the brand, so the <title> would carry it twice. */
    title: t('about.metaTitle'),
    description: t('about.heroLede'),
  } satisfies SEOCustomPage);
}

const AUDIENCE = [
  { key: 'dev', Icon: Braces },
  { key: 'qa', Icon: FlaskConical },
  { key: 'analyst', Icon: LineChart },
  { key: 'edu', Icon: GraduationCap },
] as const;

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = getT(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Breadcrumb
        items={[
          { label: t('nav.home'), href: `/${locale}` },
          { label: t('about.heroTitle'), href: `/${locale}/about` },
        ]}
      />

      <main className="flex-1">
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">
              {t('about.heroTitle')}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t('about.heroLede')}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 space-y-16">
          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              {t('about.whatTitle')}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{t('about.whatP1')}</p>
              <p>{t('about.whatP2')}</p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              {t('about.toolsTitle')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">{t('about.toolsNote')}</p>

            <div className="space-y-6">
              {CATALOGUE_GROUPS.map((group) => (
                <div key={group.id}>
                  <h3 className="font-heading text-sm font-semibold text-foreground mb-2">
                    {t(`platformHome.groups.${group.id}.title`)}
                  </h3>
                  <ul className="flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
                    {group.entries.map((entry) => {
                      const product = getProduct(entry.id);
                      if (!product) return null;

                      return (
                        <li key={entry.id}>
                          <Link
                            href={`/${locale}/${product.slug}`}
                            className="inline-block rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-action transition-colors"
                          >
                            {t(`products.${entry.id}.title`)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t('about.audienceTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUDIENCE.map(({ key, Icon }) => (
                <div key={key} className="rounded-xl border border-border bg-card p-5 space-y-3">
                  <Icon size={22} className="text-action" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">
                      {t(`about.audience_${key}_title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {t(`about.audience_${key}_desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              {t('about.privacyTitle')}
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>{t('about.privacyP1')}</p>
              <p>{t('about.privacyP2')}</p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              {t('about.faqTitle')}
            </h2>
            <div className="space-y-2">
              {FAQ_KEYS.map((key) => (
                <details key={key} className="rounded-xl border border-border bg-card group">
                  <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none">
                    <span className="text-sm font-medium text-foreground pr-4">
                      {t(`about.faq_${key}`)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground shrink-0 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`about.faq_${key.replace('q', 'a')}`)}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {t('about.ctaTitle')}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              {t('about.ctaDesc')}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-xl bg-action text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              {t('about.ctaButton')}
              <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
