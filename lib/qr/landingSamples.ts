/**
 * The examples the QR landing shows, built on the server.
 *
 * Every payload string on that page comes out of the same encoders the studio
 * uses — `WIFI:T:WPA;S:…` is the literal text that ends up inside the symbol,
 * not a hand-typed approximation of it. A page that advertises "35 content
 * types" and shows none of them is asking to be taken on faith; showing the
 * actual payload is both the proof and the most useful thing on the page for
 * anyone deciding whether this tool speaks their format.
 */

import { encodeContent, QR_CONTENT_TYPES } from './contentTypes';
import { buildMatrix } from './matrix';
import { analyseReadiness } from './readiness';
import { buildSVG } from './vector';
import type { QRContentType, QROptions } from './types';

export interface PayloadSample {
  type: QRContentType;
  /** What actually goes inside the symbol. */
  payload: string;
}

export interface HeroSymbol {
  /** A complete `<svg>` element, ready to be inlined. */
  svg: string;
  url: string;
  version: number;
  modules: number;
  bytes: number;
  capacity: number;
  errorCorrection: string;
  quietZone: number;
}

const HERO_OPTIONS: QROptions = {
  content: 'https://www.gencore.space/qr-generator',
  moduleStyle: 'square',
  eyeStyle: 'classic',
  colors: { pattern: '#0b0e14', eye: '#0b0e14', background: '#ffffff' },
  background: { type: 'solid', value: '#ffffff' },
  quietZone: 4,
  errorCorrection: 'M',
};

/** A real, scannable symbol for the hero, rendered as inline SVG. */
export function getHeroSymbol(): HeroSymbol | null {
  const readiness = analyseReadiness(HERO_OPTIONS);
  const matrix = buildMatrix(HERO_OPTIONS.content, readiness.errorCorrection);
  if (!matrix) return null;

  return {
    svg: buildSVG(matrix, {
      quietZone: HERO_OPTIONS.quietZone,
      foreground: HERO_OPTIONS.colors.pattern,
      background: '#ffffff',
    }),
    url: HERO_OPTIONS.content,
    version: readiness.version,
    modules: readiness.modules,
    bytes: readiness.bytes,
    capacity: readiness.capacity,
    errorCorrection: readiness.errorCorrection,
    quietZone: HERO_OPTIONS.quietZone,
  };
}

/** Grouped the way someone looks for them, not the way they are implemented. */
export const PAYLOAD_GROUPS: { id: string; types: QRContentType[] }[] = [
  { id: 'everyday', types: ['url', 'wifi', 'vcard', 'email', 'phone', 'sms'] },
  { id: 'apps', types: ['whatsapp', 'telegram', 'youtube', 'instagram', 'github', 'zoom'] },
  { id: 'money', types: ['bitcoin', 'ethereum', 'paypal', 'upi', 'sepa', 'location'] },
];

/** Sample data per type, chosen to make the shape of the payload obvious. */
const SAMPLE_DATA: Partial<Record<QRContentType, Record<string, string>>> = {
  url: { url: 'https://www.gencore.space' },
  wifi: { ssid: 'Office 2F', password: 'hunter2', encryption: 'WPA' },
  vcard: { firstName: 'Ada', lastName: 'Lovelace', phone: '+442079460123', email: 'ada@example.org' },
  email: { email: 'hello@example.org', subject: 'Invoice 2041' },
  phone: { phone: '+442079460123' },
  sms: { phone: '+442079460123', message: 'Table for two at eight?' },
  whatsapp: { phone: '442079460123', message: 'On my way' },
  telegram: { username: 'gencore' },
  youtube: { channelOrVideo: 'watch?v=dQw4w9WgXcQ' },
  instagram: { username: 'gencore' },
  github: { repo: 'gencore/qr' },
  zoom: { meetingId: '8451230099' },
  bitcoin: { address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', amount: '0.015' },
  ethereum: { address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', amount: '0.5' },
  paypal: { paypalId: 'gencore', amount: '25.00', currency: 'EUR' },
  upi: { upiId: 'gencore@okaxis', name: 'GenCore', amount: '499' },
  sepa: { name: 'GenCore Ltd', iban: 'DE89370400440532013000', amount: '120.00' },
  location: { latitude: '48.8584', longitude: '2.2945' },
};

/** One payload per type in the groups above, produced by the real encoders. */
export function getPayloadSamples(): PayloadSample[] {
  const samples: PayloadSample[] = [];

  for (const group of PAYLOAD_GROUPS) {
    for (const type of group.types) {
      const data = SAMPLE_DATA[type];
      if (!data) continue;

      /* A vCard is eight lines; on a card it reads as one, so the newlines
         become a separator the eye can follow. An encoder that throws on this
         sample data is a bug in the sample, not something to ship blank. */
      const payload = encodeContent(type, data);
      if (payload) samples.push({ type, payload: payload.replace(/\r?\n/g, ' · ') });
    }
  }

  return samples;
}

/** How many content types the studio actually implements. Counted, not claimed. */
export const CONTENT_TYPE_COUNT = Object.keys(QR_CONTENT_TYPES).length;
