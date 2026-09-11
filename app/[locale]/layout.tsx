import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import '../globals.css';
import { LOCALES } from '@/lib/config';
import { BASE_URL } from '@/lib/config';
import { PLATFORM_CONFIG } from '@/lib/config';
import { AppHeader, AppFooter } from '@/components/layout';
import { TranslationsProvider } from '@/components/i18n/TranslationsProvider';
import { getDictionary, toLocale } from '@/lib/i18n/dictionary';
import ThemeProvider from '@/components/ThemeProvider';
import LanguageCookie from '@/components/LanguageCookie';
import JsonLd from '@/components/JsonLd';
import YandexMetrica from '@/components/YandexMetrica';
import { Analytics } from '@vercel/analytics/react';
import { FONT_CLASSES } from '@/app/fonts';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const CANONICAL_URL = "https://www.gencore.space";


/**
 * Site-wide metadata defaults.
 *
 * A layout may export `metadata` or `generateMetadata`, never both, and this
 * one has to be a function: `metadataBase` depends on the locale in the URL.
 * Everything else is the constant that used to live in the deleted root
 * layout. Pages override any of it through lib/config/seo.ts.
 *
 * There is deliberately no `alternates` here. The root layout used to declare
 * all six languages and point every one at the same URL, which is six claims
 * that contradict each other rather than an hreflang cluster. Each page builds
 * its own from the locale it is actually served at.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {

  title: {
    default: "GenCore — Free Online Generator Suite | Phone, Barcode & Credential Tools",
    template: "%s | GenCore — Free Online Generator Suite",
  },
  description:
    "GenCore is a free online generator suite with tools for phone numbers, barcodes, passwords, credentials, and more. Generate valid test data for developers, QA engineers, and professionals.",
  keywords: [
    "online generator suite",
    "phone number generator",
    "barcode generator",
    "password generator",
    "test data generator",
    "developer tools",
    "free online tools",
    "генератор номеров",
    "генератор штрихкодов",
    "генератор паролей",
  ],
  /* No `alternates` here. It used to name all six languages and point every
     one of them at the same URL, which is not an hreflang cluster — it is six
     claims that contradict each other. Every page builds its own through
     lib/config/seo.ts, from the locale it is actually served at. */
  openGraph: {
    title: "GenCore — Free Online Generator Suite",
    description:
      "Free online generator suite — phone numbers, barcodes, passwords, credentials, and more. For developers, QA engineers, and professionals.",
    url: CANONICAL_URL,
    siteName: "GenCore",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "GenCore — Free Online Generator Suite",
    description:
      "Free online generator suite — phone numbers, barcodes, passwords, credentials, and more. For developers, QA engineers, and professionals.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
 * Locale layout — wraps all locale-prefixed pages.
 *
 * Provides the AppHeader (sticky nav + announcement bar), renders the page,
 * appends the AppFooter — and, since this is the first place that knows which
 * language the URL asked for, resolves the dictionary and hands it down.
 *
 * Reading it here rather than in the browser is the whole point: the server
 * renders the page in the language of its own URL, so /ru ships Russian HTML
 * instead of English that turns Russian a moment after hydration. Exactly one
 * dictionary is serialised into the payload.
 *
 * <html> and <body> are here rather than in the root layout for the same
 * reason — `lang` has to be the URL's language, and the root layout cannot
 * see a segment nested below it.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const language = toLocale(locale);

  return (
    <html lang={language} className={FONT_CLASSES} suppressHydrationWarning>
      <head />
      <body className="min-h-screen flex flex-col grain-overlay">
        <ThemeProvider>
          <TranslationsProvider locale={language} dictionary={getDictionary(locale)}>
            <LanguageCookie locale={language} />
            <JsonLd />
            <AppHeader />
            {children}
            <AppFooter />
          </TranslationsProvider>
          <Analytics />
          <YandexMetrica />
        </ThemeProvider>
      </body>
    </html>
  );
}
