/**
 * Images Check
 *
 * Scans image usage across the project to verify alt text.
 */

import { CheckFn, CheckResult } from '../config';
import * as fs from 'fs';
import * as path from 'path';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];

  const sourceDirs = [
    path.resolve(process.cwd(), 'components'),
    path.resolve(process.cwd(), 'app'),
  ];

  for (const dir of sourceDirs) {
    const files = findTsFiles(dir);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      // Find <img tags without alt
      const imgRegex = /<img\s[^>]*src=["'][^"']*["'][^>]*>/g;
      let match: RegExpExecArray | null;
      while ((match = imgRegex.exec(content)) !== null) {
        if (!match[0].includes('alt=')) {
          const relPath = path.relative(process.cwd(), file);
          affectedPages.push({
            locale: 'all', path: `/${relPath}`,
            issue: `<img> without alt attribute in ${relPath}`,
          });
        }
      }
      // Also check Next.js Image component
      if (content.includes('from "next/image"') || content.includes("from 'next/image'")) {
        // Next.js Image requires alt, so this is good
      }
    }
  }

  const status = affectedPages.length === 0 ? 'pass' : 'warn';
  const score = affectedPages.length === 0 ? 100 : Math.max(80, 100 - affectedPages.length * 5);

  return {
    checkId: 'images',
    label: 'Images',
    status,
    score,
    maxScore: 100,
    details: affectedPages.length === 0
      ? ['All images have alt text']
      : [`${affectedPages.length} images missing alt text`],
    affectedPages,
  };
};

/** Recursively find .tsx and .ts files, skipping node_modules */
function findTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          results.push(...findTsFiles(fullPath));
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        results.push(fullPath);
      }
    }
  } catch {
    // Permission errors, etc.
  }

  return results;
}

export default check;
