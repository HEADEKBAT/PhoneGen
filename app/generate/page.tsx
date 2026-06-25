'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import { COUNTRIES, GenerationMode, PhoneFormat } from '@/lib/phoneGenerator';
import { useCountryStore } from '@/lib/store';

function GenerateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const storedCountry = useCountryStore((state) => state.selectedCountry);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  const urlCountry = searchParams.get('country');
  const urlCount = searchParams.get('count');
  const urlFormat = searchParams.get('format');

  // Compute initial country synchronously: URL wins, then stored, then default.
  const initialCountry = (() => {
    if (urlCountry && Object.keys(COUNTRIES).includes(urlCountry)) return urlCountry;
    if (storedCountry && Object.keys(COUNTRIES).includes(storedCountry)) return storedCountry;
    return 'NG';
  })();

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  // ── One-time mount reconciliation ──────────────────────────────────────
  useEffect(() => {
    const target = (() => {
      if (urlCountry && Object.keys(COUNTRIES).includes(urlCountry)) return urlCountry;
      if (storedCountry && Object.keys(COUNTRIES).includes(storedCountry)) return storedCountry;
      return 'NG';
    })();

    if (target !== selectedCountry) {
      setSelectedCountry(target);
    }
    if (storedCountry !== target) {
      setStoredCountry(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── URL param changes (back/forward navigation) ────────────────────────
  useEffect(() => {
    if (!urlCountry) return;
    if (!Object.keys(COUNTRIES).includes(urlCountry)) return;
    if (urlCountry === selectedCountry) return;

    setSelectedCountry(urlCountry);
    setStoredCountry(urlCountry);
  }, [urlCountry, selectedCountry, setStoredCountry]);

  const handleSelectCountry = useCallback((code: string) => {
    setSelectedCountry(code);
    setStoredCountry(code);
    const params = new URLSearchParams(searchParams.toString());
    params.set('country', code);
    router.replace(`/generate?${params.toString()}`);
  }, [router, searchParams, setStoredCountry]);

  const parsedCount = urlCount ? parseInt(urlCount, 10) : null;
  const validCount =
    parsedCount && [1, 5, 10, 25, 50, 100].includes(parsedCount) ? parsedCount : null;
  const validFormat =
    urlFormat && ['international', 'national', 'e164', 'rfc3966'].includes(urlFormat)
      ? (urlFormat as PhoneFormat)
      : null;
  const urlMode = searchParams.get('mode') as GenerationMode | null;
  const validMode =
    urlMode && ['random', 'valid', 'example'].includes(urlMode) ? urlMode : null;

  return (
    <>
      <Header />
      <MainContent
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        initialCount={validCount}
        initialFormat={validFormat}
        initialMode={validMode}
      />
      <Footer />
    </>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={null}>
      <GenerateContent />
    </Suspense>
  );
}
