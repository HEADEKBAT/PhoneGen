/**
 * Code 39 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import Code39GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is Code 39 used for?', a: 'Code 39 is used in government, military, automotive, and healthcare applications. It encodes uppercase letters, digits, and several special characters.' },
  { q: 'Is Code 39 still widely used?', a: 'Yes, Code 39 remains in widespread use in US government and military logistics, the automotive industry (OI labels), and healthcare labelling.' },
  { q: 'What characters can Code 39 encode?', a: 'Code 39 encodes uppercase A-Z, digits 0-9, and special characters: -, ., $, /, +, %, and space.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for maximum print quality or PNG for quick use.' },
];

export const code39Generator = defineTool({
  id: 'code39-generator',
  product: 'barcode',
  name: 'Code 39 Generator',
  ui: { component: Code39GeneratorUI, icon: Scan },
  seo: {
    meta: {
      en: { title: 'Code 39 Generator — Create Alphanumeric Barcodes Online', description: 'Generate Code 39 barcodes for industrial and government applications. Free online Code 39 barcode generator with alphanumeric encoding.', keywords: ['Code 39 generator', 'Code 39 barcode', 'industrial barcode', 'alphanumeric barcode', 'military logistics'] },
      ru: { title: 'Генератор Code 39 — Создание штрихкодов Code 39', description: 'Создавайте штрихкоды Code 39. Бесплатный генератор.' },
      de: { title: 'Code 39 Generator — Code 39 Barcodes erstellen', description: 'Erstellen Sie Code 39 Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador Code 39 — Cree códigos de barras Code 39', description: 'Cree códigos de barras Code 39. Generador gratuito.' },
      fr: { title: 'Générateur Code 39 — Créez des codes-barres Code 39', description: 'Créez des codes-barres Code 39. Générateur gratuit.' },
      pt: { title: 'Gerador Code 39 — Crie códigos de barras Code 39', description: 'Crie códigos de barras Code 39. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
