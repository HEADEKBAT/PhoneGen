/**
 * Email Generator — standalone engine.
 *
 * Builds emails from names + real domains.
 * Supports multiple generation modes: random, professional, corporate, disposable, nickname.
 */

import { getFakerForCountry } from './country';

/* ── Types ──────────────────────────────────────────────────────────────── */

export type EmailMode = 'random' | 'professional' | 'corporate' | 'disposable' | 'nickname';

export interface EmailResult {
  email: string;
  domain: string;
  pattern: string;
  mode: EmailMode;
}

export interface EmailOptions {
  firstName?: string;
  lastName?: string;
  country?: string;
  mode?: EmailMode;
  domain?: string;
}

export interface BulkEmailOptions extends EmailOptions {
  quantity: number;
}

/* ── Domain lists ───────────────────────────────────────────────────────── */

const POPULAR_DOMAINS = [
  'gmail.com',
  'outlook.com',
  'icloud.com',
  'proton.me',
  'hotmail.com',
  'yahoo.com',
  'fastmail.com',
  'mail.com',
  'zoho.com',
  'aol.com',
  'gmx.com',
  'yandex.com',
];

const PROFESSIONAL_DOMAINS = [
  'company.com',
  'corp.net',
  'business.io',
  'enterprise.co',
  'official.org',
  'workplace.com',
  'profession.dev',
];

const CORPORATE_DOMAINS = [
  'acmecorp.com',
  'globex.io',
  'initech.co',
  'umbrella.org',
  'stark.dev',
  'wayne.net',
  'cyberdyne.systems',
  'hooli.com',
  'massivedynamic.co',
];

const DISPOSABLE_DOMAINS = [
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'tempmail.net',
  'fakeinbox.com',
];

/* ── First-name word bank for nickname mode ─────────────────────────────── */

const NICKNAME_PREFIXES = [
  'cool', 'super', 'mega', 'ultra', 'hyper', 'neo', 'zen', 'flux',
  'pixel', 'crypto', 'cyber', 'digital', 'astro', 'cosmo', 'quantum',
];

const NICKNAME_SUFFIXES = [
  'bee', 'fox', 'owl', 'cat', 'dog', 'wolf', 'bear', 'hawk',
  'fish', 'bird', 'lion', 'tiger', 'panda', 'koala', 'eagle',
];

/* ── Patterns ───────────────────────────────────────────────────────────── */

const PATTERNS: Record<EmailMode, (first: string, last: string) => string> = {
  random: (f, l) => {
    const patterns = [
      () => `${f}.${l}`,
      () => `${f[0]}${l}`,
      () => `${f}${l}`,
      () => `${f}.${l}${Math.floor(Math.random() * 90) + 10}`,
      () => `${f[0]}.${l}${Math.floor(Math.random() * 99)}`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },
  professional: (f, l) => {
    const patterns = [
      () => `${f}.${l}`,
      () => `${f[0]}.${l}`,
      () => `${f}.${l}${Math.floor(Math.random() * 99)}`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },
  corporate: (f, l) => {
    const patterns = [
      () => `${f[0]}${l}`,
      () => `${f}.${l}`,
      () => `${l}.${f[0]}`,
      () => `${f}${l[0]}`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },
  disposable: (f, l) => {
    const patterns = [
      () => `${f}${l}${Math.floor(Math.random() * 999)}`,
      () => `user${Math.floor(Math.random() * 99999)}`,
      () => `${f[0]}${l}${Math.floor(Math.random() * 999)}`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
  },
  nickname: () => {
    const prefix = NICKNAME_PREFIXES[Math.floor(Math.random() * NICKNAME_PREFIXES.length)];
    const suffix = NICKNAME_SUFFIXES[Math.floor(Math.random() * NICKNAME_SUFFIXES.length)];
    const num = Math.floor(Math.random() * 999);
    return `${prefix}${suffix}${num}`;
  },
};

/* ── Generator ──────────────────────────────────────────────────────────── */

const DOMAIN_SETS: Record<EmailMode, string[]> = {
  random: POPULAR_DOMAINS,
  professional: PROFESSIONAL_DOMAINS,
  corporate: CORPORATE_DOMAINS,
  disposable: DISPOSABLE_DOMAINS,
  nickname: POPULAR_DOMAINS,
};

/**
 * Generate a single email address.
 */
export function generateEmail(options: EmailOptions = {}): EmailResult {
  const mode = options.mode ?? 'random';

  let firstName: string;
  let lastName: string;

  if (options.firstName && options.lastName) {
    firstName = options.firstName;
    lastName = options.lastName;
  } else {
    const faker = getFakerForCountry(options.country ?? 'US');
    firstName = faker.person.firstName().toLowerCase();
    lastName = faker.person.lastName().toLowerCase();
  }

  /* Determine domain */
  let domain: string;
  if (options.domain) {
    domain = options.domain;
  } else {
    const domains = DOMAIN_SETS[mode];
    domain = domains[Math.floor(Math.random() * domains.length)];
  }

  const local = PATTERNS[mode](firstName, lastName);
  const email = `${local}@${domain}`;

  return { email, domain, pattern: mode === 'nickname' ? 'nickname' : 'first.last', mode };
}

/**
 * Generate multiple email addresses.
 */
export function generateEmails(options: BulkEmailOptions): EmailResult[] {
  const results: EmailResult[] = [];
  for (let i = 0; i < options.quantity; i++) {
    /* For bulk generation, generate fresh name each time */
    const opts = { ...options, firstName: undefined, lastName: undefined };
    results.push(generateEmail(opts));
  }
  return results;
}
