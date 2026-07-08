/**
 * OpenGraph Check
 *
 * Verifies OG tags are generated for all page types.
 */

import { CheckFn, CheckResult } from '../config';
import { generateMetadata, SEO_LOCALES } from '@/lib/config/seo';
import { ALL_PRODUCTS } from '@/lib/config/products';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  for (const locale of SEO_LOCALES) {
    // Home
    const homeMeta = generateMetadata({ type: 'home', locale });
    const og = homeMeta.openGraph;
    if (!og) {
      affectedPages.push({ locale, path: '/', issue: 'Missing OpenGraph tags' });
    } else {
      if (!og.title) affectedPages.push({ locale, path: '/', issue: 'Missing og:title' });
      if (!og.description) affectedPages.push({ locale, path: '/', issue: 'Missing og:description' });
      if (!og.url) affectedPages.push({ locale, path: '/', issue: 'Missing og:url' });
      if (!og.siteName) affectedPages.push({ locale, path: '/', issue: 'Missing og:site_name' });
    }

    // Products
    for (const product of ALL_PRODUCTS) {
      const meta = generateMetadata({ type: 'product', locale, product });
      if (!meta.openGraph) {
        affectedPages.push({ locale, path: `/${product.slug}`, issue: 'Missing OpenGraph tags' });
      }
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'warn';
  const score = affectedPages.length === 0 ? 100 : Math.max(0, 100 - affectedPages.length * 3);

  return {
    checkId: 'opengraph',
    label: 'OpenGraph',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['All OpenGraph tags present']
      : [`${affectedPages.length} OG issues found`],
    affectedPages,
  };
};

export default check;
