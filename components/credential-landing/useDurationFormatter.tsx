'use client';

import { useMemo } from 'react';
import type { Duration } from '@/lib/credentialGenerator';
import { useTranslations } from '@/lib/i18n';

/**
 * Formats a crack-time `Duration` in the visitor's language.
 *
 * `Intl.NumberFormat`'s unit style carries the CLDR plural rules, so "2 года"
 * and "5 лет" come out of the platform instead of out of six hand-written
 * translations with three plural forms each. Shared by the strength meter in
 * the tool and the panel on the landing, which would otherwise disagree about
 * how to write the same number.
 */
export function useDurationFormatter(): (duration: Duration) => string {
  const { t, language } = useTranslations();

  const formatters = useMemo(() => {
    const built: Partial<Record<string, Intl.NumberFormat>> = {};
    for (const unit of ['second', 'minute', 'hour', 'day', 'month', 'year']) {
      try {
        built[unit] = new Intl.NumberFormat(language, {
          style: 'unit',
          unit,
          unitDisplay: 'long',
          maximumFractionDigits: 1,
        });
      } catch {
        /* A runtime without unit style; the caller falls back to a bare number. */
      }
    }
    return built;
  }, [language]);

  return (duration: Duration): string => {
    if (duration.unit === 'instant') return t('credential.strength.instant');
    if (duration.unit === 'centuries') return t('credential.strength.centuries');
    const unit = duration.unit.replace(/s$/, '');
    return formatters[unit]?.format(duration.value) ?? `${duration.value} ${unit}`;
  };
}
