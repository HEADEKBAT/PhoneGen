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
  /** Optional slug for the new /credential-generator/{slug} URL. Falls back to legacy tool?mode=xxx. */
  slug?: string;
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
  trust: string[];
  ecosystem: EcosystemLink[];
}

/*
 * The English copy that used to sit here — HERO, AUDIENCE, TOOLS, USE_CASES,
 * SECURITY, FORMATS, LEARN_ARTICLES, TRUST_ITEMS, ECOSYSTEM and the
 * CREDENTIAL_LANDING object assembled from them — is gone.
 *
 * Every one of those strings existed twice: once here and once in
 * lib/i18n/*.json, which is where the other five languages read it from. Only
 * the JSON was ever rendered — the page imported CREDENTIAL_LANDING and never
 * referenced it — and the two copies had already drifted apart: the constant
 * listed four ecosystem links against the dictionary's five, and carried the
 * `slug` fields that the localized factory dropped, which is why every tool
 * card on the landing pointed at a `?mode=` deep link instead of at one of the
 * eleven tool pages.
 */


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
        tools: [tk('audience_tools_developers_0'), tk('audience_tools_developers_1'), tk('audience_tools_developers_2'), tk('audience_tools_developers_3'), tk('audience_tools_developers_4')],
      },
      {
        id: 'qa',
        title: tk('audience_title_qa'),
        desc: tk('audience_desc_qa'),
        tools: [tk('audience_tools_qa_0'), tk('audience_tools_qa_1'), tk('audience_tools_qa_2'), tk('audience_tools_qa_3')],
      },
      {
        id: 'devops',
        title: tk('audience_title_devops'),
        desc: tk('audience_desc_devops'),
        tools: [tk('audience_tools_devops_0'), tk('audience_tools_devops_1'), tk('audience_tools_devops_2'), tk('audience_tools_devops_3')],
      },
      {
        id: 'everyone',
        title: tk('audience_title_everyone'),
        desc: tk('audience_desc_everyone'),
        tools: [tk('audience_tools_everyone_0'), tk('audience_tools_everyone_1'), tk('audience_tools_everyone_2'), tk('audience_tools_everyone_3')],
      },
    ],
    tools: [
      { id: 'password', label: tk('tools_password'), desc: tk('tools_password_desc'), icon: 'Key', mode: 'random' , slug: 'password-generator' },
      { id: 'passphrase', label: tk('tools_passphrase'), desc: tk('tools_passphrase_desc'), icon: 'KeyRound', mode: 'passphrase' , slug: 'passphrase-generator' },
      { id: 'uuid', label: tk('tools_uuid'), desc: tk('tools_uuid_desc'), icon: 'Hash', mode: 'uuid' , slug: 'uuid-generator' },
      { id: 'uuid-v7', label: tk('tools_uuid_v7'), desc: tk('tools_uuid_v7_desc'), icon: 'Clock', mode: 'uuid-v7' , slug: 'uuid-v7-generator' },
      { id: 'pin', label: tk('tools_pin'), desc: tk('tools_pin_desc'), icon: 'Scan', mode: 'pin' , slug: 'random-pin-generator' },
      { id: 'jwt', label: tk('tools_jwt'), desc: tk('tools_jwt_desc'), icon: 'Lock', mode: 'jwt' , slug: 'jwt-secret-generator' },
      { id: 'webhook', label: tk('tools_webhook'), desc: tk('tools_webhook_desc'), icon: 'Webhook', mode: 'webhook' , slug: 'webhook-secret-generator' },
      { id: 'api-key', label: tk('tools_api_key'), desc: tk('tools_api_key_desc'), icon: 'Key', mode: 'api-key' , slug: 'api-key-generator' },
      { id: 'token', label: tk('tools_token'), desc: tk('tools_token_desc'), icon: 'Shuffle', mode: 'token' , slug: 'random-token-generator' },
      /* Was a "Hash Generator" card pointing at `?mode=hash` — a mode the
         studio has never had, so the card opened the default tab. The session
         secret is a real tool with a real page, and was the only one of the
         eleven the landing never linked to. */
      { id: 'session', label: tk('tools_session'), desc: tk('tools_session_desc'), icon: 'Lock', mode: 'session', slug: 'session-secret-generator' },
      { id: 'analyzer', label: tk('tools_analyzer'), desc: tk('tools_analyzer_desc'), icon: 'ShieldCheck', mode: 'strength' , slug: 'password-strength-checker' },
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
