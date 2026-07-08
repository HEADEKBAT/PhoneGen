/**
 * Twitter Card Check
 *
 * Verifies Twitter card tags are generated for all page types.
 */

import { CheckFn, CheckResult } from '../config';
import { generateMetadata, SEO_LOCALES } from '@/lib/config/seo';
import { ALL_PRODUCTS } from '@/lib/config/products';
import { PLATFORM_CONFIG } from '@/lib/config';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  // Verify platform-level Twitter config exists
  const twitter = PLATFORM_CONFIG.seo.twitter;
  if (!twitter.card) {
    affectedPages.push({ locale: 'all', path: '/', issue: 'Missing twitter:card in platform config' });
  }
  if (!twitter.title) {
    affectedPages.push({ locale: 'all', path: '/', issue: 'Missing twitter:title in platform config' });
  }
  if (!twitter.description) {
    affectedPages.push({ locale: 'all', path: '/', issue: 'Missing twitter:description in platform config' });
  }

  // Check that each page type generates Twitter metadata
  for (const locale of SEO_LOCALES) {
    const homeMeta = generateMetadata({ type: 'home', locale });
    if (!homeMeta.twitter) {
      affectedPages.push({ locale, path: '/', issue: 'Missing Twitter card metadata' });
    }

    for (const product of ALL_PRODUCTS) {
      const meta = generateMetadata({ type: 'product', locale, product });
      if (!meta.twitter) {
        affectedPages.push({ locale, path: `/${product.slug}`, issue: 'Missing Twitter card' });
      }
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'fail';
  const score = affectedPages.length === 0 ? 100 : Math.max(0, 100 - affectedPages.length * 10);

  return {
    checkId: 'twitter',
    label: 'Twitter',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['All Twitter card tags present']
      : [`${affectedPages.length} Twitter card issues`],
    affectedPages,
  };
};

export default check;
