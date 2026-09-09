/**
 * Payment Studio — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each Payment Studio
 * SEO landing page. Each page is a thin server component that reads
 * its config from here.
 *
 * Follows the same pattern as credentialSEOPages.ts and barcodeSEOPages.ts.
 */

export interface SEOFaq {
  q: string;
  a: string;
}

export interface PaymentSEOPageConfig {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: SEOFaq[];
}

/* ── Shared FAQ pools ────────────────────────────────────────────────────────── */

const CREDIT_CARD_FAQS: SEOFaq[] = [
  { q: 'Are these real credit card numbers?', a: 'No. All generated numbers are test numbers that pass Luhn validation but are not linked to any real accounts. They are algorithmically generated based on public BIN/IIN ranges and are safe for development and testing purposes.' },
  { q: 'Is this safe to use?', a: 'Yes. All generation happens entirely in your browser using the Web Crypto API. No data is ever sent to any server, no history is stored, and no credentials leave your device.' },
  { q: 'What is Luhn validation?', a: 'The Luhn algorithm (ISO/IEC 7812) is a checksum formula used by all major credit card networks to validate card numbers. It detects single-digit errors and most adjacent digit transpositions.' },
  { q: 'Can I use these numbers in production?', a: 'No. These numbers are intended for development, testing, and QA purposes only. For production, use real card numbers issued by financial institutions.' },
];

const NETWORK_FAQS: SEOFaq[] = [
  { q: 'What is a BIN range?', a: 'A Bank Identification Number (BIN), also called Issuer Identification Number (IIN), is the first 6-8 digits of a credit card that identify the issuing institution. Each card network has specific BIN ranges.' },
  { q: 'What test card numbers does this network use?', a: 'Each payment network provides official test card numbers through documentation. Our generator uses publicly available BIN ranges to produce structurally valid test numbers.' },
  { q: 'How many test card numbers can I generate?', a: 'You can generate as many test card numbers as you need, up to 1000 at once in bulk mode. All generation is client-side and free.' },
];

const BULK_FAQS: SEOFaq[] = [
  { q: 'What is bulk credit card generation?', a: 'Bulk generation lets you create multiple test card numbers at once, up to 1000 per batch. Perfect for load testing, database seeding, and QA test suites.' },
  { q: 'What formats can I export bulk cards in?', a: 'You can export in TXT, CSV, JSON, SQL (INSERT statements), XML, or YAML formats. Choose the format that matches your testing workflow.' },
  { q: 'Is bulk generation fast?', a: 'Yes. Bulk generation happens entirely in your browser using efficient algorithmic generation. A batch of 1000 cards is typically generated in under a second.' },
];

const VALIDATOR_FAQS: SEOFaq[] = [
  { q: 'How does card validation work?', a: 'The validator checks the card number against multiple criteria: card network identification (BIN range), length validation, and Luhn checksum verification.' },
  { q: 'What does a validation result include?', a: 'Each result shows the detected card network, whether the length is valid for that network, whether the number passes Luhn, and a human-readable status message.' },
  { q: 'Can I validate real card numbers?', a: 'This tool is for testing purposes. It only performs structural validation (network, length, Luhn) — it does not check whether a card is active or has available funds.' },
];

const BIN_LOOKUP_FAQS: SEOFaq[] = [
  { q: 'What is a BIN lookup?', a: 'A BIN (Bank Identification Number) lookup identifies the card network, issuing bank, card type, and country from the first 6-8 digits of a card number.' },
  { q: 'Is BIN data accurate?', a: 'BIN ranges are based on publicly available IIN registry data and are accurate for testing purposes. For production BIN lookups, use a dedicated BIN database service.' },
  { q: 'What information does a BIN lookup provide?', a: 'A BIN lookup typically reveals: the card network (Visa, Mastercard, etc.), card type (credit, debit, prepaid), issuing country, and sometimes the issuing bank name.' },
];

const CVV_FAQS: SEOFaq[] = [
  { q: 'What is a CVV?', a: 'CVV (Card Verification Value) is a 3-4 digit security code printed on credit cards. Visa, Mastercard, and Discover use 3-digit codes; American Express uses 4-digit codes.' },
  { q: 'Are generated CVVs valid?', a: 'Generated CVVs are random 3-4 digit numbers that match the correct format. They are not tied to any real card and are for testing purposes only.' },
  { q: 'What is the difference between CVV, CVC, and CID?', a: 'These are different names for the same security feature: CVV (Visa), CVC (Mastercard), CID (American Express/Discover). All serve the same purpose of verifying card-not-present transactions.' },
];

/* ── SEO Pages Registry ──────────────────────────────────────────────────────── */

export const PAYMENT_SEO_PAGES: Record<string, PaymentSEOPageConfig> = {
  'credit-card-generator': {
    id: 'credit-card-generator',
    slug: 'credit-card-generator',
    title: 'Credit Card Generator — Generate Test Card Numbers for 15+ Networks',
    description: 'Generate valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and 10+ payment networks. Free online credit card generator with Luhn validation and multiple export formats.',
    heroTitle: 'Credit Card Generator',
    heroSubtitle: 'Generate valid test credit card numbers for 15+ payment networks. All numbers are algorithmically generated, pass Luhn validation, and are safe for development and testing.',
    faqs: CREDIT_CARD_FAQS,
  },
  'visa-card-generator': {
    id: 'visa-card-generator',
    slug: 'visa-card-generator',
    title: 'Visa Card Generator — Create Test Visa Card Numbers',
    description: 'Generate valid test Visa credit card numbers starting with 4. Free online Visa card generator for payment testing with Luhn validation.',
    heroTitle: 'Visa Card Generator',
    heroSubtitle: 'Generate valid test Visa credit card numbers. All numbers use the 4xxx BIN range and pass Luhn validation.',
    faqs: NETWORK_FAQS,
  },
  'mastercard-generator': {
    id: 'mastercard-generator',
    slug: 'mastercard-generator',
    title: 'Mastercard Generator — Create Test Mastercard Numbers',
    description: 'Generate valid test Mastercard numbers in the 51-55 and 2221-2720 BIN ranges. Free online Mastercard generator.',
    heroTitle: 'Mastercard Generator',
    heroSubtitle: 'Generate valid test Mastercard credit card numbers. Supports both the 51-55 range and the newer 2-series BIN range.',
    faqs: NETWORK_FAQS,
  },
  'amex-card-generator': {
    id: 'amex-card-generator',
    slug: 'amex-card-generator',
    title: 'American Express Generator — Create Test Amex Card Numbers',
    description: 'Generate valid test American Express card numbers starting with 34 or 37. Free Amex card generator with 4-digit CVV.',
    heroTitle: 'American Express Generator',
    heroSubtitle: 'Generate valid test American Express card numbers. Amex uses 15-digit numbers with 34 or 37 prefixes and a 4-digit CVV.',
    faqs: NETWORK_FAQS,
  },
  'discover-card-generator': {
    id: 'discover-card-generator',
    slug: 'discover-card-generator',
    title: 'Discover Card Generator — Create Test Discover Card Numbers',
    description: 'Generate valid test Discover card numbers in the 6011, 622126-622925, 644-649, and 65 BIN ranges. Free online Discover card generator.',
    heroTitle: 'Discover Card Generator',
    heroSubtitle: 'Generate valid test Discover credit card numbers across all Discover BIN ranges.',
    faqs: NETWORK_FAQS,
  },
  'jcb-card-generator': {
    id: 'jcb-card-generator',
    slug: 'jcb-card-generator',
    title: 'JCB Card Generator — Create Test JCB Card Numbers',
    description: 'Generate valid test JCB credit card numbers in the 3528-3589 BIN range. Free online JCB card generator.',
    heroTitle: 'JCB Card Generator',
    heroSubtitle: 'Generate valid test JCB credit card numbers for testing Japanese payment systems.',
    faqs: NETWORK_FAQS,
  },
  'test-credit-card-numbers': {
    id: 'test-credit-card-numbers',
    slug: 'test-credit-card-numbers',
    title: 'Test Credit Card Numbers — Complete Reference for Payment Testing',
    description: 'Comprehensive reference of test credit card numbers for all major payment networks. Includes Stripe, PayPal, Adyen, and Braintree test cards.',
    heroTitle: 'Test Credit Card Numbers',
    heroSubtitle: 'A complete reference of test credit card numbers for all payment networks and gateways. Includes official Stripe, PayPal, Adyen, and Braintree test cards.',
    faqs: CREDIT_CARD_FAQS,
  },
  'credit-card-validator': {
    id: 'credit-card-validator',
    slug: 'credit-card-validator',
    title: 'Credit Card Validator — Validate Card Numbers Online',
    description: 'Validate credit card numbers in real-time. Detects card network, validates length and Luhn checksum. Free online credit card validator.',
    heroTitle: 'Credit Card Validator',
    heroSubtitle: 'Validate credit card numbers instantly. Detect the card network, check length validity, and verify Luhn checksum.',
    faqs: VALIDATOR_FAQS,
  },
  'bin-lookup': {
    id: 'bin-lookup',
    slug: 'bin-lookup',
    title: 'BIN Lookup — Identify Bank Identification Numbers',
    description: 'Look up BIN/IIN numbers to identify card networks. Free online BIN lookup tool for payment testing.',
    heroTitle: 'BIN Lookup',
    heroSubtitle: 'Identify card networks and BIN ranges from the first 6-8 digits of any credit card number.',
    faqs: BIN_LOOKUP_FAQS,
  },
  'cvv-generator': {
    id: 'cvv-generator',
    slug: 'cvv-generator',
    title: 'CVV Generator — Create Test CVV/CVC Codes',
    description: 'Generate random test CVV codes for Visa, Mastercard, Amex, and Discover. Free online CVV generator for payment testing.',
    heroTitle: 'CVV Generator',
    heroSubtitle: 'Generate random test CVV codes for all major card networks. 3-digit codes for most networks, 4-digit codes for American Express.',
    faqs: CVV_FAQS,
  },
  'bulk-credit-card-generator': {
    id: 'bulk-credit-card-generator',
    slug: 'bulk-credit-card-generator',
    title: 'Bulk Credit Card Generator — Create 1000s of Test Cards',
    description: 'Generate bulk test credit card numbers in TXT, CSV, JSON, SQL, XML, or YAML. Free bulk card generator with progress tracking.',
    heroTitle: 'Bulk Credit Card Generator',
    heroSubtitle: 'Generate up to 1000 test credit card numbers at once. Export in TXT, CSV, JSON, SQL, XML, or YAML format.',
    faqs: BULK_FAQS,
  },
};

export const ALL_PAYMENT_SEO_PAGES = Object.values(PAYMENT_SEO_PAGES);
