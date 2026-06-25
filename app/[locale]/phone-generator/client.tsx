'use client';

import { Suspense, useState, useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import Footer from '@/components/Footer';
import { COUNTRIES } from '@/lib/phoneGenerator';
import { useCountryStore } from '@/lib/store';

function PhoneGeneratorContent() {
  const searchParams = useSearchParams();

  const storedCountry = useCountryStore((state) => state.selectedCountry);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  const urlCountry = searchParams.get('country');

  const initialCountry = (() => {
    if (urlCountry && urlCountry in COUNTRIES) return urlCountry;
    if (storedCountry && storedCountry in COUNTRIES) return storedCountry;
    return 'NG';
  })();

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);

  const handleSelectCountry = useCallback(
    (code: string) => {
      setSelectedCountry(code);
      setStoredCountry(code);
    },
    [setStoredCountry],
  );

  /* ── One-time mount reconciliation ──────────────────────────────────── */
  useEffect(() => {
    const target = (() => {
      if (urlCountry && urlCountry in COUNTRIES) return urlCountry;
      if (storedCountry && storedCountry in COUNTRIES) return storedCountry;
      return 'NG';
    })();
    if (target !== selectedCountry) setSelectedCountry(target);
    if (storedCountry !== target) setStoredCountry(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <MainContent
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
      />
      <Footer />
    </>
  );
}

export default function PhoneGeneratorClient() {
  return (
    <Suspense fallback={null}>
      <PhoneGeneratorContent />
    </Suspense>
  );
}
