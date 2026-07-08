'use client';

/**
 * Resolve a localized country name with automatic fallback.
 *
 * Tries the translation dictionary first (for hardcoded entries like
 * "countries.US" → "United States").  When no translation exists falls
 * back to the native `Intl.DisplayNames` API so that every one of the
 * 245+ libphonenumber regions produces a correct localized name without
 * bloating translation files.
 */
export function getCountryName(
  t: (key: string) => string,
  locale: string,
  isoCode: string,
): string {
  const key = 'countries.' + isoCode;
  const translated = t(key);

  /* Translation found — use it */
  if (translated !== key) return translated;

  /* Fall back to native Intl.DisplayNames */
  try {
    const name = new Intl.DisplayNames(
      locale.split('-')[0],
      { type: 'region' },
    ).of(isoCode.toUpperCase());
    if (name) return name;
  } catch {
    /* ignore */
  }

  return isoCode.toUpperCase();
}
