import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { LOCALES } from '@/lib/config';
import { BASE_URL } from '@/lib/seo';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale-level metadata.
 *
 * Provides a shared title template for all pages under `/[locale]/*`.
 * Each page extends or overrides these defaults via its own
 * `generateMetadata` — notably the hreflang alternates, which must be
 * page-specific to point to the exact same page in other locales.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: {
      default: 'PhoneGen',
      template: `%s | PhoneGen`,
    },
    metadataBase: new URL(`${BASE_URL}/${locale}`),
  };
}

export default async function LocaleLayout({ children }: Props) {
  return <>{children}</>;
}
