/**
 * Barcode Studio — Landing Page Config.
 *
 * Data-driven config for the barcode product landing page.
 * All text is in English; i18n is handled via getT() at render time.
 */

export interface BarcodeHeroData {
  title: string;
  subtitle: string;
  benefits: string[];
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface AudienceCard {
  id: string;
  title: string;
  desc: string;
  tools: string[];
}

export interface StandardItem {
  id: string;
  label: string;
  desc: string;
  category: string;
  icon: string;
}

export interface UseCase {
  id: string;
  label: string;
  desc: string;
  preset: string;
  icon: string;
}

export interface LearnArticle {
  id: string;
  label: string;
  desc: string;
  href: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface EcosystemLink {
  id: string;
  label: string;
  desc: string;
  href: string;
  icon: string;
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const BARCODE_HERO: BarcodeHeroData = {
  title: 'Generate Professional Barcodes',
  subtitle: 'Generate EAN-13, UPC, Code 128, ISBN, GTIN and dozens of other barcode formats directly in your browser. Check digits, validation, PNG/SVG export, and bulk generation — all free.',
  benefits: [
    'Browser Only',
    'Open Source',
    'Check Digit Calculator',
    'PNG / SVG Export',
    'Bulk Generation',
  ],
  ctaPrimary: 'Open Barcode Studio',
  ctaSecondary: 'View Supported Standards',
};

/* ── Audience ──────────────────────────────────────────────────────────── */

export const BARCODE_AUDIENCE: AudienceCard[] = [
  {
    id: 'developers',
    title: 'Developers',
    desc: 'Generate test barcodes, validate APIs, and create fixtures for development and testing environments.',
    tools: ['EAN-13', 'UPC-A', 'Code 128', 'Code 39', 'GTIN'],
  },
  {
    id: 'qa',
    title: 'QA Engineers',
    desc: 'Generate thousands of valid barcodes for bulk testing. Export to CSV or JSON for automated test suites.',
    tools: ['Bulk Generator', 'Validator', 'CSV Export', 'JSON Export'],
  },
  {
    id: 'retail',
    title: 'Retail',
    desc: 'Create product labels, internal SKU barcodes, and shelf labels for retail operations.',
    tools: ['EAN-13', 'UPC-A', 'GTIN', 'ITF-14', 'Shelf Labels'],
  },
  {
    id: 'warehouse',
    title: 'Warehouse',
    desc: 'Generate logistics labels, inventory codes, and shipping barcodes with Code 128 and ITF-14.',
    tools: ['Code 128', 'ITF-14', 'GS1-128', 'Codabar'],
  },
  {
    id: 'designers',
    title: 'Designers',
    desc: 'Export high-resolution SVG and PNG barcodes for product packaging, labels, and mockups.',
    tools: ['SVG Export', 'PNG Export', 'High Resolution', 'Custom Colors'],
  },
  {
    id: 'students',
    title: 'Students',
    desc: 'Learn how barcodes work, understand check digits, and experiment with different symbologies.',
    tools: ['Learn', 'Check Digit Calculator', 'Validator', 'Explainer'],
  },
];

/* ── Standards ─────────────────────────────────────────────────────────── */

export const BARCODE_STANDARDS: StandardItem[] = [
  { id: 'ean13', label: 'EAN-13', desc: '13-digit retail barcode used worldwide. The most common barcode for consumer products.', category: 'product', icon: 'Scan' },
  { id: 'ean8', label: 'EAN-8', desc: 'Compact 8-digit version of EAN for small products where space is limited.', category: 'product', icon: 'Scan' },
  { id: 'upca', label: 'UPC-A', desc: '12-digit barcode standard for North America. Used on virtually all retail products.', category: 'product', icon: 'Scan' },
  { id: 'upce', label: 'UPC-E', desc: '6-digit compressed version of UPC-A for small packages.', category: 'product', icon: 'Scan' },
  { id: 'gtin', label: 'GTIN', desc: 'Global Trade Item Number — used for product identification across the supply chain.', category: 'product', icon: 'Globe' },
  { id: 'isbn13', label: 'ISBN-13', desc: '13-digit book identifier used for books, ebooks, and publications worldwide.', category: 'product', icon: 'Book' },
  { id: 'issn', label: 'ISSN', desc: 'International Standard Serial Number for magazines, journals, and periodicals.', category: 'product', icon: 'Newspaper' },
  { id: 'ismn', label: 'ISMN', desc: 'International Standard Music Number for printed and digital sheet music.', category: 'product', icon: 'Music' },
  { id: 'code128', label: 'Code 128', desc: 'High-density alphanumeric barcode for logistics, shipping, and inventory management.', category: 'industrial', icon: 'Scan' },
  { id: 'gs1-128', label: 'GS1-128', desc: 'Extended Code 128 with GS1 application identifiers for supply chain data.', category: 'industrial', icon: 'Scan' },
  { id: 'itf14', label: 'ITF-14', desc: '14-digit barcode for outer shipping cartons and wholesale packaging.', category: 'industrial', icon: 'Box' },
  { id: 'code39', label: 'Code 39', desc: 'Widely used alphanumeric barcode for industrial, government, and military applications.', category: 'industrial', icon: 'Scan' },
  { id: 'code93', label: 'Code 93', desc: 'Higher-density alternative to Code 39 with better data security.', category: 'industrial', icon: 'Scan' },
  { id: 'codabar', label: 'Codabar', desc: 'Used in libraries, blood banks, and parcel tracking with start/stop characters.', category: 'industrial', icon: 'Scan' },
  { id: 'pharmacode', label: 'Pharmacode', desc: 'Pharmaceutical barcode for medicine packaging and safety labelling.', category: 'industrial', icon: 'Pill' },
];

/* ── Use Cases ─────────────────────────────────────────────────────────── */

export const BARCODE_USE_CASES: UseCase[] = [
  { id: 'product-labels', label: 'Product Labels', desc: 'Generate EAN-13 or UPC-A barcodes for retail product packaging', preset: 'ean13', icon: 'Scan' },
  { id: 'inventory', label: 'Inventory Codes', desc: 'Create Code 128 barcodes for warehouse inventory tracking', preset: 'code128', icon: 'Box' },
  { id: 'warehouse', label: 'Warehouse Labels', desc: 'Generate ITF-14 or GS1-128 barcodes for shipping cartons', preset: 'itf14', icon: 'Package' },
  { id: 'retail-pos', label: 'Retail POS Testing', desc: 'Test point-of-sale systems with valid EAN and UPC barcodes', preset: 'upca', icon: 'ShoppingCart' },
  { id: 'api-testing', label: 'API Testing', desc: 'Generate test barcodes for validating barcode scanning APIs', preset: 'code39', icon: 'Code' },
  { id: 'shelf-labels', label: 'Shelf Labels', desc: 'Create EAN-8 barcodes for small shelf labels and price tags', preset: 'ean8', icon: 'Tag' },
];

/* ── Learn Articles ────────────────────────────────────────────────────── */

export const BARCODE_LEARN_ARTICLES: LearnArticle[] = [
  { id: 'what-is-ean13', label: 'What is EAN-13?', desc: 'Learn about the most widely used retail barcode standard', href: '/ean13-generator' },
  { id: 'ean-vs-upc', label: 'EAN vs UPC', desc: 'Understand the differences between global and North American barcode standards', href: '/upc-generator' },
  { id: 'what-is-gtin', label: 'What is GTIN?', desc: 'How the Global Trade Item Number works across the supply chain', href: '/gtin-generator' },
  { id: 'check-digits', label: 'How Check Digits Work', desc: 'The mathematics behind barcode check digit calculation', href: '/check-digit-calculator' },
  { id: 'barcode-vs-qr', label: 'Barcode vs QR Code', desc: 'When to use linear barcodes vs 2D QR codes for your project', href: '#' },
  { id: 'gs1-system', label: 'What is GS1?', desc: 'Understanding the global standards organisation behind retail barcodes', href: '#' },
  { id: 'scanner-work', label: 'How Barcode Scanners Work', desc: 'The technology behind laser and camera-based barcode reading', href: '#' },
  { id: 'common-mistakes', label: 'Common Barcode Mistakes', desc: 'Avoid these frequent errors when generating and printing barcodes', href: '#' },
];

/* ── FAQs ──────────────────────────────────────────────────────────────── */

export const BARCODE_FAQS: FAQItem[] = [
  { q: 'What barcode should I use?', a: 'For most retail products, use EAN-13 (worldwide) or UPC-A (North America). For internal logistics, use Code 128. For shipping cartons, use ITF-14. For books, use ISBN. The right barcode depends on your industry and where the barcode will be scanned.' },
  { q: 'How is the check digit calculated?', a: 'Most retail barcodes (EAN-13, UPC-A, GTIN) use a weighted sum algorithm. Each digit is multiplied by 1 or 3 (alternating), the products are summed, and the check digit is the number needed to round the total up to the next multiple of 10.' },
  { q: 'What is GTIN?', a: 'GTIN (Global Trade Item Number) is an umbrella term for the family of GS1 data structures used to identify trade items. It includes GTIN-12 (UPC-A), GTIN-13 (EAN-13), GTIN-8 (EAN-8), and GTIN-14 (ITF-14).' },
  { q: 'Can I print generated barcodes?', a: 'Yes. All generated barcodes can be exported as SVG or PNG images and printed at any resolution. SVGs scale without quality loss, making them ideal for professional printing.' },
  { q: 'Are generated barcodes valid?', a: 'Yes, all barcodes generated by Barcode Studio have correct check digits and follow the encoding rules of their respective standards. They are structurally valid and will scan correctly.' },
  { q: 'Do you store generated data?', a: 'No. Everything runs in your browser. No barcode data is sent to any server, stored, or logged. Generated barcodes exist only on your device.' },
  { q: 'What is a barcode prefix?', a: 'Barcode prefixes are the first digits of a barcode that identify the country of origin (e.g., 590 for Poland, 690 for China) or the manufacturer. GS1 assigns these prefixes to member organisations.' },
  { q: 'What is the difference between Code 128 and GS1-128?', a: 'Code 128 is a general-purpose barcode encoding any alphanumeric data. GS1-128 is a specialised variant that includes GS1 Application Identifiers (AI) in parentheses, encoding additional data like expiration dates, batch numbers, and weights.' },
];

/* ── Ecosystem ─────────────────────────────────────────────────────────── */

export const BARCODE_ECOSYSTEM: EcosystemLink[] = [
  { id: 'phone', label: 'Phone Generator', desc: 'Generate valid phone numbers for testing', href: '/phone-generator', icon: 'Phone' },
  { id: 'user', label: 'User Generator', desc: 'Generate realistic user profiles', href: '/user-generator', icon: 'Users' },
  { id: 'credential', label: 'Credential Generator', desc: 'Generate passwords, API keys, and secrets', href: '/credential-generator', icon: 'Key' },
  { id: 'company', label: 'Company Generator', desc: 'Generate fictional company profiles', href: '/company-generator', icon: 'Building' },
];
