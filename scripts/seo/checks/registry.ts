/**
 * Registry Check
 *
 * Verifies internal consistency across all registries:
 * - No duplicate product/generator IDs
 * - No SEO page slug conflicts with product slugs
 * - All status values are valid
 * - Slug collisions (known: "tool" shared by barcode generators)
 */

import { CheckFn, CheckResult } from '../config';
import { ALL_PRODUCTS } from '@/lib/config/products';
import { ALL_GENERATORS } from '@/lib/config/generators';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';

const VALID_STATUSES = ['active', 'beta', 'coming-soon', 'planned'];

const check: CheckFn = async () => {
  const issues: Array<{ locale: string; path: string; issue: string }> = [];
  const details: string[] = [];

  // 1. Check for duplicate product IDs
  const productIds = new Set<string>();
  for (const product of ALL_PRODUCTS) {
    if (productIds.has(product.id)) {
      issues.push({ locale: 'all', path: '/', issue: `Duplicate product ID: "${product.id}"` });
    }
    productIds.add(product.id);

    if (!VALID_STATUSES.includes(product.status)) {
      issues.push({ locale: 'all', path: `/${product.slug}`, issue: `Invalid status "${product.status}"` });
    }
  }

  // 2. Check for duplicate generator IDs
  const generatorIds = new Set<string>();
  for (const generator of ALL_GENERATORS) {
    if (generatorIds.has(generator.id)) {
      issues.push({ locale: 'all', path: '/', issue: `Duplicate generator ID: "${generator.id}"` });
    }
    generatorIds.add(generator.id);
  }

  // 3. Check slug conflicts between SEO pages and products
  const productSlugs = new Set(ALL_PRODUCTS.map((p) => p.slug));
  for (const seoPage of ALL_SEO_PAGES) {
    if (productSlugs.has(seoPage.slug)) {
      issues.push({
        locale: 'all', path: `/${seoPage.slug}`,
        issue: `SEO page slug "${seoPage.slug}" conflicts with product slug`,
      });
    }
  }
  for (const barcodePage of ALL_BARCODE_SEO_PAGES) {
    if (productSlugs.has(barcodePage.slug)) {
      issues.push({
        locale: 'all', path: `/${barcodePage.slug}`,
        issue: `Barcode SEO page slug "${barcodePage.slug}" conflicts with product slug`,
      });
    }
  }

  // 4. Check generator slug collisions (known: "tool" is shared)
  const slugCounts = new Map<string, number>();
  for (const gen of ALL_GENERATORS) {
    slugCounts.set(gen.slug, (slugCounts.get(gen.slug) || 0) + 1);
  }
  for (const [slug, count] of slugCounts) {
    if (count > 1) {
      details.push(`Slug "${slug}" shared by ${count} generators (expected — "tool" is the barcode studio slug)`);
    }
  }

  if (issues.length === 0) {
    details.push('All registries internally consistent');
  }

  const status = issues.length === 0 ? 'pass' : 'warn';
  const score = issues.length === 0 ? 100 : Math.max(50, 100 - issues.length * 15);

  return {
    checkId: 'registry',
    label: 'Registry',
    status,
    score,
    maxScore: 100,
    details,
    affectedPages: issues,
  };
};

export default check;
