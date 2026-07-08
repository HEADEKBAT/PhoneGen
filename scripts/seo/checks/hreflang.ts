/**
 * Hreflang Check
 *
 * Verifies hreflang alternates are generated for all 6 locales
 * plus x-default on every page type.
 */

import { CheckFn, CheckResult } from '../config';
import { generateMetadata, SEO_LOCALES } from '@/lib/config/seo';
import { ALL_PRODUCTS } from '@/lib/config/products';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const expectedLocales = [...SEO_LOCALES, 'x-default'];

  function checkLanguages(
    locale: string,
    path: string,
    languages: Record<string, unknown> | undefined,
  ): void {
    if (!languages) {
      affectedPages.push({ locale, path, issue: 'Missing hreflang languages' });
      return;
    }
    for (const expected of expectedLocales) {
      if (!(expected in languages)) {
        affectedPages.push({ locale, path, issue: `Missing hreflang for "${expected}"` });
      }
    }
  }

  // Check home page hreflang
  for (const locale of SEO_LOCALES) {
    const meta = generateMetadata({ type: 'home', locale });
    checkLanguages(locale, '/', meta.alternates?.languages as Record<string, unknown> | undefined);
  }

  // Check product page hreflang
  for (const product of ALL_PRODUCTS) {
    for (const locale of SEO_LOCALES) {
      const meta = generateMetadata({ type: 'product', locale, product });
      checkLanguages(locale, `/${product.slug}`, meta.alternates?.languages as Record<string, unknown> | undefined);
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'warn';
  const score = affectedPages.length === 0 ? 100 : Math.max(80, 100 - affectedPages.length * 2);

  return {
    checkId: 'hreflang',
    label: 'Hreflang',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['All hreflang alternates properly generated']
      : [`${affectedPages.length} hreflang issues found`],
    affectedPages,
  };
};

export default check;
