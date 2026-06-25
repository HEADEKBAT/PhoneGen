'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useTransition } from 'react';
import GeneratorControls from './GeneratorControls';
import PhoneList from './PhoneList';
import InfoCard from './InfoCard';
import { COUNTRIES, generatePhoneNumbers, PhoneFormat, GenerationMode } from '@/lib/phoneGenerator';
import { useTranslations } from '@/lib/i18n';
import { useCountryStore, useRecentlyUsedStore } from '@/lib/store';
import CountrySelect from './CountrySelect';
import { Loader2 } from 'lucide-react';

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
  const pathname = usePathname();

  /* ── Determine the base path for URL sync ──────────────────────────────
   * On the legacy /generate route values are synced back to /generate.
   * On locale-prefixed routes (/_en_/phone-generator) they sync to that same
   * path so the URL stays consistent. */
  const basePath = (() => {
    const seg = pathname.split('/').filter(Boolean);
    if (
      seg.length > 0 &&
      ['en', 'fr', 'es', 'pt', 'de', 'ru'].includes(seg[0])
    ) {
      return `/${seg[0]}/phone-generator`;
    }
    return '/generate';
  })();
  const addRecentlyUsed = useRecentlyUsedStore((state) => state.addRecentlyUsed);
  const country = COUNTRIES[selectedCountry] || COUNTRIES['NG'];
  const [quantity, setQuantity] = useState(initialCount || 10);
  const [format, setFormat] = useState<PhoneFormat>(initialFormat || 'international');
  const [mode, setMode] = useState<GenerationMode>(initialMode || 'valid');
  const [seed, setSeed] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [regenerationCounter, setRegenerationCounter] = useState(0);
  const setStoredCountry = useCountryStore((state) => state.setSelectedCountry);

  // ── useTransition для оптимистичной генерации ─────────────────────────
  const [isPending, startTransition] = useTransition();

  const doGenerate = useCallback(() => {
    startTransition(() => {
      const generated = generatePhoneNumbers(selectedCountry, quantity, format, seed || undefined, mode);
      setPhones(generated);
    });
  }, [selectedCountry, quantity, format, mode, seed]);

  useEffect(() => {
    doGenerate();
  }, [doGenerate, regenerationCounter]);

  // ── Track recently used countries ──────────────────────────────────────
  useEffect(() => {
    addRecentlyUsed(selectedCountry);
  }, [selectedCountry, addRecentlyUsed]);

  // ── Sync count, format & mode to URL params ───────────────────────────
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
      router.replace(`${basePath}?${params.toString()}`);
    }
  }, [quantity, format, mode, searchParams, router, basePath]);

  const handleCountryChange = useCallback((code: string) => {
    onSelectCountry(code);
    setStoredCountry(code);
  }, [onSelectCountry, setStoredCountry]);

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
          isPending={isPending}
        />

        {/* Phone List with active generation overlay */}
        <div className="relative">
          {isPending && phones.length > 0 && (
            <div className="absolute inset-0 z-10 flex items-start justify-center pt-16 sm:pt-20 pointer-events-none">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {t('generator.generating')}
                </span>
              </div>
            </div>
          )}
          <div
            className={`transition-all duration-300 ${
              isPending && phones.length > 0
                ? 'opacity-40 blur-[0.5px] scale-[0.995] pointer-events-none'
                : 'opacity-100 blur-none scale-100'
            }`}
          >
            <PhoneList
              phones={phones}
              countryCode={selectedCountry}
              mode={mode}
              isPending={isPending}
            />
          </div>
        </div>

        {/* Info Card */}
        <InfoCard countryCode={selectedCountry} />
      </div>
    </main>
  );
}
