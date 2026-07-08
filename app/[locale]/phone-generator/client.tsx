'use client';

import { Suspense, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainContent from '@/components/MainContent';
import { type PhoneFormat, type GenerationMode } from '@/lib/phoneGenerator';
import { useCountryStore } from '@/lib/store';

function PhoneGeneratorContent({
  country,
  locale,
}: {
  country: string;
  locale: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  /* ── Extract initial values from URL params ───────────────────────── */
  const urlCount = searchParams.get('count');
  const urlFormat = searchParams.get('format') as PhoneFormat | null;
  const urlMode = searchParams.get('mode') as GenerationMode | null;
  const initialCount = urlCount ? parseInt(urlCount, 10) : null;
  const initialFormat = urlFormat;
  const initialMode = urlMode;

  /* ── Save the country to store on mount ────────────────────────────── */
  useEffect(() => {
    setStoredCountry(country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Country change → navigate to new URL ──────────────────────────── */
  const handleSelectCountry = useCallback(
    (code: string) => {
      setStoredCountry(code);
      const newPath = `/${locale}/phone-generator/${code}`;
      const paramsStr = searchParams.toString();
      router.replace(paramsStr ? `${newPath}?${paramsStr}` : newPath);
    },
    [locale, router, searchParams, setStoredCountry],
  );

  return (
    <MainContent
      selectedCountry={country}
      onSelectCountry={handleSelectCountry}
      initialCount={initialCount}
      initialFormat={initialFormat}
      initialMode={initialMode}
    />
  );
}

export default function PhoneGeneratorClient({
  country,
  locale,
}: {
  country: string;
  locale: string;
}) {
  return (
    <Suspense fallback={null}>
      <PhoneGeneratorContent country={country} locale={locale} />
    </Suspense>
  );
}
