import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { LOCALES, BASE_URL, PLATFORM_CONFIG } from '@/lib/config';
import { AppHeader, AppFooter } from '@/components/layout';
import { TranslationsProvider } from '@/components/i18n/TranslationsProvider';
import { getDictionary, toLocale } from '@/lib/i18n/dictionary';
import { getT } from '@/lib/i18n/server';
import ThemeProvider from '@/components/ThemeProvider';
import LanguageCookie from '@/components/LanguageCookie';
import JsonLd from '@/components/JsonLd';
import YandexMetrica from '@/components/YandexMetrica';
import { Analytics } from '@vercel/analytics/react';
import { FONT_CLASSES } from '../fonts';
import '../globals.css';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** `ru` → `ru_RU`, `en` → `en_US` — the form Open Graph expects. */
const OG_LOCALES: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  pt: 'pt_BR',
  de: 'de_DE',
  ru: 'ru_RU',
};

/**
 * Site-wide metadata defaults.
 *
 * A layout may export `metadata` or `generateMetadata`, never both, and this
 * one has to be a function: every value below depends on the locale in the URL.
 * Pages override any of it through lib/config/seo.ts.
 *
 * `title.template` is the single place the brand is appended. Nothing else
 * adds it — four different places used to, and titles carried "GenCore" twice.
 *
 * There is deliberately no `alternates` here. This used to declare all six
 * languages and point every one at the same URL, which is six claims that
 * contradict each other rather than an hreflang cluster. Each page builds its
 * own from the locale it is actually served at.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getT(locale);
  const title = t('platformHome.meta.title');
  const description = t('platformHome.meta.description');

  return {
    title: {
      default: `${title} | ${PLATFORM_CONFIG.name}`,
      template: `%s | ${PLATFORM_CONFIG.name}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: PLATFORM_CONFIG.name,
      locale: OG_LOCALES[locale] ?? OG_LOCALES.en,
      type: 'website',
    },
    twitter: { card: 'summary', title, description },
    robots: { index: true, follow: true },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    metadataBase: new URL(`${BASE_URL}/${locale}`),
  };
}

/**
 * Root layout.
 *
 * This is the topmost layout in the tree — there is no `app/layout.tsx` — which
 * is Next's documented shape for a localised site and the only one that puts
 * the language in the served HTML. A root layout above `[locale]` cannot read
 * the segment below it, so it cannot know the locale: for a while `lang` was
 * therefore set by an inline script after parse, which browsers and screen
 * readers honour but a crawler reading raw HTML never sees.
 *
 * Everything else follows from being the root: `<html>`, `<body>`, the fonts
 * and the stylesheet live here, and the dictionary for the URL's language is
 * resolved once and handed down, so /ru ships Russian HTML instead of English
 * that turns Russian a moment after hydration. Exactly one dictionary is
 * serialised into the payload.
 *
 * Paths outside `[locale]` are covered by the redirects in next.config.ts;
 * anything genuinely unmatched gets Next's built-in 404, which needs no layout.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const language = toLocale(locale);

  return (
    <html lang={language} className={FONT_CLASSES} suppressHydrationWarning>
      <head />
      <body className="min-h-screen flex flex-col grain-overlay">
        <TranslationsProvider locale={language} dictionary={getDictionary(locale)}>
          <LanguageCookie locale={language} />
          <ThemeProvider>
            <JsonLd />
            <AppHeader />
            {children}
            <AppFooter />
            <Analytics />
            <YandexMetrica />
          </ThemeProvider>
        </TranslationsProvider>
      </body>
    </html>
  );
}
