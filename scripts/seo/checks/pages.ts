/**
 * Pages Check
 *
 * Verifies every active/beta product and generator from the registries
 * has a corresponding file in the app directory.
 *
 * Planned/coming-soon products are skipped (their pages don't exist yet).
 * Phone generators use dynamic [country] routes — they're handled by the
 * parent product's country page, not individual page files.
 */

import { CheckFn, CheckResult } from '../config';
import { ALL_PRODUCTS } from '@/lib/config/products';
import { ALL_GENERATORS } from '@/lib/config/generators';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import * as fs from 'fs';
import * as path from 'path';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const details: string[] = [];

  const appDir = path.resolve(process.cwd(), 'app/[locale]');

  // Check product landing pages — skip planned/coming-soon
  const activeProducts = ALL_PRODUCTS.filter(
    (p) => p.status === 'active' || p.status === 'beta',
  );
  for (const product of activeProducts) {
    const pagePath = path.join(appDir, `${product.slug}`, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      affectedPages.push({
        locale: 'all', path: `/${product.slug}`,
        issue: `Missing page file: app/[locale]/${product.slug}/page.tsx`,
      });
    }
  }

  // Check generator tool pages — deduplicate by product+slug
  // Phone generators use parent product's dynamic [country] route
  const phoneProductIds = new Set(
    ALL_PRODUCTS.filter((p) => p.hasCountries).map((p) => p.id),
  );
  const seenPaths = new Set<string>();

  for (const generator of ALL_GENERATORS) {
    const product = ALL_PRODUCTS.find((p) => p.id === generator.productId);
    if (!product) continue;
    if (product.status !== 'active' && product.status !== 'beta') continue;

    // Skip generators for products with dynamic country routes
    if (phoneProductIds.has(generator.productId)) {
      const countryPagePath = path.join(appDir, `${product.slug}`, '[country]', 'page.tsx');
      const exists = fs.existsSync(countryPagePath);
      details.push(`Generator "${generator.id}" served via parent's [country] route (file exists: ${exists})`);
      continue;
    }

    const pageKey = `${product.slug}/${generator.slug}`;
    if (seenPaths.has(pageKey)) continue;
    seenPaths.add(pageKey);

    let found = false;
    const primaryPath = path.join(appDir, `${product.slug}`, `${generator.slug}`, 'page.tsx');
    if (fs.existsSync(primaryPath)) {
      found = true;
    }

    // Check alternate path (for slug "tool")
    if (!found && generator.slug === 'tool') {
      const altPath = path.join(appDir, `${product.slug}`, 'tool', 'page.tsx');
      if (fs.existsSync(altPath)) {
        found = true;
      }
    }

    if (!found) {
      affectedPages.push({
        locale: 'all', path: `/${pageKey}`,
        issue: `Missing page file for generator "${generator.id}"`,
      });
    }
  }

  // Check SEO pages exist
  for (const seoPage of ALL_SEO_PAGES) {
    const pagePath = path.join(appDir, `${seoPage.slug}`, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      affectedPages.push({
        locale: 'all', path: `/${seoPage.slug}`,
        issue: `Missing SEO page: app/[locale]/${seoPage.slug}/page.tsx`,
      });
    }
  }

  // Check barcode SEO pages exist
  for (const barcodePage of ALL_BARCODE_SEO_PAGES) {
    const pagePath = path.join(appDir, `${barcodePage.slug}`, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      affectedPages.push({
        locale: 'all', path: `/${barcodePage.slug}`,
        issue: `Missing barcode SEO page: app/[locale]/${barcodePage.slug}/page.tsx`,
      });
    }
  }

  const total = affectedPages.length;
  const status = total === 0 ? 'pass' : 'fail';
  const score = total === 0 ? 100 : Math.max(0, 100 - total * 10);

  return {
    checkId: 'pages',
    label: 'Pages',
    status,
    score,
    maxScore: 100,
    details: total === 0
      ? ['All registered pages have corresponding files']
      : [`${total} missing page files`],
    affectedPages,
  };
};

export default check;
