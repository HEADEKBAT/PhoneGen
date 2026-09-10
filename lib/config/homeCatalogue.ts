/**
 * Home page catalogue — how the products are grouped, and what each one returns.
 *
 * ── Why this is not just PRODUCTS ───────────────────────────────────────────
 *
 * The home page used to render ALL_PRODUCTS alphabetically: twenty-three cards
 * in one 2 300-pixel grid, where "Address Generator" sat next to "Barcode
 * Generator" for no reason other than the letter A. Seven of them were
 * `status: 'planned'` and led nowhere.
 *
 * A catalogue is not a registry dump. It answers "what am I trying to do",
 * so the grouping below is by task, and the alphabet does not come into it.
 *
 * ── The sample line ─────────────────────────────────────────────────────────
 *
 * Each entry carries one line of the generator's real output. It is the most
 * useful thing a catalogue card can show — you learn what a tool gives you
 * before deciding to open it — and it costs one string.
 *
 * Samples are DATA, not copy: `+1 202 555 0182` and `5901234123457` are the
 * same in every language, so they are not translated. The `validates` label
 * beside them names a standard (Luhn, EAN-13, bech32) for the same reason.
 *
 * Titles and descriptions are NOT here — they come from the i18n files via
 * `products.<id>.title` / `.description`, so the catalogue is translated.
 */

/** A product id from PRODUCTS, paired with what it returns. */
export interface CatalogueEntry {
  /** Product id — the key into PRODUCTS and into the i18n `products.*` tree. */
  id: string;
  /** One line of real output, shown in monospace. Never translated. */
  sample: string;
  /** Standard the sample satisfies (Luhn, EAN-13, bech32…). Never translated. */
  validates?: string;
  /**
   * Extra search terms, lowercase and space-separated. The product's own
   * translated title and description are searched too; this covers the words
   * people type that appear in neither — 'msisdn', 'guid', 'colour'.
   */
  keywords: string;
}

export interface CatalogueGroup {
  /** Stable id; the i18n keys are `home.groups.<id>.title` / `.note`. */
  id: string;
  entries: CatalogueEntry[];
}

/**
 * Five groups, each 2–6 tools. The order is by how often people arrive
 * wanting them: contact and identity data first, heavy media last.
 */
export const CATALOGUE_GROUPS: CatalogueGroup[] = [
  {
    id: 'people',
    entries: [
      { id: 'phone', sample: '+1 202 555 0182', validates: 'E.164', keywords: 'phone mobile tel msisdn number' },
      { id: 'user', sample: 'Marta Nowak · 1991-04-18', keywords: 'user person profile people fake identity' },
      { id: 'address', sample: '12 Rue de Rivoli, 75004 Paris', keywords: 'address street postal zip city region' },
      { id: 'email', sample: 'm.nowak+test@example.dev', keywords: 'email mail inbox address disposable' },
      { id: 'username', sample: 'swift_falcon_84', keywords: 'username handle nickname login slug' },
      { id: 'company', sample: 'Nordwind Logistik GmbH', keywords: 'company business organisation firm brand' },
    ],
  },
  {
    id: 'secrets',
    entries: [
      { id: 'credential', sample: 'Tq7#vLm2$aXe9', validates: '92 bits', keywords: 'password passphrase pin secret api key token jwt webhook' },
      { id: 'uuid', sample: '018f3a1c-7b2e-7d4a-9c11', keywords: 'uuid guid identifier id v4 v7 ulid' },
    ],
  },
  {
    id: 'payments',
    entries: [
      { id: 'payment', sample: '4539 1488 0343 6467', validates: 'Luhn', keywords: 'payment card credit visa mastercard amex bin cvv luhn' },
      { id: 'creditCard', sample: '5425 2334 3010 9903', validates: 'Luhn', keywords: 'credit card number test payment' },
      { id: 'cryptoWallet', sample: 'bc1q…kgdygjrsqtzq2n0yrf', validates: 'bech32', keywords: 'crypto wallet bitcoin ethereum bip39 mnemonic blockchain web3 seed' },
    ],
  },
  {
    id: 'codes',
    entries: [
      { id: 'qr', sample: 'WIFI:S:Office;T:WPA;P:…', keywords: 'qr code wifi vcard url 2d scan' },
      { id: 'barcode', sample: '5901234123457', validates: 'EAN-13', keywords: 'barcode ean upc code128 code39 isbn issn itf gtin check digit' },
    ],
  },
  {
    id: 'media',
    entries: [
      { id: 'color', sample: '#3ECF8E → oklch(.77 .14 158)', keywords: 'color colour palette gradient contrast wcag hex rgb hsl oklch tailwind' },
      { id: 'image', sample: 'portrait.jpg → cutout.png', validates: 'alpha', keywords: 'image photo background remove upscale resize convert png webp' },
      { id: 'media', sample: 'mp4 → webm · −72%', keywords: 'video media convert compress trim mp4 webm audio extract ffmpeg' },
    ],
  },
];

/** Every product id the catalogue shows, in display order. */
export const CATALOGUE_PRODUCT_IDS: string[] = CATALOGUE_GROUPS.flatMap((g) =>
  g.entries.map((e) => e.id),
);
