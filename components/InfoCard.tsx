'use client';

import { CheckCircle2, Grid3x3, Zap } from 'lucide-react';
import { getCountry, getCountryInfo } from '@/lib/phoneGenerator';
import { useTranslations } from '@/lib/i18n';
import { getCountryName } from '@/lib/i18n/countryNames';
import Flag from 'react-world-flags';
import { useMemo } from 'react';

export default function InfoCard({ countryCode }: { countryCode: string }) {
  const { t, language } = useTranslations();
  const country = getCountry(countryCode);

  const info = useMemo(() => {
    return getCountryInfo(countryCode);
  }, [countryCode]);

  const adjective = t('countryAdjectives.' + countryCode);

  const getCountryCode = (code: string) => {
    const codeMap: Record<string, string> = { UK: 'GB', US: 'US' };
    return codeMap[code] || code;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Flag + Country Info Panel */}
        <div className="md:col-span-2 p-5 sm:p-6 bg-muted/30 border-b md:border-b-0 md:border-r border-border">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-xl overflow-hidden ring-1 ring-border shrink-0 bg-background flex items-center justify-center">
              <Flag
                code={getCountryCode(country.code)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                title={getCountryName(t, language, country.code)}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {getCountryName(t, language, country.code)}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {country.countryCode} · {country.code}
              </p>
            </div>
          </div>

          {info && (
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <dt className="text-muted-foreground">{t('infoCard.countryCode')}</dt>
                <dd className="font-medium text-foreground">{info.countryCode}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <dt className="text-muted-foreground">{t('infoCard.numberLength')}</dt>
                <dd className="font-medium text-foreground">{info.numberLength} {t('infoCard.digits')}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-muted-foreground">{t('infoCard.example')}</dt>
                <dd className="font-medium text-foreground text-right break-all max-w-48 font-mono text-xs">
                  {info.exampleInternational}
                </dd>
              </div>
            </dl>
          )}
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 p-5 sm:p-6 space-y-4">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {t('infoCard.title', { adjective })}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('infoCard.description', { adjective })}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground">{t('infoCard.validNumbers')}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Grid3x3 size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground">{t('infoCard.differentFormats')}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Zap size={18} className="text-primary shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-foreground">{t('infoCard.fastAndSimple')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
