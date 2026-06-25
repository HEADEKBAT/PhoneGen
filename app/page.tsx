'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CountrySelect from '@/components/CountrySelect';
import { COUNTRIES } from '@/lib/phoneGenerator';
import type { PhoneFormat, GenerationMode } from '@/lib/phoneGenerator';
import { useTranslations } from '@/lib/i18n';
import Flag from 'react-world-flags';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Zap, CheckCircle2, Users } from 'lucide-react';

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslations();

  // ── Redirect to /generate if URL has search params ─────────────────────
  const urlCountry = searchParams.get('country');
  const urlCount = searchParams.get('count');
  const urlFormat = searchParams.get('format');
  const urlMode = searchParams.get('mode');
  const hasParams = urlCountry || urlCount || urlFormat || urlMode;

  if (hasParams && typeof window !== 'undefined') {
    const params = new URLSearchParams();
    if (urlCountry) params.set('country', urlCountry);
    if (urlCount) params.set('count', urlCount);
    if (urlFormat) params.set('format', urlFormat);
    if (urlMode) params.set('mode', urlMode);
    const qs = params.toString();
    router.replace(qs ? `/generate?${qs}` : '/generate');
    return null;
  }

  // ── Landing page state ─────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [quantity, setQuantity] = useState(10);
  const [format, setFormat] = useState<PhoneFormat>('international');
  const [mode, setMode] = useState<GenerationMode>('valid');

  const handleGenerate = () => {
    const params = new URLSearchParams();
    params.set('country', selectedCountry);
    params.set('count', String(quantity));
    if (format !== 'international') params.set('format', format);
    if (mode !== 'valid') params.set('mode', mode);
    router.push(`/generate?${params.toString()}`);
  };

  const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100];
  const FORMAT_OPTIONS: { id: PhoneFormat; labelKey: string }[] = [
    { id: 'international', labelKey: 'generator.international' },
    { id: 'national', labelKey: 'generator.national' },
    { id: 'e164', labelKey: 'generator.e164' },
    { id: 'rfc3966', labelKey: 'generator.rfc3966' },
  ];
  const MODE_OPTIONS: { id: GenerationMode; labelKey: string }[] = [
    { id: 'random', labelKey: 'generator.modeRandom' },
    { id: 'valid', labelKey: 'generator.modeValid' },
    { id: 'example', labelKey: 'generator.modeExample' },
  ];

  const countries = useMemo(
    () => Object.values(COUNTRIES).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  const features = [
    { icon: Globe, key: '35plus' },
    { icon: Zap, key: '3formats' },
    { icon: CheckCircle2, key: 'valid' },
    { icon: Users, key: 'free' },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="border-b border-border bg-linear-to-b from-primary/5 via-primary/2 to-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Phone<span className="text-primary">Gen</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {t('home.heroDesc')}
            </p>
          </div>
        </section>

        {/* ── Quick Generator ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 -mt-8">
          <div className="rounded-2xl border border-border bg-card shadow-sm p-5 sm:p-7">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-5">
              {t('home.quickStartTitle')}
            </h2>

            {/* Country selector */}
            <div className="mb-5">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                {t('sidebar.listboxLabel')}
              </label>
              <CountrySelect
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
              />
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-end gap-3 mb-6">
              {/* Quantity */}
              <fieldset className="min-w-0">
                <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                  {t('generator.quantity')}
                </legend>
                <Select value={String(quantity)} onValueChange={(v) => setQuantity(parseInt(v, 10))}>
                  <SelectTrigger className="h-10 w-24 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUANTITY_OPTIONS.map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fieldset>

              {/* Mode */}
              <fieldset className="min-w-0">
                <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                  {t('generator.mode')}
                </legend>
                <Select value={mode} onValueChange={(v) => setMode(v as GenerationMode)}>
                  <SelectTrigger className="h-10 w-36 sm:w-40 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.id === 'valid' ? `${t(option.labelKey)} ★` : t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fieldset>

              {/* Format */}
              <fieldset className="min-w-0">
                <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
                  {t('generator.format')}
                </legend>
                <Select value={format} onValueChange={(v) => setFormat(v as PhoneFormat)}>
                  <SelectTrigger className="h-10 w-40 sm:w-44 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </fieldset>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              className="w-full h-12 rounded-xl gap-2 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-none transition-all active:scale-[0.98]"
            >
              {t('home.generateButton')}
              <ArrowRight size={18} />
            </Button>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">
            {t('about.featuresTitle')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {features.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 text-center space-y-2"
              >
                <Icon size={24} className="mx-auto text-primary" />
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">
                    {t(`about.features_${key}_title` as any)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(`about.features_${key}_desc` as any)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Supported Countries ──────────────────────────────────────── */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
            <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-2">
              {t('about.countriesTitle')} · {countries.length}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
              {t('home.countriesDesc')}
            </p>
            <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => { setSelectedCountry(country.code); }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted transition-colors text-left cursor-pointer"
                  >
                    <Flag
                      code={getCountryCode(country.code)}
                      style={{ width: '14px', height: '10px', borderRadius: '1px', objectFit: 'cover', flexShrink: 0 }}
                      title={t('countries.' + country.code)}
                    />
                    <span className="text-[11px] font-medium text-foreground truncate leading-none">
                      {country.code}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="rounded-xl border border-border bg-card p-8 sm:p-10 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {t('about.ctaTitle')}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              {t('about.ctaDesc')}
            </p>
            <Button
              onClick={handleGenerate}
              className="mt-6 h-11 px-6 rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('about.ctaButton')}
              <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
