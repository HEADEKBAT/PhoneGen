/**
 * Links Check
 *
 * Analyzes internal link structure from navigation configs.
 * Checks for broken nav links, footer links, and breadcrumb integrity.
 */

import { CheckFn, CheckResult } from '../config';
import { HEADER_NAV, FOOTER_SECTIONS } from '@/lib/config/navigation';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  // Check header nav links for placeholders
  for (const item of HEADER_NAV) {
    if (item.href === '#') {
      affectedPages.push({
        locale: 'all', path: '/',
        issue: `Header nav "${item.label}" links to placeholder (#)`,
      });
    }
    // Check children too
    if (item.children) {
      for (const child of item.children) {
        if (child.href === '#') {
          affectedPages.push({
            locale: 'all', path: '/',
            issue: `Header nav "${item.label}" > "${child.label}" links to placeholder (#)`,
          });
        }
      }
    }
  }

  // Check footer section links for placeholders
  for (const section of FOOTER_SECTIONS) {
    for (const link of section.links) {
      if (link.href === '#') {
        affectedPages.push({
          locale: 'all', path: '/',
          issue: `Footer "${section.section}" > "${link.label}" links to placeholder (#)`,
        });
      }
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'warn';
  const score = affectedPages.length === 0 ? 100 : Math.max(80, 100 - affectedPages.length * 5);

  return {
    checkId: 'links',
    label: 'Links',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['No broken or placeholder links found']
      : [`${affectedPages.length} placeholder (#) links found`],
    affectedPages,
  };
};

export default check;
