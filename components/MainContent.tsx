'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import GeneratorControls from './GeneratorControls';
import PhoneList from './PhoneList';
import InfoCard from './InfoCard';
import { COUNTRIES, generatePhoneNumbers, PhoneFormat, GenerationMode } from '@/lib/phoneGenerator';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/lib/i18n';
import { useCountryStore, useRecentlyUsedStore } from '@/lib/store';
import CountrySelect from './CountrySelect';

export default function MainContent({
  selectedCountry,
  onSelectCountry,
  initialCount,
  initialFormat,
  initialMode,
}: {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
  initialCount?: number | null;
  initialFormat?: PhoneFormat | null;
  initialMode?: GenerationMode | null;
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const addRecentlyUsed = useRecentlyUsedStore((state) => state.addRecentlyUsed);
  const country = COUNTRIES[selectedCountry] || COUNTRIES['NG'];
  const [quantity, setQuantity] = useState(initialCount || 10);
  const [format, setFormat] = useState<PhoneFormat>(initialFormat || 'international');
  const [mode, setMode] = useState<GenerationMode>(initialMode || 'valid');
  const [seed, setSeed] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [regenerationCounter, setRegenerationCounter] = useState(0);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  useEffect(() => {
    try {
      const generated = generatePhoneNumbers(selectedCountry, quantity, format, seed || undefined, mode);
      setPhones(generated);
    } catch (error) {
      console.error('Error generating phone numbers:', error);
    }
  }, [selectedCountry, quantity, format, mode, seed, regenerationCounter]);

  // Track recently used countries
  useEffect(() => {
    addRecentlyUsed(selectedCountry);
  }, [selectedCountry, addRecentlyUsed]);

  // Sync count, format & mode to URL params
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;
    const countStr = String(quantity);
    if (quantity !== 10) {
      if (params.get('count') !== countStr) {
        params.set('count', countStr);
        changed = true;
      }
    } else if (params.has('count')) {
      params.delete('count');
      changed = true;
    }
    if (format !== 'international') {
      if (params.get('format') !== format) {
        params.set('format', format);
        changed = true;
      }
    } else if (params.has('format')) {
      params.delete('format');
      changed = true;
    }
    if (mode !== 'valid') {
      if (params.get('mode') !== mode) {
        params.set('mode', mode);
        changed = true;
      }
    } else if (params.has('mode')) {
      params.delete('mode');
      changed = true;
    }
    if (changed) {
      router.replace(`/?${params.toString()}`);
    }
  }, [quantity, format, mode, searchParams, router]);

  const handleCountryChange = (code: string) => {
    onSelectCountry(code);
    setStoredCountry(code);
  };

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6">
        {/* Header Section */}
        <section aria-labelledby="country-heading">
          <div className="space-y-1">
            <h1 id="country-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {t('mainContent.heading', { country: t('countries.' + country.code) })}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('mainContent.subtitle', { code: country.code, country: t('countries.' + country.code) })}
            </p>
          </div>
        </section>

        {/* Country Select */}
        <div className="max-w-md">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
            {t('sidebar.listboxLabel')}
          </label>
          <CountrySelect
            selectedCountry={selectedCountry}
            onSelectCountry={handleCountryChange}
          />
        </div>

        {/* Controls */}
        <GeneratorControls
          onQuantityChange={setQuantity}
          onFormatChange={setFormat}
          onModeChange={setMode}
          onSeedChange={setSeed}
          onRegenerate={() => setRegenerationCounter((c) => c + 1)}
          defaultQuantity={initialCount || undefined}
          defaultFormat={initialFormat || undefined}
          defaultMode={initialMode || undefined}
        />

        {/* Phone List */}
        <PhoneList phones={phones} countryCode={selectedCountry} mode={mode} />

        {/* Info Card */}
        <InfoCard countryCode={selectedCountry} />
      </div>
    </main>
  );
}
