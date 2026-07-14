/**
 * Feature flags for GenCore platform.
 *
 * Controls visibility and availability of platform-wide features.
 * Each flag is either:
 *   - boolean        → fully on/off
 *   - { enabled: boolean }
 *
 * Usage: wrap UI elements and route guards with these flags.
 * Never hardcode feature checks outside this file.
 */
export const FEATURES = {
  /** Phone Generator — the current product, always on. */
  phoneGenerator: true,

  /** Future generators (all off until implemented). */
  userGenerator: true,
  addressGenerator: true,
  emailGenerator: true,
  usernameGenerator: true,
  companyGenerator: true,
  passwordGenerator: true,
  colorGenerator: true,

  /** Platform features. */
  countryPages: false,   // Country-specific SEO pages (Phase 4)
  genCoreHomepage: true, // GenCore landing page at /[locale]
  analyticsHub: false,   // Centralized analytics (Phase 5 placeholder)
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag] === true;
}
