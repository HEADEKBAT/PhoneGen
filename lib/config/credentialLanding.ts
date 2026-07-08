/**
 * Credential Generator — Landing Page Configuration.
 *
 * All landing section data lives here so components stay generic.
 * Adding a new audience, tool, use case, or article means adding a
 * data entry here — no component changes.
 *
 * For i18n, use getLocalizedCredentialLanding(locale) instead of
 * CREDENTIAL_LANDING directly.
 */

import { getT } from '@/lib/i18n/server';

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface AudienceCard {
  id: string;
  title: string;
  desc: string;
  tools: string[];
}

export interface LandingTool {
  id: string;
  label: string;
  desc: string;
  icon: string;
  mode: string;
}

export interface UseCase {
  id: string;
  label: string;
  desc: string;
  icon: string;
  preset: string;
}

export interface SecurityItem {
  icon: string;
  label: string;
  desc: string;
}

export interface FormatBadge {
  id: string;
  label: string;
  icon: string;
}

export interface LearnArticle {
  id: string;
  label: string;
  desc: string;
  href: string;
}

export interface EcosystemLink {
  id: string;
  label: string;
  desc: string;
  href: string;
  icon: string;
}

export interface CredentialLandingConfig {
  hero: {
    title: string;
    subtitle: string;
    benefits: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  audience: AudienceCard[];
  tools: LandingTool[];
  useCases: UseCase[];
  security: SecurityItem[];
  formats: FormatBadge[];
  learnArticles: LearnArticle[];
  trust: string[];
  ecosystem: EcosystemLink[];
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */

const HERO = {
  title: 'Generate Secure Credentials',
  subtitle:
    'Generate passwords, passphrases, API keys, UUIDs, JWT secrets, random tokens and developer credentials — all locally in your browser.',
  benefits: [
    'Browser Only',
    'No Server Requests',
    'Cryptographically Secure',
    'Free Forever',
    'Open Source',
  ],
  ctaPrimary: 'Start Generating',
  ctaSecondary: 'Explore Tools',
};

/* ── Audience ──────────────────────────────────────────────────────────────── */

const AUDIENCE: AudienceCard[] = [
  {
    id: 'developers',
    title: 'Developers',
    desc: 'Generate UUIDs, JWT secrets, API keys, webhook secrets, and session tokens for your applications.',
    tools: ['UUID', 'JWT', 'API Keys', 'Webhook Secrets', 'Session Tokens'],
  },
  {
    id: 'qa',
    title: 'QA Engineers',
    desc: 'Create bulk test credentials, export to CSV/JSON, and generate unique test accounts for your test suites.',
    tools: ['Bulk Passwords', 'Test Credentials', 'CSV Export', 'Unique Accounts'],
  },
  {
    id: 'devops',
    title: 'DevOps',
    desc: 'Generate secrets, random tokens, Docker secrets, database passwords, and SSH keys for your infrastructure.',
    tools: ['Secrets', 'Random Tokens', 'Docker Secrets', 'DB Passwords'],
  },
  {
    id: 'everyone',
    title: 'Everyone',
    desc: 'Create strong passwords, memorable passphrases, PIN codes, and Wi-Fi passwords for personal use.',
    tools: ['Strong Passwords', 'Memorable Passphrases', 'PIN Codes', 'Wi-Fi Passwords'],
  },
];

/* ── Popular Tools ─────────────────────────────────────────────────────────── */

const TOOLS: LandingTool[] = [
  { id: 'password', label: 'Password Generator', desc: 'Secure random passwords with full control', icon: 'Key', mode: 'random' },
  { id: 'passphrase', label: 'Passphrase Generator', desc: 'Memorable XKCD-style word lists', icon: 'KeyRound', mode: 'passphrase' },
  { id: 'uuid', label: 'UUID Generator', desc: 'UUID v4 random identifiers', icon: 'Hash', mode: 'uuid' },
  { id: 'uuid-v7', label: 'UUID v7 Generator', desc: 'Time-ordered UUID v7 identifiers', icon: 'Clock', mode: 'uuid-v7' },
  { id: 'pin', label: 'Random PIN Generator', desc: 'Numeric PIN codes of any length', icon: 'Scan', mode: 'pin' },
  { id: 'jwt', label: 'JWT Secret Generator', desc: 'Base64URL-encoded HMAC secrets', icon: 'Lock', mode: 'jwt' },
  { id: 'webhook', label: 'Webhook Secret Generator', desc: 'whsec_-prefixed signing secrets', icon: 'Webhook', mode: 'webhook' },
  { id: 'api-key', label: 'API Key Generator', desc: 'Stripe-style prefixed API keys', icon: 'Key', mode: 'api-key' },
  { id: 'token', label: 'Random Token Generator', desc: 'Hex, Base64, or Base64URL tokens', icon: 'Shuffle', mode: 'token' },
  { id: 'hash', label: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256, SHA-512 hashes', icon: 'Fingerprint', mode: 'hash' },
  { id: 'analyzer', label: 'Password Analyzer', desc: 'Check strength, entropy, and crack time', icon: 'ShieldCheck', mode: 'strength' },
];

/* ── Use Cases ─────────────────────────────────────────────────────────────── */

const USE_CASES: UseCase[] = [
  { id: 'wifi', label: 'Create a Wi-Fi Password', desc: '63-character mixed random string', icon: 'Wifi', preset: 'wifi' },
  { id: 'postgres', label: 'Generate PostgreSQL Password', desc: '24-char safe characters', icon: 'Database', preset: 'postgresql' },
  { id: 'docker', label: 'Generate Docker Secret', desc: '32-char hex token', icon: 'Container', preset: 'docker' },
  { id: 'jwt-secret', label: 'Generate JWT Secret', desc: '64-byte Base64URL HMAC secret', icon: 'Lock', preset: 'jwt' },
  { id: 'api-key-gen', label: 'Generate API Key', desc: 'Prefix-based realistic API key', icon: 'Key', preset: 'api-key' },
  { id: 'session', label: 'Generate Session Secret', desc: '32-byte session signing secret', icon: 'ShieldCheck', preset: 'session' },
];

/* ── Security ──────────────────────────────────────────────────────────────── */

const SECURITY: SecurityItem[] = [
  { icon: 'Cpu', label: 'crypto.getRandomValues()', desc: 'Cryptographically secure random values from the Web Crypto API' },
  { icon: 'Globe', label: 'Browser Only', desc: 'All generation happens in your browser — no data sent to any server' },
  { icon: 'EyeOff', label: 'No Tracking', desc: 'We do not track what you generate. No analytics on generated data' },
  { icon: 'CloudOff', label: 'No Cloud Storage', desc: 'Generated credentials are never stored on any server or cloud' },
  { icon: 'Trash2', label: 'No Password History', desc: 'History is stored only in your browser\'s localStorage — you control it' },
  { icon: 'Code', label: 'Open Source', desc: 'Full source code is available on GitHub for audit and transparency' },
];

/* ── Supported Formats ─────────────────────────────────────────────────────── */

const FORMATS: FormatBadge[] = [
  { id: 'password', label: 'Passwords', icon: 'Key' },
  { id: 'pin', label: 'PIN', icon: 'Scan' },
  { id: 'passphrase', label: 'Passphrase', icon: 'KeyRound' },
  { id: 'uuid', label: 'UUID', icon: 'Hash' },
  { id: 'jwt', label: 'JWT', icon: 'Lock' },
  { id: 'api-keys', label: 'API Keys', icon: 'Key' },
  { id: 'hex', label: 'Hex', icon: 'Hash' },
  { id: 'base64', label: 'Base64', icon: 'Hash' },
  { id: 'base64url', label: 'Base64URL', icon: 'Hash' },
  { id: 'tokens', label: 'Tokens', icon: 'Shuffle' },
  { id: 'hashes', label: 'Hashes', icon: 'Fingerprint' },
  { id: 'secrets', label: 'Secrets', icon: 'Lock' },
];

/* ── Learn Articles ────────────────────────────────────────────────────────── */

const LEARN_ARTICLES: LearnArticle[] = [
  { id: 'strong-password', label: 'What makes a strong password?', desc: 'Length, complexity, and unpredictability explained', href: '#' },
  { id: 'password-vs-passphrase', label: 'Password vs Passphrase', desc: 'Why word sequences can be both stronger and more memorable', href: '#' },
  { id: 'entropy', label: 'How password entropy works', desc: 'Understanding bits of entropy and what they mean for security', href: '#' },
  { id: 'password-length', label: 'How long should passwords be?', desc: 'Minimum lengths by use case and threat model', href: '#' },
  { id: 'what-is-uuid', label: 'What is UUID?', desc: 'Universally Unique Identifiers and their variants', href: '#' },
  { id: 'uuid-v4-vs-v7', label: 'UUID v4 vs UUID v7', desc: 'Random vs time-ordered — when to use each', href: '#' },
  { id: 'what-is-jwt-secret', label: 'What is JWT Secret?', desc: 'HMAC secrets for signing JSON Web Tokens', href: '#' },
  { id: 'api-keys', label: 'How API Keys work', desc: 'Prefix-based, bearer tokens, and security best practices', href: '#' },
  { id: 'base64', label: 'What is Base64?', desc: 'Binary-to-text encoding and when to use Base64URL', href: '#' },
  { id: 'crypto-randomness', label: 'What is cryptographic randomness?', desc: 'Why Math.random() is not enough for security', href: '#' },
];

/* ── Trust ──────────────────────────────────────────────────────────────────── */

const TRUST_ITEMS: string[] = [
  'Generated locally',
  'Nothing leaves your browser',
  'Open Source',
  'No registration',
  'No ads',
  'Free forever',
];

/* ── Ecosystem Links ───────────────────────────────────────────────────────── */

const ECOSYSTEM: EcosystemLink[] = [
  { id: 'user', label: 'User Generator', desc: 'Generate realistic user profiles', href: '/user-generator', icon: 'Users' },
  { id: 'email', label: 'Email Generator', desc: 'Generate realistic email addresses', href: '/email-generator', icon: 'Mail' },
  { id: 'phone', label: 'Phone Generator', desc: 'Generate valid phone numbers', href: '/phone-generator', icon: 'Phone' },
  { id: 'company', label: 'Company Generator', desc: 'Generate company profiles', href: '/company-generator', icon: 'Building' },
];

/* ── Aggregated Config ─────────────────────────────────────────────────────── */

export const CREDENTIAL_LANDING: CredentialLandingConfig = {
  hero: HERO,
  audience: AUDIENCE,
  tools: TOOLS,
  useCases: USE_CASES,
  security: SECURITY,
  formats: FORMATS,
  learnArticles: LEARN_ARTICLES,
  trust: TRUST_ITEMS,
  ecosystem: ECOSYSTEM,
};

/* ── Localized factory — reads from locale JSON files via getT() ─────────── */

/**
 * Returns a locale-aware CredentialLandingConfig by reading translations
 * from `credentialLanding.*` keys in the locale JSON files.
 *
 * Falls back to English for any missing key, so partial translations
 * still produce a usable page.
 */
export function getLocalizedCredentialLanding(locale: string): CredentialLandingConfig {
  const t = getT(locale);
  const tk = (key: string) => t(`credentialLanding.${key}`);

  return {
    hero: {
      title: tk('hero.title'),
      subtitle: tk('hero.subtitle'),
      benefits: [
        tk('hero.benefits.0'),
        tk('hero.benefits.1'),
        tk('hero.benefits.2'),
        tk('hero.benefits.3'),
        tk('hero.benefits.4'),
      ],
      ctaPrimary: tk('hero.ctaPrimary'),
      ctaSecondary: tk('hero.ctaSecondary'),
    },
    audience: [
      {
        id: 'developers',
        title: tk('audience_title_developers'),
        desc: tk('audience_desc_developers'),
        tools: ['UUID', 'JWT', 'API Keys', 'Webhook Secrets', 'Session Tokens'],
      },
      {
        id: 'qa',
        title: tk('audience_title_qa'),
        desc: tk('audience_desc_qa'),
        tools: ['Bulk Passwords', 'Test Credentials', 'CSV Export', 'Unique Accounts'],
      },
      {
        id: 'devops',
        title: tk('audience_title_devops'),
        desc: tk('audience_desc_devops'),
        tools: ['Secrets', 'Random Tokens', 'Docker Secrets', 'DB Passwords'],
      },
      {
        id: 'everyone',
        title: tk('audience_title_everyone'),
        desc: tk('audience_desc_everyone'),
        tools: ['Strong Passwords', 'Memorable Passphrases', 'PIN Codes', 'Wi-Fi Passwords'],
      },
    ],
    tools: [
      { id: 'password', label: tk('tools_password'), desc: tk('tools_password_desc'), icon: 'Key', mode: 'random' },
      { id: 'passphrase', label: tk('tools_passphrase'), desc: tk('tools_passphrase_desc'), icon: 'KeyRound', mode: 'passphrase' },
      { id: 'uuid', label: tk('tools_uuid'), desc: tk('tools_uuid_desc'), icon: 'Hash', mode: 'uuid' },
      { id: 'uuid-v7', label: tk('tools_uuid_v7'), desc: tk('tools_uuid_v7_desc'), icon: 'Clock', mode: 'uuid-v7' },
      { id: 'pin', label: tk('tools_pin'), desc: tk('tools_pin_desc'), icon: 'Scan', mode: 'pin' },
      { id: 'jwt', label: tk('tools_jwt'), desc: tk('tools_jwt_desc'), icon: 'Lock', mode: 'jwt' },
      { id: 'webhook', label: tk('tools_webhook'), desc: tk('tools_webhook_desc'), icon: 'Webhook', mode: 'webhook' },
      { id: 'api-key', label: tk('tools_api_key'), desc: tk('tools_api_key_desc'), icon: 'Key', mode: 'api-key' },
      { id: 'token', label: tk('tools_token'), desc: tk('tools_token_desc'), icon: 'Shuffle', mode: 'token' },
      { id: 'hash', label: tk('tools_hash'), desc: tk('tools_hash_desc'), icon: 'Fingerprint', mode: 'hash' },
      { id: 'analyzer', label: tk('tools_analyzer'), desc: tk('tools_analyzer_desc'), icon: 'ShieldCheck', mode: 'strength' },
    ],
    useCases: [
      { id: 'wifi', label: tk('use_case_wifi'), desc: tk('use_case_wifi_desc'), icon: 'Wifi', preset: 'wifi' },
      { id: 'postgres', label: tk('use_case_postgres'), desc: tk('use_case_postgres_desc'), icon: 'Database', preset: 'postgresql' },
      { id: 'docker', label: tk('use_case_docker'), desc: tk('use_case_docker_desc'), icon: 'Container', preset: 'docker' },
      { id: 'jwt-secret', label: tk('use_case_jwt'), desc: tk('use_case_jwt_desc'), icon: 'Lock', preset: 'jwt' },
      { id: 'api-key-gen', label: tk('use_case_api_key'), desc: tk('use_case_api_key_desc'), icon: 'Key', preset: 'api-key' },
      { id: 'session', label: tk('use_case_session'), desc: tk('use_case_session_desc'), icon: 'ShieldCheck', preset: 'session' },
    ],
    security: [
      { icon: 'Cpu', label: tk('security_crypto'), desc: tk('security_crypto_desc') },
      { icon: 'Globe', label: tk('security_browser'), desc: tk('security_browser_desc') },
      { icon: 'EyeOff', label: tk('security_tracking'), desc: tk('security_tracking_desc') },
      { icon: 'CloudOff', label: tk('security_storage'), desc: tk('security_storage_desc') },
      { icon: 'Trash2', label: tk('security_history'), desc: tk('security_history_desc') },
      { icon: 'Code', label: tk('security_opensource'), desc: tk('security_opensource_desc') },
    ],
    formats: [
      { id: 'password', label: tk('formats_passwords'), icon: 'Key' },
      { id: 'pin', label: tk('formats_pin'), icon: 'Scan' },
      { id: 'passphrase', label: tk('formats_passphrase'), icon: 'KeyRound' },
      { id: 'uuid', label: tk('formats_uuid'), icon: 'Hash' },
      { id: 'jwt', label: tk('formats_jwt'), icon: 'Lock' },
      { id: 'api-keys', label: tk('formats_api_keys'), icon: 'Key' },
      { id: 'hex', label: tk('formats_hex'), icon: 'Hash' },
      { id: 'base64', label: tk('formats_base64'), icon: 'Hash' },
      { id: 'base64url', label: tk('formats_base64url'), icon: 'Hash' },
      { id: 'tokens', label: tk('formats_tokens'), icon: 'Shuffle' },
      { id: 'hashes', label: tk('formats_hashes'), icon: 'Fingerprint' },
      { id: 'secrets', label: tk('formats_secrets'), icon: 'Lock' },
    ],
    learnArticles: [
      { id: 'strong-password', label: tk('learn_strong_password'), desc: tk('learn_strong_password_desc'), href: '#' },
      { id: 'password-vs-passphrase', label: tk('learn_password_vs_passphrase'), desc: tk('learn_password_vs_passphrase_desc'), href: '#' },
      { id: 'entropy', label: tk('learn_entropy'), desc: tk('learn_entropy_desc'), href: '#' },
      { id: 'password-length', label: tk('learn_password_length'), desc: tk('learn_password_length_desc'), href: '#' },
      { id: 'what-is-uuid', label: tk('learn_what_is_uuid'), desc: tk('learn_what_is_uuid_desc'), href: '#' },
      { id: 'uuid-v4-vs-v7', label: tk('learn_uuid_v4_vs_v7'), desc: tk('learn_uuid_v4_vs_v7_desc'), href: '#' },
      { id: 'what-is-jwt-secret', label: tk('learn_what_is_jwt_secret'), desc: tk('learn_what_is_jwt_secret_desc'), href: '#' },
      { id: 'api-keys', label: tk('learn_api_keys'), desc: tk('learn_api_keys_desc'), href: '#' },
      { id: 'base64', label: tk('learn_base64'), desc: tk('learn_base64_desc'), href: '#' },
      { id: 'crypto-randomness', label: tk('learn_crypto_randomness'), desc: tk('learn_crypto_randomness_desc'), href: '#' },
    ],
    trust: [
      tk('trust.0'), tk('trust.1'), tk('trust.2'),
      tk('trust.3'), tk('trust.4'), tk('trust.5'),
    ],
    ecosystem: [
      { id: 'user', label: tk('ecosystem_user'), desc: tk('ecosystem_user_desc'), href: '/user-generator', icon: 'Users' },
      { id: 'email', label: tk('ecosystem_email'), desc: tk('ecosystem_email_desc'), href: '/email-generator', icon: 'Mail' },
      { id: 'phone', label: tk('ecosystem_phone'), desc: tk('ecosystem_phone_desc'), href: '/phone-generator', icon: 'Phone' },
      { id: 'company', label: tk('ecosystem_company'), desc: tk('ecosystem_company_desc'), href: '/company-generator', icon: 'Building' },
      { id: 'barcode', label: tk('ecosystem_barcode'), desc: tk('ecosystem_barcode_desc'), href: '/barcode-generator', icon: 'Scan' },
    ],
  };
}

/** Localized FAQ pairs from the JSON translations */
export function getLocalizedFAQs(locale: string): { q: string; a: string }[] {
  const t = getT(locale);
  const faqs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 8; i++) {
    const q = t(`credentialLanding.faqs.${i - 1}.q`);
    const a = t(`credentialLanding.faqs.${i - 1}.a`);
    faqs.push({ q, a });
  }
  return faqs;
}
