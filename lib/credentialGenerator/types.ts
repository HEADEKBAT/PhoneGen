/* ── Result ─────────────────────────────────────────────────────────────── */

export interface CredentialResult {
  id: string;
  value: string;
  label: string;
  type: 'password' | 'pin' | 'secret' | 'pair';
  entropy?: number;
  score?: number;
  meta?: Record<string, string>;
}

/* ── Modes ──────────────────────────────────────────────────────────────── */

/* 'human' is gone: pronoun + verb + noun over banks of 16, 41 and 94 words is
   15.9 bits of structure — 0.05 seconds against a fast hash — and no size of
   word bank fixes a three-slot template. The passphrase mode answers the same
   "give me something memorable" ask honestly, at 12 bits a word. */
export type PasswordMode = 'random' | 'passphrase' | 'pronounceable';
/* 'pin' sits in this union rather than beside it: the PIN & Secrets tab used
   to emit one PIN *and* one secret on every click, each prefixed with a label
   — "PIN (6-digit): 481920" — so copying a result copied the caption with it
   and the strength figure had two subjects. One kind at a time, values only. */
export type SecretMode =
  | 'pin'
  | 'uuid'
  | 'uuid-v7'
  | 'jwt'
  | 'api-key'
  | 'webhook'
  | 'hex'
  | 'base64'
  | 'token'
  | 'session'
  | 'oauth';
export type ActiveTab = 'passwords' | 'pins-secrets' | 'dev-pairs' | 'history';

/* ── Generator Options ──────────────────────────────────────────────────── */

export interface RandomPasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeChars?: string;
  avoidAmbiguous?: boolean;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: '-' | '_' | '.' | ' ';
  capitalize: boolean;
  includeNumber: boolean;
}

export interface PronounceableOptions {
  syllableCount: number;
  capitalize?: boolean;
  includeNumber?: boolean;
  includeSymbol?: boolean;
}

export interface PinOptions {
  length: 4 | 6 | 8;
  noRepeat: boolean;
}

export interface SecretOptions {
  mode: SecretMode;
  hexLength: number;
  base64Length: number;
}

export interface PairOptions {
  quantity: number;
  country: string;
}
