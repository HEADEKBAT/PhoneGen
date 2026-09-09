/**
 * Export Formatters — Convert card data to various output formats.
 *
 * Supports: TXT, CSV, JSON, SQL (INSERT), XML, YAML, Clipboard.
 */

import type { CardData, PaymentExportFormat, PaymentProfile } from './types';

/* ── Individual card formatters ──────────────────────────────────────────────── */

function formatAsTXT(card: CardData): string {
  return [
    `Card Number:  ${card.formattedPan}`,
    `Holder:       ${card.holder}`,
    `Expires:      ${card.expiryShort}`,
    `CVV:          ${card.cvv}`,
    `Network:      ${card.network}`,
    `BIN:          ${card.bin}`,
    `Last 4:       ${card.last4}`,
    `Luhn Valid:   ${card.luhnValid ? 'Yes' : 'No'}`,
  ].join('\n');
}

function formatAsCSV(cards: CardData[]): string {
  const header = 'pan,holder,expiryMonth,expiryYear,cvv,network,bin,last4,luhnValid';
  const rows = cards.map((c) =>
    [
      c.pan,
      `"${c.holder}"`,
      c.expiryMonth,
      c.expiryYear,
      c.cvv,
      c.network,
      c.bin,
      c.last4,
      c.luhnValid ? 'true' : 'false',
    ].join(','),
  );
  return [header, ...rows].join('\n');
}

function formatAsJSON(cards: CardData[], pretty?: boolean): string {
  if (pretty) {
    return JSON.stringify(cards.length === 1 ? cards[0] : cards, null, 2);
  }
  return JSON.stringify(cards.length === 1 ? cards[0] : cards);
}

function formatAsSQL(cards: CardData[], tableName = 'test_cards'): string {
  const rows = cards.map((c) => {
    const values = [
      `'${c.pan}'`,
      `'${c.holder.replace(/'/g, "''")}'`,
      `'${c.expiryMonth}'`,
      `'${c.expiryYear}'`,
      `'${c.cvv}'`,
      `'${c.network}'`,
      `'${c.bin}'`,
      `'${c.last4}'`,
      c.luhnValid ? 'true' : 'false',
    ];
    return `(${values.join(', ')})`;
  });

  return [
    `CREATE TABLE IF NOT EXISTS ${tableName} (`,
    '  pan TEXT PRIMARY KEY,',
    '  holder TEXT NOT NULL,',
    '  expiry_month TEXT NOT NULL,',
    '  expiry_year TEXT NOT NULL,',
    '  cvv TEXT NOT NULL,',
    '  network TEXT NOT NULL,',
    '  bin TEXT NOT NULL,',
    '  last4 TEXT NOT NULL,',
    '  luhn_valid BOOLEAN NOT NULL',
    ');',
    '',
    `INSERT INTO ${tableName} (pan, holder, expiry_month, expiry_year, cvv, network, bin, last4, luhn_valid) VALUES`,
    rows.join(',\n') + ';',
  ].join('\n');
}

function formatAsXML(cards: CardData[]): string {
  const cardXml = cards.map((c) => {
    const fields = [
      '<pan>', c.pan, '</pan>',
      '<holder>', c.holder, '</holder>',
      '<expiryMonth>', c.expiryMonth, '</expiryMonth>',
      '<expiryYear>', c.expiryYear, '</expiryYear>',
      '<cvv>', c.cvv, '</cvv>',
      '<network>', c.network, '</network>',
      '<bin>', c.bin, '</bin>',
      '<last4>', c.last4, '</last4>',
      '<luhnValid>', String(c.luhnValid), '</luhnValid>',
    ].join('');
    return `  <card>${fields}</card>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<testCards>\n${cardXml}\n</testCards>`;
}

function formatAsYAML(cards: CardData[]): string {
  return cards.map((c) => {
    return [
      `- pan: ${c.pan}`,
      `  holder: ${c.holder}`,
      `  expiry: "${c.expiryMonth}/${c.expiryYear}"`,
      `  cvv: ${c.cvv}`,
      `  network: ${c.network}`,
      `  bin: ${c.bin}`,
      `  last4: ${c.last4}`,
      `  luhnValid: ${c.luhnValid}`,
    ].join('\n');
  }).join('\n\n');
}

/* ── Profile formatters ──────────────────────────────────────────────────────── */

function formatProfileAsJSON(profile: PaymentProfile): string {
  return JSON.stringify(
    {
      card: {
        number: profile.card.pan,
        formatted: profile.card.formattedPan,
        expiry: profile.card.expiryFull,
        cvv: profile.card.cvv,
        holder: profile.card.holder,
        network: profile.card.network,
      },
      billing: {
        email: profile.email,
        phone: profile.phone,
        address: {
          street: profile.address.street,
          city: profile.address.city,
          state: profile.address.state,
          zip: profile.address.zip,
          country: profile.address.country,
          countryCode: profile.address.countryCode,
        },
      },
      currency: profile.currency,
    },
    null,
    2,
  );
}

/* ── Public API ──────────────────────────────────────────────────────────────── */

/**
 * Export card(s) to the given format.
 * Always returns a string.
 */
export function exportCards(
  cards: CardData[],
  format: PaymentExportFormat,
  options?: { pretty?: boolean; tableName?: string },
): string {
  switch (format) {
    case 'txt':  return cards.length === 1 ? formatAsTXT(cards[0]) : cards.map(formatAsTXT).join('\n\n---\n\n');
    case 'csv':  return formatAsCSV(cards);
    case 'json': return formatAsJSON(cards, options?.pretty ?? true);
    case 'sql':  return formatAsSQL(cards, options?.tableName);
    case 'xml':  return formatAsXML(cards);
    case 'yml':  return formatAsYAML(cards);
    case 'clipboard': {
      // For clipboard, use CSV for multiple, TXT for single
      return cards.length === 1 ? formatAsTXT(cards[0]) : formatAsCSV(cards);
    }
    default:     return formatAsJSON(cards, true);
  }
}

/**
 * Export a full payment profile as JSON string.
 */
export function exportProfile(profile: PaymentProfile): string {
  return formatProfileAsJSON(profile);
}

/** Get MIME type for a format */
export function getExportMimeType(format: PaymentExportFormat): string {
  switch (format) {
    case 'txt':       return 'text/plain';
    case 'csv':       return 'text/csv';
    case 'json':      return 'application/json';
    case 'sql':       return 'text/plain';
    case 'xml':       return 'application/xml';
    case 'yml':       return 'text/yaml';
    case 'clipboard': return 'text/plain';
  }
}

/** Get file extension for a format */
export function getExportExtension(format: PaymentExportFormat): string {
  switch (format) {
    case 'txt':       return 'txt';
    case 'csv':       return 'csv';
    case 'json':      return 'json';
    case 'sql':       return 'sql';
    case 'xml':       return 'xml';
    case 'yml':       return 'yaml';
    case 'clipboard': return 'txt';
  }
}
