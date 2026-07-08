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

export type PasswordMode = 'random' | 'human' | 'passphrase' | 'pronounceable';
export type SecretMode = 'uuid' | 'uuid-v7' | 'jwt' | 'api-key' | 'webhook' | 'hex' | 'base64' | 'token' | 'session' | 'oauth';
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

export interface HumanPasswordOptions {
  capitalize?: boolean;
  includeNumber?: boolean;
  includeSymbol?: boolean;
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
