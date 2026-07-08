/**
 * Metadata Check
 *
 * Verifies generated page metadata (title, description) meets SEO best practices.
 * Uses the actual generateMetadata() output — not raw registry fields.
 */

import { CheckFn, CheckResult } from '../config';
import { ALL_PRODUCTS } from '@/lib/config/products';
import { PLATFORM_CONFIG } from '@/lib/config';
import { SEO_LOCALES } from '@/lib/config/seo';
import { generateMetadata } from '@/lib/config/seo';

const check: CheckFn = async (ctx) => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const { thresholds } = ctx.config;
  const checked = new Set<string>();

  // Check default platform metadata
  const defaultTitle = PLATFORM_CONFIG.seo.defaultTitle;
  if (defaultTitle.length < thresholds.titleMinLen || defaultTitle.length > thresholds.titleMaxLen) {
    affectedPages.push({
      locale: 'all', path: '/',
      issue: `Default title length ${defaultTitle.length} (expected ${thresholds.titleMinLen}-${thresholds.titleMaxLen})`,
    });
  }

  const defaultDesc = PLATFORM_CONFIG.seo.defaultDescription;
  if (defaultDesc.length < thresholds.descMinLen || defaultDesc.length > thresholds.descMaxLen) {
    affectedPages.push({
      locale: 'all', path: '/',
      issue: `Default description length ${defaultDesc.length} (expected ${thresholds.descMinLen}-${thresholds.descMaxLen})`,
    });
  }

  // Check generated product page metadata for active products
  for (const product of ALL_PRODUCTS) {
    if (product.status !== 'active' && product.status !== 'beta') continue;

    for (const locale of SEO_LOCALES.slice(0, 2)) { // sample en + 1 locale
      const meta = generateMetadata({ type: 'product', locale, product });
      const title = typeof meta.title === 'string' ? meta.title : '';
      const desc = meta.description || '';

      if (title && (title.length < thresholds.titleMinLen || title.length > thresholds.titleMaxLen)) {
        affectedPages.push({
          locale, path: `/${product.slug}`,
          issue: `Title "${title.slice(0, 50)}..." length ${title.length} out of range`,
        });
      }
      if (desc && desc.length < thresholds.descMinLen) {
        affectedPages.push({
          locale, path: `/${product.slug}`,
          issue: `Description too short (${desc.length}, min ${thresholds.descMinLen})`,
        });
      }
    }
  }

  // Check home page generated metadata
  for (const locale of SEO_LOCALES.slice(0, 2)) {
    const homeMeta = generateMetadata({ type: 'home', locale });
    const homeTitle = typeof homeMeta.title === 'string' ? homeMeta.title : '';
    if (homeTitle && checked.has('home-' + locale)) continue;
    checked.add('home-' + locale);
    // Home page metadata is the platform default, already checked above
  }

  const totalIssues = affectedPages.length;
  const status = totalIssues === 0 ? 'pass' : 'warn';
  const score = totalIssues === 0 ? 100 : Math.max(70, 100 - totalIssues * 3);

  return {
    checkId: 'metadata',
    label: 'Metadata',
    status,
    score,
    maxScore: 100,
    details: totalIssues === 0
      ? ['All metadata within acceptable ranges']
      : [`${totalIssues} metadata issues found`],
    affectedPages,
  };
};

export default check;
