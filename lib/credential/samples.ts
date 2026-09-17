/**
 * The example credentials the landing page shows, generated on the server.
 *
 * Every string on that page comes out of the real generators in
 * `lib/credentialGenerator` — the same code the tool runs — rather than from a
 * hand-typed list. A landing page for a credential generator that displayed
 * invented examples would be undercutting its own claim in its first screen,
 * and a hand-written "sk_test_…" would drift from the real shape the first
 * time the generator changed.
 *
 * They are produced at build time, so a given deployment shows the same
 * examples to everyone; the page labels them as examples and the tool is one
 * click away. What matters is that they are *shaped* like the real output —
 * the right alphabet, the right length, the right prefix.
 *
 * `crypto.getRandomValues` is a global in every runtime this ships to, Node
 * included, so nothing here needs a browser.
 */

import {
  calculatePassphraseEntropy,
  generateApiKey,
  generateHex,
  generateJWTSecret,
  generatePassphrase,
  generatePin,
  generateRandomPassword,
  generateRandomToken,
  generateSessionSecret,
  generateUUID,
  generateUUIDv7,
  generateWebhookSecret,
  getCrackEstimates,
  type CrackEstimate,
} from '@/lib/credentialGenerator';

export interface HeroSample {
  value: string;
  /** Exactly 48: four words, twelve bits each, the list being a power of two. */
  bits: number;
  estimates: CrackEstimate[];
}

/**
 * Four words, not six, and deliberately.
 *
 * At six words every one of the three attack scenarios answers "centuries",
 * which demonstrates nothing. At four the same secret survives an online
 * attack and a bcrypt database for longer than anyone will wait, and falls to
 * a stolen MD5 table in about twenty minutes — which is the whole lesson this
 * tool exists to show, standing in the hero where it can be read at a glance.
 */
const HERO_WORD_COUNT = 4;

/** One tool card's example output. */
export interface ToolSample {
  slug: string;
  sample: string;
}

export function getHeroSample(): HeroSample {
  const value = generatePassphrase({
    wordCount: HERO_WORD_COUNT,
    separator: '-',
    capitalize: false,
    includeNumber: false,
  });
  const bits = calculatePassphraseEntropy(HERO_WORD_COUNT);
  return { value, bits: Math.round(bits * 10) / 10, estimates: getCrackEstimates(bits) };
}

/** Truncates a long secret to a shape that still reads as that kind of secret. */
function clip(value: string, keep: number): string {
  return value.length <= keep ? value : `${value.slice(0, keep)}…`;
}

export function getToolSamples(): ToolSample[] {
  return [
    {
      slug: 'password-generator',
      sample: generateRandomPassword({
        length: 20,
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
      }),
    },
    {
      slug: 'passphrase-generator',
      sample: generatePassphrase({
        wordCount: 4,
        separator: '-',
        capitalize: false,
        includeNumber: false,
      }),
    },
    { slug: 'random-pin-generator', sample: generatePin({ length: 6, noRepeat: true }) },
    { slug: 'password-strength-checker', sample: '72 bits · centuries · instantly' },
    { slug: 'uuid-generator', sample: generateUUID() },
    { slug: 'uuid-v7-generator', sample: generateUUIDv7() },
    { slug: 'jwt-secret-generator', sample: clip(generateJWTSecret(), 28) },
    { slug: 'api-key-generator', sample: clip(generateApiKey('sk_test'), 28) },
    { slug: 'webhook-secret-generator', sample: clip(generateWebhookSecret(), 28) },
    { slug: 'session-secret-generator', sample: clip(generateSessionSecret(), 28) },
    {
      slug: 'random-token-generator',
      sample: clip(generateRandomToken(48, 'hex') || generateHex(48), 28),
    },
  ];
}
