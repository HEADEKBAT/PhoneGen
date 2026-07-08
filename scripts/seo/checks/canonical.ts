/**
 * Canonical Check
 *
 * Verifies canonical URL generation is correct across all page types.
 * Uses the seo.ts config's generateMetadata to validate canonical logic.
 */

import { CheckFn, CheckResult } from '../config';
import { generateMetadata, SEO_LOCALES } from '@/lib/config/seo';
import { ALL_PRODUCTS } from '@/lib/config/products';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  for (const locale of SEO_LOCALES) {
    // Check home page canonical
    const homeMeta = generateMetadata({ type: 'home', locale });
    const homeCanonical = homeMeta.alternates?.canonical;
    if (!homeCanonical) {
      affectedPages.push({ locale, path: '/', issue: 'Missing canonical URL' });
    } else if (typeof homeCanonical === 'string' && !homeCanonical.includes(locale)) {
      affectedPages.push({ locale, path: '/', issue: `Canonical missing locale "${locale}"` });
    }

    // Check each product page canonical
    for (const product of ALL_PRODUCTS) {
      const meta = generateMetadata({
        type: 'product',
        locale,
        product,
      });
      const canonical = meta.alternates?.canonical;
      if (!canonical) {
        affectedPages.push({ locale, path: `/${product.slug}`, issue: 'Missing canonical URL' });
      } else if (typeof canonical === 'string' && !canonical.includes(locale)) {
        affectedPages.push({ locale, path: `/${product.slug}`, issue: `Canonical missing locale "${locale}"` });
      }
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'warn';
  const score = affectedPages.length === 0 ? 100 : Math.max(80, 100 - affectedPages.length * 5);

  return {
    checkId: 'canonical',
    label: 'Canonical',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['All canonical URLs properly generated']
      : [`${affectedPages.length} canonical issues found`],
    affectedPages,
  };
};

export default check;
