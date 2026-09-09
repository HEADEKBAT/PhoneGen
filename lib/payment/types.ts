/**
 * Payment Studio — Core Types
 *
 * Card network definitions, card data structures, generation modes,
 * export formats, payment profiles, and gateway reference card types.
 * ALL client-side. No server data.
 */

/* ── Card Networks ───────────────────────────────────────────────────────────── */

export interface CardNetwork {
  id: string;
  name: string;
  /** Single prefix (e.g. "4") or array (e.g. ["34", "37"]) or range pattern */
  binPrefix: string | string[];
  /** Valid card number lengths */
  length: number[];
  /** Whether the network uses Luhn check digit */
  luhn: boolean;
  /** CVV length (default 3, Amex uses 4) */
  cvvLength?: number;
  /** Display color for card visualization */
  color?: string;
  /** Display badge color class */
  badgeClass?: string;
}

/* ── Card Data (single generated card) ───────────────────────────────────────── */

export interface CardData {
  /** Raw PAN (no spaces) */
  pan: string;
  /** Formatted PAN (grouped, e.g. "4242 4242 4242 4242") */
  formattedPan: string;
  /** Masked PAN (e.g. "4242 **** **** 4242") */
  maskedPan: string;
  /** Detected network */
  network: string;
  /** Cardholder name */
  holder: string;
  /** Expiry month (2-digit, "01"-"12") */
  expiryMonth: string;
  /** Expiry year (4-digit, e.g. "2028") */
  expiryYear: string;
  /** Expiry as MM/YY */
  expiryShort: string;
  /** Expiry as MM/YYYY */
  expiryFull: string;
  /** CVV/CVC code */
  cvv: string;
  /** BIN/IIN (first 6-8 digits) */
  bin: string;
  /** Last 4 digits */
  last4: string;
  /** Whether the card passes Luhn */
  luhnValid: boolean;
}

/* ── Full Payment Profile ───────────────────────────────────────────────────── */

export interface AddressInfo {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  countryCode: string;
}

export interface PaymentProfile {
  card: CardData;
  email: string;
  phone: string;
  address: AddressInfo;
  /** ISO 4217 currency code */
  currency: string;
  /** Profile label (e.g. "US Personal", "EU Business") */
  label: string;
}

/* ── Generation Modes ────────────────────────────────────────────────────────── */

export type CardMode =
  | 'quick'
  | 'advanced'
  | 'bin'
  | 'bulk'
  | 'developer'
  | 'negative-testing';

/* ── Export Formats ──────────────────────────────────────────────────────────── */

export type PaymentExportFormat = 'txt' | 'csv' | 'json' | 'sql' | 'xml' | 'yml' | 'clipboard';

/* ── Network Selection ───────────────────────────────────────────────────────── */

export interface NetworkConfig {
  /** Network ID */
  networkId: string;
  /** Whether to include this network in generation */
  enabled: boolean;
  /** Quantity for bulk generation per network (0 = auto-distribute) */
  quantity?: number;
}

/* ── Generation Options ──────────────────────────────────────────────────────── */

export interface GenerationOptions {
  mode: CardMode;
  /** Selected networks (empty = all) */
  networks: string[];
  /** Country for locale-aware profile generation */
  countryCode?: string;
  /** Profile preset (personal, business, premium, etc.) */
  profile?: string;
  /** Quantity for bulk mode */
  quantity?: number;
  /** Custom BIN prefix (for BIN mode) */
  customBin?: string;
  /** Minimum expiry years from now */
  expiryYearsMin?: number;
  /** Maximum expiry years from now */
  expiryYearsMax?: number;
  /** Include address in output */
  includeAddress?: boolean;
  /** Include phone in output */
  includePhone?: boolean;
  /** Include email in output */
  includeEmail?: boolean;
}

/* ── Negative Testing ────────────────────────────────────────────────────────── */

export type NegativeTestType =
  | 'invalid-luhn'
  | 'wrong-length'
  | 'expired-card'
  | 'invalid-expiry'
  | 'invalid-cvv'
  | 'invalid-bank-code'
  | 'special-chars-pan'
  | 'blank-fields';

export interface NegativeTestConfig {
  testType: NegativeTestType;
  /** Base network to use (for reference) */
  networkId?: string;
}

/* ── Gateway Reference Cards ─────────────────────────────────────────────────── */

export interface GatewayCard {
  brand: string;
  number: string;
  cvc: string;
  exp: string;
  /** Gateway name (e.g. "stripe", "paypal") */
  gateway: string;
  /** Description of the card's behavior (e.g. "Success", "Requires auth") */
  description: string;
}

/* ── Card Themes (visualization) ──────────────────────────────────────────────── */

export type CardTheme = 'light' | 'dark' | 'glass' | 'corporate' | 'minimal' | 'cyber';

/* ── Validation Result ────────────────────────────────────────────────────────── */

export interface ValidationResult {
  pan: string;
  network: string | null;
  lengthValid: boolean;
  luhnValid: boolean;
  /** Human-readable message */
  message: string;
}

/* ── Bulk Generation Progress ────────────────────────────────────────────────── */

export interface BulkProgress {
  total: number;
  completed: number;
  failed: number;
  /** Current status message */
  status: string;
}
