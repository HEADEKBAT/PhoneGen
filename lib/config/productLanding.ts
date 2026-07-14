/**
 * Product Landing Page Configuration.
 *
 * Each product defines its landing page content: hero copy, tool types,
 * features, example, FAQ, and CTA. This registry keeps all per-product
 * content in one place so the landing components stay generic.
 *
 * Instead of a switch/case, this module uses a simple record lookup.
 * Adding a new product landing means adding one entry to `LANDING_CONFIGS`.
 */

export interface ToolType {
  id: string;
  slug: string;
  labelKey: string;
  descKey: string;
  enabled: boolean;
}

export interface Feature {
  iconName: string;
  titleKey: string;
  descKey: string;
}

export interface FAQ {
  qKey: string;
  aKey: string;
}

export interface ProductLandingConfig {
  productId: string;
  /** Whether this product supports country-specific generation */
  hasCountries: boolean;
  /** Tool type variations */
  toolTypes: ToolType[];
  /** Feature cards */
  features: Feature[];
  /** FAQ entries */
  faqs: FAQ[];
  /** Translation keys */
  heroTitleKey: string;
  heroDescKey: string;
  ctaLabelKey: string;
  exampleLabelKey: string;
  popularCountriesDescKey?: string;
  /** Top country ISO codes for the PopularCountries section */
  popularCountryCodes?: string[];
}

/* ── Tool Types ────────────────────────────────────────────────────────────── */

export const PHONE_TOOL_TYPES: ToolType[] = [
  { id: 'mobile', slug: 'mobile', labelKey: 'productLanding.phone.mobile.label', descKey: 'productLanding.phone.mobile.desc', enabled: true },
  { id: 'fixedLine', slug: 'fixed-line', labelKey: 'productLanding.phone.fixedLine.label', descKey: 'productLanding.phone.fixedLine.desc', enabled: true },
  { id: 'tollFree', slug: 'toll-free', labelKey: 'productLanding.phone.tollFree.label', descKey: 'productLanding.phone.tollFree.desc', enabled: true },
  { id: 'voip', slug: 'voip', labelKey: 'productLanding.phone.voip.label', descKey: 'productLanding.phone.voip.desc', enabled: true },
];

/* ── Features ───────────────────────────────────────────────────────────────── */

const PHONE_FEATURES: Feature[] = [
  { iconName: 'ShieldCheck', titleKey: 'productLanding.phone.validNumbers', descKey: 'productLanding.phone.validNumbersDesc' },
  { iconName: 'Grid3x3', titleKey: 'productLanding.phone.multipleFormats', descKey: 'productLanding.phone.multipleFormatsDesc' },
  { iconName: 'Globe', titleKey: 'productLanding.phone.allCountries', descKey: 'productLanding.phone.allCountriesDesc' },
  { iconName: 'Zap', titleKey: 'productLanding.phone.freeUnlimited', descKey: 'productLanding.phone.freeUnlimitedDesc' },
];

const USER_FEATURES: Feature[] = [
  { iconName: 'Users', titleKey: 'productLanding.user.feature1Title', descKey: 'productLanding.user.feature1Desc' },
  { iconName: 'Globe', titleKey: 'productLanding.user.feature2Title', descKey: 'productLanding.user.feature2Desc' },
  { iconName: 'Download', titleKey: 'productLanding.user.feature3Title', descKey: 'productLanding.user.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.user.feature4Title', descKey: 'productLanding.user.feature4Desc' },
];

const ADDRESS_FEATURES: Feature[] = [
  { iconName: 'MapPin', titleKey: 'productLanding.address.feature1Title', descKey: 'productLanding.address.feature1Desc' },
  { iconName: 'Globe', titleKey: 'productLanding.address.feature2Title', descKey: 'productLanding.address.feature2Desc' },
  { iconName: 'Building', titleKey: 'productLanding.address.feature3Title', descKey: 'productLanding.address.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.address.feature4Title', descKey: 'productLanding.address.feature4Desc' },
];

const EMAIL_FEATURES: Feature[] = [
  { iconName: 'Mail', titleKey: 'productLanding.email.feature1Title', descKey: 'productLanding.email.feature1Desc' },
  { iconName: 'ShieldCheck', titleKey: 'productLanding.email.feature2Title', descKey: 'productLanding.email.feature2Desc' },
  { iconName: 'Users', titleKey: 'productLanding.email.feature3Title', descKey: 'productLanding.email.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.email.feature4Title', descKey: 'productLanding.email.feature4Desc' },
];

const USERNAME_FEATURES: Feature[] = [
  { iconName: 'User', titleKey: 'productLanding.username.feature1Title', descKey: 'productLanding.username.feature1Desc' },
  { iconName: 'Grid3x3', titleKey: 'productLanding.username.feature2Title', descKey: 'productLanding.username.feature2Desc' },
  { iconName: 'Sparkles', titleKey: 'productLanding.username.feature3Title', descKey: 'productLanding.username.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.username.feature4Title', descKey: 'productLanding.username.feature4Desc' },
];

const COMPANY_FEATURES: Feature[] = [
  { iconName: 'Building', titleKey: 'productLanding.company.feature1Title', descKey: 'productLanding.company.feature1Desc' },
  { iconName: 'Globe', titleKey: 'productLanding.company.feature2Title', descKey: 'productLanding.company.feature2Desc' },
  { iconName: 'Briefcase', titleKey: 'productLanding.company.feature3Title', descKey: 'productLanding.company.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.company.feature4Title', descKey: 'productLanding.company.feature4Desc' },
];

const CREDENTIAL_FEATURES: Feature[] = [
  { iconName: 'Key', titleKey: 'productLanding.credential.feature1Title', descKey: 'productLanding.credential.feature1Desc' },
  { iconName: 'ShieldCheck', titleKey: 'productLanding.credential.feature2Title', descKey: 'productLanding.credential.feature2Desc' },
  { iconName: 'Grid3x3', titleKey: 'productLanding.credential.feature3Title', descKey: 'productLanding.credential.feature3Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.credential.feature4Title', descKey: 'productLanding.credential.feature4Desc' },
];

/* ── FAQs ───────────────────────────────────────────────────────────────────── */

const PHONE_FAQS: FAQ[] = [
  { qKey: 'productLanding.phone.faq_q1', aKey: 'productLanding.phone.faq_a1' },
  { qKey: 'productLanding.phone.faq_q2', aKey: 'productLanding.phone.faq_a2' },
  { qKey: 'productLanding.phone.faq_q3', aKey: 'productLanding.phone.faq_a3' },
];

const USER_FAQS: FAQ[] = [
  { qKey: 'productLanding.user.faq_q1', aKey: 'productLanding.user.faq_a1' },
  { qKey: 'productLanding.user.faq_q2', aKey: 'productLanding.user.faq_a2' },
  { qKey: 'productLanding.user.faq_q3', aKey: 'productLanding.user.faq_a3' },
];

const ADDRESS_FAQS: FAQ[] = [
  { qKey: 'productLanding.address.faq_q1', aKey: 'productLanding.address.faq_a1' },
  { qKey: 'productLanding.address.faq_q2', aKey: 'productLanding.address.faq_a2' },
  { qKey: 'productLanding.address.faq_q3', aKey: 'productLanding.address.faq_a3' },
];

const EMAIL_FAQS: FAQ[] = [
  { qKey: 'productLanding.email.faq_q1', aKey: 'productLanding.email.faq_a1' },
  { qKey: 'productLanding.email.faq_q2', aKey: 'productLanding.email.faq_a2' },
  { qKey: 'productLanding.email.faq_q3', aKey: 'productLanding.email.faq_a3' },
];

const USERNAME_FAQS: FAQ[] = [
  { qKey: 'productLanding.username.faq_q1', aKey: 'productLanding.username.faq_a1' },
  { qKey: 'productLanding.username.faq_q2', aKey: 'productLanding.username.faq_a2' },
  { qKey: 'productLanding.username.faq_q3', aKey: 'productLanding.username.faq_a3' },
];

const COMPANY_FAQS: FAQ[] = [
  { qKey: 'productLanding.company.faq_q1', aKey: 'productLanding.company.faq_a1' },
  { qKey: 'productLanding.company.faq_q2', aKey: 'productLanding.company.faq_a2' },
  { qKey: 'productLanding.company.faq_q3', aKey: 'productLanding.company.faq_a3' },
];

const CREDENTIAL_FAQS: FAQ[] = [
  { qKey: 'productLanding.credential.faq_q1', aKey: 'productLanding.credential.faq_a1' },
  { qKey: 'productLanding.credential.faq_q2', aKey: 'productLanding.credential.faq_a2' },
  { qKey: 'productLanding.credential.faq_q3', aKey: 'productLanding.credential.faq_a3' },
];

/* ── Barcode Features ───────────────────────────────────────────────────── */

const BARCODE_FEATURES: Feature[] = [
  { iconName: 'Scan', titleKey: 'productLanding.barcode.feature1Title', descKey: 'productLanding.barcode.feature1Desc' },
  { iconName: 'ShieldCheck', titleKey: 'productLanding.barcode.feature2Title', descKey: 'productLanding.barcode.feature2Desc' },
  { iconName: 'Grid3x3', titleKey: 'productLanding.barcode.feature3Title', descKey: 'productLanding.barcode.feature3Desc' },
  { iconName: 'Download', titleKey: 'productLanding.barcode.feature4Title', descKey: 'productLanding.barcode.feature4Desc' },
  { iconName: 'Zap', titleKey: 'productLanding.barcode.feature5Title', descKey: 'productLanding.barcode.feature5Desc' },
];

/* ── Barcode FAQs ───────────────────────────────────────────────────────── */

const BARCODE_FAQS: FAQ[] = [
  { qKey: 'productLanding.barcode.faq_q1', aKey: 'productLanding.barcode.faq_a1' },
  { qKey: 'productLanding.barcode.faq_q2', aKey: 'productLanding.barcode.faq_a2' },
  { qKey: 'productLanding.barcode.faq_q3', aKey: 'productLanding.barcode.faq_a3' },
];

/* ── Color Studio Features ─────────────────────────────────────────────────── */

const COLOR_FEATURES: Feature[] = [
  { iconName: 'Palette', titleKey: 'productLanding.color.feature1Title', descKey: 'productLanding.color.feature1Desc' },
  { iconName: 'Layers', titleKey: 'productLanding.color.feature2Title', descKey: 'productLanding.color.feature2Desc' },
  { iconName: 'Droplets', titleKey: 'productLanding.color.feature3Title', descKey: 'productLanding.color.feature3Desc' },
  { iconName: 'Eye', titleKey: 'productLanding.color.feature4Title', descKey: 'productLanding.color.feature4Desc' },
  { iconName: 'Download', titleKey: 'productLanding.color.feature5Title', descKey: 'productLanding.color.feature5Desc' },
];

/* ── Color Studio FAQs ───────────────────────────────────────────────────────── */

const COLOR_FAQS: FAQ[] = [
  { qKey: 'productLanding.color.faq_q1', aKey: 'productLanding.color.faq_a1' },
  { qKey: 'productLanding.color.faq_q2', aKey: 'productLanding.color.faq_a2' },
  { qKey: 'productLanding.color.faq_q3', aKey: 'productLanding.color.faq_a3' },
  { qKey: 'productLanding.color.faq_q4', aKey: 'productLanding.color.faq_a4' },
];

/* ── Popular countries ──────────────────────────────────────────────────────── */

const POPULAR_PHONE_COUNTRIES = ['US', 'GB', 'DE', 'FR', 'RU', 'CN', 'IN', 'BR', 'JP', 'KR', 'IT', 'ES'];
const POPULAR_USER_COUNTRIES = ['US', 'GB', 'DE', 'FR', 'RU', 'CN', 'IN', 'BR'];
const POPULAR_ADDRESS_COUNTRIES = ['US', 'GB', 'DE', 'FR', 'RU', 'CN', 'IN', 'BR'];

/* ── Landing Config Registry ────────────────────────────────────────────────── */

/**
 * Registry of all landing page configurations.
 * Keyed by product ID. Data-driven — no switch/case needed.
 */
export const LANDING_CONFIGS: Record<string, ProductLandingConfig> = {
  phone: {
    productId: 'phone',
    hasCountries: true,
    toolTypes: PHONE_TOOL_TYPES,
    features: PHONE_FEATURES,
    faqs: PHONE_FAQS,
    heroTitleKey: 'productLanding.phone.heroTitle',
    heroDescKey: 'productLanding.phone.heroDesc',
    ctaLabelKey: 'productLanding.phone.ctaLabel',
    exampleLabelKey: 'productLanding.phone.exampleLabel',
    popularCountriesDescKey: 'productLanding.phone.popularCountriesDesc',
    popularCountryCodes: POPULAR_PHONE_COUNTRIES,
  },
  user: {
    productId: 'user',
    hasCountries: true,
    toolTypes: [],
    features: USER_FEATURES,
    faqs: USER_FAQS,
    heroTitleKey: 'productLanding.user.heroTitle',
    heroDescKey: 'productLanding.user.heroDesc',
    ctaLabelKey: 'productLanding.user.ctaLabel',
    exampleLabelKey: 'productLanding.user.exampleLabel',
    popularCountriesDescKey: 'productLanding.user.popularCountriesDesc',
    popularCountryCodes: POPULAR_USER_COUNTRIES,
  },
  address: {
    productId: 'address',
    hasCountries: true,
    toolTypes: [],
    features: ADDRESS_FEATURES,
    faqs: ADDRESS_FAQS,
    heroTitleKey: 'productLanding.address.heroTitle',
    heroDescKey: 'productLanding.address.heroDesc',
    ctaLabelKey: 'productLanding.address.ctaLabel',
    exampleLabelKey: 'productLanding.address.exampleLabel',
    popularCountriesDescKey: 'productLanding.address.popularCountriesDesc',
    popularCountryCodes: POPULAR_ADDRESS_COUNTRIES,
  },
  email: {
    productId: 'email',
    hasCountries: false,
    toolTypes: [],
    features: EMAIL_FEATURES,
    faqs: EMAIL_FAQS,
    heroTitleKey: 'productLanding.email.heroTitle',
    heroDescKey: 'productLanding.email.heroDesc',
    ctaLabelKey: 'productLanding.email.ctaLabel',
    exampleLabelKey: 'productLanding.email.exampleLabel',
  },
  username: {
    productId: 'username',
    hasCountries: false,
    toolTypes: [],
    features: USERNAME_FEATURES,
    faqs: USERNAME_FAQS,
    heroTitleKey: 'productLanding.username.heroTitle',
    heroDescKey: 'productLanding.username.heroDesc',
    ctaLabelKey: 'productLanding.username.ctaLabel',
    exampleLabelKey: 'productLanding.username.exampleLabel',
  },
  company: {
    productId: 'company',
    hasCountries: false,
    toolTypes: [],
    features: COMPANY_FEATURES,
    faqs: COMPANY_FAQS,
    heroTitleKey: 'productLanding.company.heroTitle',
    heroDescKey: 'productLanding.company.heroDesc',
    ctaLabelKey: 'productLanding.company.ctaLabel',
    exampleLabelKey: 'productLanding.company.exampleLabel',
  },
  password: {
    productId: 'password',
    hasCountries: false,
    toolTypes: [],
    features: CREDENTIAL_FEATURES,
    faqs: CREDENTIAL_FAQS,
    heroTitleKey: 'productLanding.credential.heroTitle',
    heroDescKey: 'productLanding.credential.heroDesc',
    ctaLabelKey: 'productLanding.credential.ctaLabel',
    exampleLabelKey: 'productLanding.credential.exampleLabel',
  },
  barcode: {
    productId: 'barcode',
    hasCountries: false,
    toolTypes: [],
    features: BARCODE_FEATURES,
    faqs: BARCODE_FAQS,
    heroTitleKey: 'productLanding.barcode.heroTitle',
    heroDescKey: 'productLanding.barcode.heroDesc',
    ctaLabelKey: 'productLanding.barcode.ctaLabel',
    exampleLabelKey: 'productLanding.barcode.exampleLabel',
  },
  color: {
    productId: 'color',
    hasCountries: false,
    toolTypes: [],
    features: COLOR_FEATURES,
    faqs: COLOR_FAQS,
    heroTitleKey: 'productLanding.color.heroTitle',
    heroDescKey: 'productLanding.color.heroDesc',
    ctaLabelKey: 'productLanding.color.ctaLabel',
    exampleLabelKey: 'productLanding.color.exampleLabel',
  },
};

/**
 * Get landing config for a product by its ID.
 * Uses the record lookup — no switch/case.
 */
export function getProductLandingConfig(productId: string): ProductLandingConfig {
  const config = LANDING_CONFIGS[productId];
  if (!config) {
    throw new Error(`Unknown product landing config: ${productId}`);
  }
  return config;
}

/** All product IDs that have landing page configs. */
export const LANDING_PRODUCT_IDS = Object.keys(LANDING_CONFIGS);
