/**
 * Localization Check
 *
 * Verifies i18n coverage across all 6 locales.
 * Checks that all translation files exist and have expected keys.
 */

import { CheckFn, CheckResult } from '../config';
import * as fs from 'fs';
import * as path from 'path';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const details: string[] = [];

  const i18nDir = path.resolve(process.cwd(), 'lib/i18n');
  const expectedLocales = ['en', 'ru', 'de', 'es', 'fr', 'pt'];

  let enKeys: string[] = [];

  // Check each locale file exists
  for (const locale of expectedLocales) {
    const filePath = path.join(i18nDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      affectedPages.push({
        locale, path: '/',
        issue: `Missing translation file: lib/i18n/${locale}.json`,
      });
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      const keys = Object.keys(flattenObject(json));

      if (locale === 'en') {
        enKeys = keys;
      } else {
        // Compare keys with English
        const missingKeys = enKeys.filter((k) => !keys.includes(k));
        if (missingKeys.length > 0) {
          affectedPages.push({
            locale, path: '/',
            issue: `Missing ${missingKeys.length} translations compared to en: ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? '...' : ''}`,
          });
          details.push(`  ${locale}: ${missingKeys.length} untranslated keys`);
        }
      }
    } catch (err) {
      affectedPages.push({
        locale, path: '/',
        issue: `Invalid JSON in lib/i18n/${locale}.json: ${err instanceof Error ? err.message : 'parse error'}`,
      });
    }
  }

  if (affectedPages.length === 0) {
    details.push('All 6 locale files present and consistent');
  }

  const issuesCount = affectedPages.length;
  const status = issuesCount === 0 ? 'pass' : 'warn';
  const score = issuesCount === 0 ? 100 : Math.max(50, 100 - issuesCount * 10);

  return {
    checkId: 'localization',
    label: 'Localization',
    status,
    score,
    maxScore: 100,
    details: details.length > 0 ? details : [`${issuesCount} localization issues`],
    affectedPages,
  };
};

/** Flatten nested object keys into dot-notation strings */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

export default check;
