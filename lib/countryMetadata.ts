// ── Country Metadata ──────────────────────────────────────────────────────
// Re-exports from libphonenumber-js derived metadata.
// This file exists for backward compatibility; new code should import
// from './phoneMetadata' directly.

export {
  PHONE_METADATA as COUNTRY_METADATA,
  getPhoneMetadata,
  getExampleNumber,
  resetExampleCounters,
} from './phoneMetadata';

export type {
  PhoneMetadata,
} from './phoneMetadata';

export type GenerationMode = 'random' | 'valid' | 'example' | 'mobile' | 'fixedLine' | 'tollFree' | 'voip';
