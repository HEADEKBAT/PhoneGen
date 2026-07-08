/**
 * Generators Check
 *
 * Verifies external generator integrity:
 * - Every generator references a valid product
 * - Detects slug collisions (known: multiple "tool" slugs)
 */

import { CheckFn, CheckResult } from '../config';
import { ALL_GENERATORS } from '@/lib/config/generators';
import { ALL_PRODUCTS, getProduct } from '@/lib/config/products';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const details: string[] = [];

  let orphanCount = 0;
  let collisionCount = 0;

  // Check 1: Every generator references an existing product
  for (const generator of ALL_GENERATORS) {
    const product = getProduct(generator.productId);
    if (!product) {
      affectedPages.push({
        locale: 'all', path: `/?generator=${generator.id}`,
        issue: `Generator "${generator.id}" references missing product "${generator.productId}"`,
      });
      orphanCount++;
    }
  }

  if (orphanCount === 0) {
    details.push('All generators reference valid products');
  }

  // Check 2: Detect slug collisions
  const slugCounts = new Map<string, string[]>();
  for (const generator of ALL_GENERATORS) {
    const existing = slugCounts.get(generator.slug) || [];
    existing.push(generator.id);
    slugCounts.set(generator.slug, existing);
  }

  for (const [slug, ids] of slugCounts.entries()) {
    if (ids.length > 1) {
      // Multiple generators sharing the same slug (e.g., "tool")
      // This is expected for barcode generators but worth noting
      collisionCount++;
      affectedPages.push({
        locale: 'all', path: `/?slug=${slug}`,
        issue: `Slug "${slug}" shared by ${ids.length} generators: ${ids.join(', ')} (expected for tool pages)`,
      });
    }
  }

  if (collisionCount > 0) {
    details.push(`${collisionCount} slug collision(s) detected (expected for tool pages)`);
  }

  const isClean = orphanCount === 0 && collisionCount === 0;
  const status = orphanCount === 0 ? (collisionCount > 0 ? 'warn' : 'pass') : 'fail';
  const score = orphanCount > 0 ? 50 : (collisionCount > 0 ? 85 : 100);

  return {
    checkId: 'generators',
    label: 'Generators',
    status,
    score,
    maxScore: 100,
    details: details.length > 0 ? details : ['No generator issues found'],
    affectedPages,
  };
};

export default check;
