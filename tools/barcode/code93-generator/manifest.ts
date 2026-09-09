/**
 * Code 93 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import Code93GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is Code 93?', a: 'Code 93 is a higher-density variant of Code 39 that encodes the same character set in a more compact form with two check characters for better error detection.' },
  { q: 'Why use Code 93 instead of Code 39?', a: 'Code 93 is about 25% more compact than Code 39 and provides stronger error detection with two check characters.' },
  { q: 'What characters can Code 93 encode?', a: 'Code 93 encodes uppercase A-Z, digits 0-9, and special characters: -, ., $, /, +, %, and space.' },
];

export const code93Generator = defineTool({
  id: 'code93-generator',
  product: 'barcode',
  name: 'Code 93 Generator',
  ui: { component: Code93GeneratorUI, icon: Scan },
  seo: {
    meta: {
      en: { title: 'Code 93 Generator — Create Compact Industrial Barcodes', description: 'Generate Code 93 barcodes with higher density than Code 39. Free online Code 93 barcode generator with double check character security.', keywords: ['Code 93 generator', 'Code 93 barcode', 'compact barcode', 'industrial barcode'] },
      ru: { title: 'Генератор Code 93 — Создание компактных штрихкодов', description: 'Создавайте компактные штрихкоды Code 93. Бесплатный генератор.' },
      de: { title: 'Code 93 Generator — Kompakte Barcodes erstellen', description: 'Erstellen Sie kompakte Code 93 Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador Code 93 — Cree códigos de barras compactos', description: 'Cree códigos de barras Code 93 compactos. Generador gratuito.' },
      fr: { title: 'Générateur Code 93 — Codes-barres compacts', description: 'Créez des codes-barres Code 93 compacts. Générateur gratuit.' },
      pt: { title: 'Gerador Code 93 — Crie códigos de barras compactos', description: 'Crie códigos de barras Code 93 compactos. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
