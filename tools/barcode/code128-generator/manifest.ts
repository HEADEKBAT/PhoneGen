/**
 * Code 128 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import Code128GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is Code 128 used for?', a: 'Code 128 is a high-density alphanumeric barcode widely used in logistics, shipping, and inventory management. It encodes all 128 ASCII characters.' },
  { q: 'Why choose Code 128 over Code 39?', a: 'Code 128 is more compact (~30% shorter) than Code 39 for the same data, supports the full ASCII character set, and includes enhanced error detection.' },
  { q: 'What data can I encode?', a: 'Code 128 can encode any alphanumeric data including letters, digits, and special characters. It supports the full 128 ASCII character set.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for maximum print quality or PNG for quick use.' },
];

export const code128Generator = defineTool({
  id: 'code128-generator',
  product: 'barcode',
  name: 'Code 128 Generator',
  ui: {
    component: Code128GeneratorUI,
    icon: Scan,
  },
  seo: {
    meta: {
      en: {
        title: 'Code 128 Generator — Create High-Density Barcodes Online',
        description: 'Generate Code 128 barcodes for logistics, shipping, and inventory. Free online Code 128 barcode generator with alphanumeric support.',
        keywords: ['Code 128 generator', 'Code 128 barcode', 'logistics barcode', 'alphanumeric barcode', 'high-density'],
      },
      ru: {
        title: 'Генератор Code 128 — Создание штрихкодов Code 128',
        description: 'Создавайте штрихкоды Code 128 для логистики. Бесплатный генератор.',
      },
      de: {
        title: 'Code 128 Generator — Code 128 Barcodes erstellen',
        description: 'Erstellen Sie Code 128 Barcodes für Logistik. Kostenloser Generator.',
      },
      es: {
        title: 'Generador Code 128 — Cree códigos de barras Code 128',
        description: 'Cree códigos de barras Code 128 para logística. Generador gratuito.',
      },
      fr: {
        title: 'Générateur Code 128 — Créez des codes-barres Code 128',
        description: 'Créez des codes-barres Code 128 pour la logistique. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador Code 128 — Crie códigos de barras Code 128',
        description: 'Crie códigos de barras Code 128 para logística. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: false,
    export: ['svg', 'png'],
    share: false,
    favorites: false,
    bulk: true,
  },
});
