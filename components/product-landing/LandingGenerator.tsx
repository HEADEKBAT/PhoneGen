'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import CountrySelect from '@/components/CountrySelect';

export default function LandingGenerator({ locale }: { locale: string }) {
  const { t } = useTranslations();
  const router = useRouter();
  const [country, setCountry] = useState('US');

  const handleGenerate = useCallback(() => {
    router.push(`/${locale}/phone-generator/${country}`);
  }, [country, locale, router]);

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-20 text-center">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-3">
        {t('phoneGenerator.pageTitle')}
      </h1>
      <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-10">
        {t('phoneGenerator.pageDesc')}
      </p>

      <div className="max-w-sm mx-auto space-y-4">
        <div className="text-left">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
            {t('phoneGenerator.countryLabel')}
          </label>
          <CountrySelect
            selectedCountry={country}
            onSelectCountry={setCountry}
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Phone size={16} />
          <span>{t('phoneGenerator.generateButton')}</span>
        </button>
      </div>
    </section>
  );
}
