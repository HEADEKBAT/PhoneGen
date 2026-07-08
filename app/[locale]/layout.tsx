import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { LOCALES } from '@/lib/config';
import { BASE_URL } from '@/lib/config';
import { PLATFORM_CONFIG } from '@/lib/config';
import { AppHeader, AppFooter } from '@/components/layout';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: PLATFORM_CONFIG.name,
      template: `%s | ${PLATFORM_CONFIG.name}`,
    },
    metadataBase: new URL(`${BASE_URL}/${locale}`),
  };
}

/**
 * Locale layout — wraps all locale-prefixed pages.
 *
 * Provides the AppHeader (sticky nav + announcement bar),
 * renders page content, and appends the AppFooter.
 *
 * Pages that need custom headers (e.g., generator tools)
 * can suppress this layout's header via the `hideHeader` prop
 * at the page level (not implemented — use fragments as needed).
 */
export default async function LocaleLayout({ children }: Props) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}
