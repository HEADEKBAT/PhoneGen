/**
 * EAN-8 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import EAN8GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is EAN-8 used for?', a: 'EAN-8 is a compact 8-digit barcode for small products and shelf labels where space is limited.' },
  { q: 'How is the check digit calculated?', a: 'Each digit is multiplied by alternating weights of 1 and 3, the products are summed, and the check digit rounds the total up to the next multiple of 10.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use.' },
];

export const ean8Generator = defineTool({
  id: 'ean8-generator',
  product: 'barcode',
  name: 'EAN-8 Generator',
  ui: {
    component: EAN8GeneratorUI,
    icon: Scan,
  },
  seo: {
    meta: {
      en: {
        title: 'EAN-8 Generator — Create Compact EAN-8 Barcodes Online',
        description: 'Generate EAN-8 barcodes for small products and shelf labels. Free online EAN-8 barcode generator with check digit and export.',
        keywords: ['EAN-8 generator', 'EAN-8 barcode', 'compact barcode', 'shelf label', 'small product barcode'],
      },
      ru: {
        title: 'Генератор EAN-8 — Создание компактных штрихкодов EAN-8',
        description: 'Создавайте компактные штрихкоды EAN-8. Бесплатный генератор.',
      },
      de: {
        title: 'EAN-8 Generator — Kompakte EAN-8 Barcodes erstellen',
        description: 'Erstellen Sie kompakte EAN-8 Barcodes. Kostenloser Generator.',
      },
      es: {
        title: 'Generador EAN-8 — Cree códigos de barras EAN-8 compactos',
        description: 'Cree códigos de barras EAN-8 compactos. Generador gratuito.',
      },
      fr: {
        title: 'Générateur EAN-8 — Créez des codes-barres EAN-8 compacts',
        description: 'Créez des codes-barres EAN-8 compacts. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador EAN-8 — Crie códigos de barras EAN-8 compactos',
        description: 'Crie códigos de barras EAN-8 compactos. Gerador gratuito.',
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
