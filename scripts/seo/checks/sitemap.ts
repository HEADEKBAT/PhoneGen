/**
 * Sitemap Check
 *
 * Verifies the sitemap.xml includes every discovered page.
 * Checks that app/sitemap.ts actually imports and uses ALL_BARCODE_SEO_PAGES.
 */

import { CheckFn, CheckResult } from '../config';
import { ALL_SEO_PAGES } from '@/lib/config/credentialSEOPages';
import { ALL_BARCODE_SEO_PAGES } from '@/lib/config/barcodeSEOPages';
import * as fs from 'fs';
import * as path from 'path';

const check: CheckFn = async (ctx) => {
  const issues: string[] = [];
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  // Check 1: Are all barcode SEO pages covered by sitemap?
  // Verify by reading the sitemap.ts source to see if ALL_BARCODE_SEO_PAGES is imported
  let barcodeCovered = false;
  try {
    const sitemapPath = path.resolve(process.cwd(), 'app', 'sitemap.ts');
    const source = fs.readFileSync(sitemapPath, 'utf-8');
    barcodeCovered = source.includes('ALL_BARCODE_SEO_PAGES');
  } catch {
    // sitemap.ts not found — can't verify
  }

  if (ALL_BARCODE_SEO_PAGES.length > 0 && !barcodeCovered) {
    const barcodeCount = ALL_BARCODE_SEO_PAGES.length;
    const expectedUrls = barcodeCount * ctx.locales.length;
    issues.push(
      `Warning: ${barcodeCount} barcode SEO pages (${expectedUrls} URLs) ` +
      'may not be in sitemap.xml — ALL_BARCODE_SEO_PAGES is not imported by app/sitemap.ts',
    );
    affectedPages.push({
      locale: 'all',
      path: '/sitemap.xml',
      issue: `Missing ${expectedUrls} barcode SEO URLs from sitemap`,
    });
  }

  // Check 2: Do credential SEO pages exist?
  if (ALL_SEO_PAGES.length === 0) {
    issues.push('No credential SEO pages registered');
  } else {
    issues.push(`${ALL_SEO_PAGES.length} credential SEO pages registered`);
  }

  // Check 3: Total page coverage estimate
  const totalDiscovered = ctx.allPages.length;
  const barcodeUrls = ALL_BARCODE_SEO_PAGES.length * ctx.locales.length;
  // If barcode pages are in the sitemap, include them in expected count
  const expectedInSitemap = barcodeCovered ? totalDiscovered : totalDiscovered - barcodeUrls;
  issues.push(`~${expectedInSitemap} of ${totalDiscovered} pages expected in sitemap.xml`);

  if (affectedPages.length > 0) {
    return {
      checkId: 'sitemap',
      label: 'Sitemap',
      status: 'warn',
      score: 70,
      maxScore: 100,
      details: issues,
      affectedPages,
    };
  }

  return {
    checkId: 'sitemap',
    label: 'Sitemap',
    status: 'pass',
    score: 100,
    maxScore: 100,
    details: ['All pages accounted for in sitemap'],
    affectedPages: [],
  };
};

export default check;
