/**
 * GS1-128 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import GS1128GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is GS1-128?', a: 'GS1-128 is a variant of Code 128 that encodes GS1 Application Identifiers (AIs) — standardized prefixes that indicate the type of data following them (e.g., expiration date, batch number, weight).' },
  { q: 'What makes GS1-128 different from Code 128?', a: 'GS1-128 uses GS1-encoded data with Application Identifiers in parentheses, such as (01) for GTIN, (17) for expiration date, (10) for batch/lot number.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for maximum print quality or PNG for quick use.' },
];

export const gs1128Generator = defineTool({
  id: 'gs1-128-generator',
  product: 'barcode',
  name: 'GS1-128 Generator',
  ui: { component: GS1128GeneratorUI, icon: Scan },
  seo: {
    meta: {
      en: { title: 'GS1-128 Generator — Create Supply Chain Barcodes with AIs', description: 'Generate GS1-128 barcodes with Application Identifiers for supply chain data. Free online GS1-128 barcode generator.', keywords: ['GS1-128 generator', 'GS1-128 barcode', 'supply chain barcode', 'application identifier'] },
      ru: { title: 'Генератор GS1-128 — Создание штрихкодов для цепочек поставок', description: 'Создавайте штрихкоды GS1-128. Бесплатный генератор.' },
      de: { title: 'GS1-128 Generator — Barcodes für Lieferketten', description: 'Erstellen Sie GS1-128 Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador GS1-128 — Cree códigos de barras para cadena de suministro', description: 'Cree códigos de barras GS1-128. Generador gratuito.' },
      fr: { title: 'Générateur GS1-128 — Codes-barres pour chaîne d\'approvisionnement', description: 'Créez des codes-barres GS1-128. Générateur gratuit.' },
      pt: { title: 'Gerador GS1-128 — Crie códigos de barras para cadeia de suprimentos', description: 'Crie códigos de barras GS1-128. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
