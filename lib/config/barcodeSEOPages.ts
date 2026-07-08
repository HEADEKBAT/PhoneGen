/**
 * Barcode Generator — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each barcode SEO landing page.
 * Each page is a thin server component that reads its config from here.
 */

export interface SEOFaq {
  q: string;
  a: string;
}

export interface BarcodeSEOPageConfig {
  id: string;
  slug: string;
  barcodeType: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: SEOFaq[];
}

/* ── Shared FAQ pools ──────────────────────────────────────────────────── */

const PRODUCT_FAQS: SEOFaq[] = [
  { q: 'What is this barcode used for?', a: 'It is a standard retail barcode used to identify products at point of sale. It encodes a unique product identifier that barcode scanners can read instantly.' },
  { q: 'How is the check digit calculated?', a: 'The check digit uses the standard weighted-sum algorithm: each digit is multiplied by alternating weights of 1 and 3, the products are summed, and the check digit rounds the total up to the next multiple of 10.' },
  { q: 'Is this barcode valid for real products?', a: 'Barcodes generated here have correct structure and check digits, so they will scan. For commercial products you must use GS1-assigned prefixes.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use. Both formats are suitable for printing on labels and packaging.' },
];

const INDUSTRIAL_FAQS: SEOFaq[] = [
  { q: 'What is this barcode used for?', a: 'This barcode is used in logistics, warehousing, and industrial environments for inventory tracking, shipping labels, and asset management.' },
  { q: 'What data can I encode?', a: 'Depending on the symbology, you can encode alphanumeric data, control characters, or numeric-only data. The exact character set depends on the barcode type.' },
  { q: 'Is this barcode scannable?', a: 'Yes. Generated barcodes follow the standard encoding rules and are scannable by any compatible barcode reader.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for maximum print quality or PNG for quick use.' },
];

const EAN13_FAQS: SEOFaq[] = [
  ...PRODUCT_FAQS,
  { q: 'What does EAN-13 stand for?', a: 'EAN stands for European Article Number (now called International Article Number). The 13 indicates a 13-digit code. It is the global standard for retail barcodes outside North America.' },
  { q: 'What do the EAN-13 digits mean?', a: 'The first 2-3 digits are the GS1 country prefix (e.g., 590 for Poland), the next 4-7 digits identify the manufacturer, the following digits identify the product, and the last digit is a check digit.' },
];

const UPC_FAQS: SEOFaq[] = [
  ...PRODUCT_FAQS,
  { q: 'What is the difference between UPC and EAN?', a: 'UPC-A is a 12-digit barcode used in the US and Canada. EAN-13 is a 13-digit barcode used everywhere else. Modern scanners can read both.' },
  { q: 'What do the UPC digits mean?', a: 'The first digit is the number system character, the next 5 digits identify the manufacturer, the following 5 digits identify the product, and the last digit is a check digit.' },
];

const GTIN_FAQS: SEOFaq[] = [
  ...PRODUCT_FAQS,
  { q: 'What is GTIN?', a: 'GTIN (Global Trade Item Number) is the umbrella term for GS1 product identifiers. GTIN-12 includes UPC-A, GTIN-13 includes EAN-13, and GTIN-14 includes ITF-14.' },
  { q: 'What is the difference between GTIN and EAN?', a: 'GTIN is the modern GS1 term. EAN-13 is now called GTIN-13. They are the same barcode — the name changed, the numbers did not.' },
];

const ISBN_FAQS: SEOFaq[] = [
  { q: 'What is ISBN?', a: 'ISBN (International Standard Book Number) is a unique identifier for books. ISBN-13 (13 digits) is the current standard; ISBN-10 (10 digits) was used before 2007.' },
  { q: 'Can I use ISBN barcodes on my book?', a: 'ISBN numbers must be officially assigned by your country\'s ISBN agency. Generated barcodes are valid for testing and prototyping only.' },
  { q: 'How is the ISBN check digit calculated?', a: 'ISBN-13 uses the same weighted-sum algorithm as EAN-13. ISBN-10 uses a mod-11 algorithm with weights 10 through 1, producing check digits 0-9 or X.' },
];

const ISSN_FAQS: SEOFaq[] = [
  ...PRODUCT_FAQS,
  { q: 'What is ISSN used for?', a: 'ISSN (International Standard Serial Number) identifies magazines, journals, newspapers, and other serial publications worldwide.' },
  { q: 'How does an ISSN barcode work?', a: 'An ISSN barcode encodes the 8-digit ISSN plus a 2-digit issue number (add-on). The ISSN itself already includes a check digit.' },
];

const CODE128_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is Code 128 used for?', a: 'Code 128 is a high-density alphanumeric barcode widely used in logistics, shipping, and inventory management. It encodes all 128 ASCII characters.' },
  { q: 'Why choose Code 128 over Code 39?', a: 'Code 128 is more compact (~30% shorter) than Code 39 for the same data, supports the full ASCII character set, and includes enhanced error detection.' },
];

const GS1_128_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is GS1-128?', a: 'GS1-128 is a variant of Code 128 that encodes GS1 Application Identifiers (AIs) — standardized prefixes that indicate the type of data following them (e.g., expiration date, batch number, weight).' },
  { q: 'What makes GS1-128 different from Code 128?', a: 'GS1-128 uses GS1-encoded data with Application Identifiers in parentheses, such as (01) for GTIN, (17) for expiration date, (10) for batch/lot number. This standardises supply chain data exchange.' },
];

const ITF14_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is ITF-14 used for?', a: 'ITF-14 is used on outer shipping cartons and wholesale packaging. It encodes a 14-digit GTIN and is designed for printing on corrugated cardboard.' },
  { q: 'Why use ITF-14 instead of EAN-13?', a: 'ITF-14 is optimised for printing on corrugated surfaces. Its thick bars and bearer bars (surrounding border) make it more reliable when printed on uneven cardboard.' },
];

const PHARMACODE_FAQS: SEOFaq[] = [
  { q: 'What is Pharmacode used for?', a: 'Pharmacode is a pharmaceutical barcode standard used to identify medicine packaging. It encodes a numeric code (3-6 digits) and is read by high-speed production line scanners.' },
  { q: 'How does Pharmacode differ from other barcodes?', a: 'Pharmacode is a bi-directional barcode with no start/stop characters. It uses two different bar widths (narrow/wide) and can be scanned from either direction.' },
  { q: 'Is Pharmacode used in retail?', a: 'Pharmacode is primarily used in pharmaceutical manufacturing for production line control, not retail point-of-sale. For retail pharmacy products, EAN-13 is used.' },
];

const CODABAR_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is Codabar used for?', a: 'Codabar is used in libraries (book IDs), blood banks (blood bag tracking), parcel services (shipping labels), and photo labs (film envelope tracking).' },
  { q: 'What characters can Codabar encode?', a: 'Codabar encodes digits 0-9 and six special characters: -, $, :, /, ., +. It uses one of four start/stop characters (A, B, C, D).' },
];

const CODE39_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is Code 39 used for?', a: 'Code 39 is used in government, military, automotive, and healthcare applications. It encodes uppercase letters, digits, and several special characters.' },
  { q: 'Is Code 39 still widely used?', a: 'Yes, Code 39 remains in widespread use in US government and military logistics, the automotive industry (OI labels), and healthcare labelling.' },
];

const CODE93_FAQS: SEOFaq[] = [
  ...INDUSTRIAL_FAQS,
  { q: 'What is Code 93?', a: 'Code 93 is a higher-density variant of Code 39 that encodes the same character set in a more compact form. It also includes two check characters for better error detection.' },
  { q: 'Why use Code 93 instead of Code 39?', a: 'Code 93 is about 25% more compact than Code 39 and provides stronger error detection with two check characters. Choose it when space is limited.' },
];

const CHECK_DIGIT_FAQS: SEOFaq[] = [
  { q: 'What is a check digit?', a: 'A check digit is a calculated digit appended to a barcode to verify its accuracy during scanning. It is derived from the other digits using a specific algorithm.' },
  { q: 'How does the EAN/UPC check digit work?', a: 'The algorithm multiplies each digit by alternating weights of 1 and 3, sums the products, and calculates the number that rounds the total up to the nearest multiple of 10.' },
  { q: 'What is the ISBN-10 check digit?', a: 'ISBN-10 uses a modulo-11 algorithm with weights decreasing from 10 to 1. The check digit can be 0-9 or X (representing 10).' },
  { q: 'Can a check digit always detect errors?', a: 'Check digits catch single-digit errors (e.g., 5 → 6) and most transposition errors (e.g., 12 → 21). No error-detection scheme catches all errors, but check digits reduce scanning errors significantly.' },
];

/* ── SEO Pages Registry ────────────────────────────────────────────────── */

export const BARCODE_SEO_PAGES: Record<string, BarcodeSEOPageConfig> = {
  'ean13-generator': {
    id: 'ean13-generator',
    slug: 'ean13-generator',
    barcodeType: 'ean13',
    title: 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
    description: 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
    heroTitle: 'EAN-13 Generator',
    heroSubtitle: 'Generate EAN-13 barcodes for retail products. Automatic check digit calculation, live preview, and instant download in SVG or PNG.',
    faqs: EAN13_FAQS,
  },
  'ean8-generator': {
    id: 'ean8-generator',
    slug: 'ean8-generator',
    barcodeType: 'ean8',
    title: 'EAN-8 Generator — Create Compact EAN-8 Barcodes',
    description: 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
    heroTitle: 'EAN-8 Generator',
    heroSubtitle: 'Generate compact EAN-8 barcodes for small product packaging and shelf labels where space is limited.',
    faqs: PRODUCT_FAQS,
  },
  'upc-generator': {
    id: 'upc-generator',
    slug: 'upc-generator',
    barcodeType: 'upca',
    title: 'UPC Generator — Create UPC-A & UPC-E Barcodes Online',
    description: 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
    heroTitle: 'UPC Generator',
    heroSubtitle: 'Generate UPC-A and UPC-E barcodes for retail products in the US and Canada. Automatic check digit, live preview, and instant export.',
    faqs: UPC_FAQS,
  },
  'code128-generator': {
    id: 'code128-generator',
    slug: 'code128-generator',
    barcodeType: 'code128',
    title: 'Code 128 Generator — Create High-Density Barcodes',
    description: 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
    heroTitle: 'Code 128 Generator',
    heroSubtitle: 'Generate high-density Code 128 barcodes for logistics labels, shipping tags, and inventory management systems.',
    faqs: CODE128_FAQS,
  },
  'code39-generator': {
    id: 'code39-generator',
    slug: 'code39-generator',
    barcodeType: 'code39',
    title: 'Code 39 Generator — Create Alphanumeric Barcodes',
    description: 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.',
    heroTitle: 'Code 39 Generator',
    heroSubtitle: 'Generate Code 39 barcodes for industrial, government, and military labelling applications.',
    faqs: CODE39_FAQS,
  },
  'code93-generator': {
    id: 'code93-generator',
    slug: 'code93-generator',
    barcodeType: 'code93',
    title: 'Code 93 Generator — Create Compact Industrial Barcodes',
    description: 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.',
    heroTitle: 'Code 93 Generator',
    heroSubtitle: 'Generate Code 93 barcodes — a more compact and secure alternative to Code 39 for industrial labelling.',
    faqs: CODE93_FAQS,
  },
  'codabar-generator': {
    id: 'codabar-generator',
    slug: 'codabar-generator',
    barcodeType: 'codabar',
    title: 'Codabar Generator — Create Library & Blood Bank Barcodes',
    description: 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.',
    heroTitle: 'Codabar Generator',
    heroSubtitle: 'Generate Codabar barcodes for library books, blood bank tracking, and parcel delivery labels.',
    faqs: CODABAR_FAQS,
  },
  'gtin-generator': {
    id: 'gtin-generator',
    slug: 'gtin-generator',
    barcodeType: 'gtin',
    title: 'GTIN Generator — Create Global Trade Item Numbers',
    description: 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.',
    heroTitle: 'GTIN Generator',
    heroSubtitle: 'Generate GTIN-13 barcodes for global supply chain product identification and trade item tracking.',
    faqs: GTIN_FAQS,
  },
  'isbn-generator': {
    id: 'isbn-generator',
    slug: 'isbn-generator',
    barcodeType: 'isbn13',
    title: 'ISBN Generator — Create Book Barcodes (ISBN-13 & ISBN-10)',
    description: 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.',
    heroTitle: 'ISBN Generator',
    heroSubtitle: 'Generate ISBN-13 and ISBN-10 barcodes for books. Automatic check digit calculation for both formats.',
    faqs: ISBN_FAQS,
  },
  'issn-generator': {
    id: 'issn-generator',
    slug: 'issn-generator',
    barcodeType: 'issn',
    title: 'ISSN Generator — Create Serial Publication Barcodes',
    description: 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.',
    heroTitle: 'ISSN Generator',
    heroSubtitle: 'Generate ISSN barcodes for magazines, journals, and other serial publications.',
    faqs: ISSN_FAQS,
  },
  'itf14-generator': {
    id: 'itf14-generator',
    slug: 'itf14-generator',
    barcodeType: 'itf14',
    title: 'ITF-14 Generator — Create Shipping Carton Barcodes',
    description: 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.',
    heroTitle: 'ITF-14 Generator',
    heroSubtitle: 'Generate ITF-14 barcodes for shipping cartons, wholesale packaging, and logistics labels.',
    faqs: ITF14_FAQS,
  },
  'gs1-128-generator': {
    id: 'gs1-128-generator',
    slug: 'gs1-128-generator',
    barcodeType: 'gs1-128',
    title: 'GS1-128 Generator — Create Supply Chain Barcodes with AIs',
    description: 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.',
    heroTitle: 'GS1-128 Generator',
    heroSubtitle: 'Generate GS1-128 barcodes with Application Identifiers (AIs) for standardized supply chain data exchange.',
    faqs: GS1_128_FAQS,
  },
  'pharmacode-generator': {
    id: 'pharmacode-generator',
    slug: 'pharmacode-generator',
    barcodeType: 'pharmacode',
    title: 'Pharmacode Generator — Create Pharmaceutical Barcodes',
    description: 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.',
    heroTitle: 'Pharmacode Generator',
    heroSubtitle: 'Generate Pharmacode barcodes for pharmaceutical production line tracking and medicine packaging.',
    faqs: PHARMACODE_FAQS,
  },
  'check-digit-calculator': {
    id: 'check-digit-calculator',
    slug: 'check-digit-calculator',
    barcodeType: 'ean13',
    title: 'Check Digit Calculator — Calculate Barcode Check Digits Online',
    description: 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.',
    heroTitle: 'Barcode Check Digit Calculator',
    heroSubtitle: 'Calculate and verify check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes with detailed step-by-step explanations.',
    ctaLabel: 'Open Check Digit Calculator',
    faqs: CHECK_DIGIT_FAQS,
  },
};

export const ALL_BARCODE_SEO_PAGES = Object.values(BARCODE_SEO_PAGES);
