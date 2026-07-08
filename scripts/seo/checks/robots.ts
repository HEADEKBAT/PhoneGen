/**
 * Robots Check
 *
 * Verifies robots.txt exists and allows indexing.
 */

import { CheckFn, CheckResult } from '../config';
import * as fs from 'fs';
import * as path from 'path';

const check: CheckFn = async () => {
  const affectedPages: Array<{ locale: string; path: string; issue: string }> = [];
  const details: string[] = [];

  // Check robots.txt exists in the public directory
  const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
  const appRobotsPath = path.resolve(process.cwd(), 'app', 'robots.ts');

  let robotsContent = '';

  if (fs.existsSync(robotsPath)) {
    robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    details.push('robots.txt found in public/');
  } else if (fs.existsSync(appRobotsPath)) {
    details.push('robots.ts route found (dynamic robots.txt)');
  } else {
    affectedPages.push({
      locale: 'all',
      path: '/robots.txt',
      issue: 'Missing robots.txt — crawlers may not discover the sitemap',
    });
    return {
      checkId: 'robots',
      label: 'Robots',
      status: 'fail',
      score: 0,
      maxScore: 100,
      details: ['robots.txt not found in public/ or app/robots.ts'],
      affectedPages,
    };
  }

  // If we have the content, verify it
  if (robotsContent) {
    if (!robotsContent.includes('Allow: /')) {
      affectedPages.push({
        locale: 'all', path: '/robots.txt',
        issue: 'Missing Allow: / — may block crawlers',
      });
    }
    if (!robotsContent.includes('Sitemap:')) {
      affectedPages.push({
        locale: 'all', path: '/robots.txt',
        issue: 'Missing Sitemap directive — crawlers may not find sitemap.xml',
      });
    }
  }

  if (affectedPages.length > 0) {
    return {
      checkId: 'robots',
      label: 'Robots',
      status: 'warn',
      score: 50,
      maxScore: 100,
      details: ['robots.txt found but has issues'],
      affectedPages,
    };
  }

  return {
    checkId: 'robots',
    label: 'Robots',
    status: 'pass',
    score: 100,
    maxScore: 100,
    details: ['robots.txt properly configured'],
    affectedPages: [],
  };
};

export default check;
