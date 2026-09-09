/**
 * ITF-14 Generator — Tool Manifest
 */

import { Package } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import ITF14GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is ITF-14 used for?', a: 'ITF-14 is used on outer shipping cartons and wholesale packaging. It encodes a 14-digit GTIN and is designed for printing on corrugated cardboard.' },
  { q: 'Why use ITF-14 instead of EAN-13?', a: 'ITF-14 is optimised for printing on corrugated surfaces. Its thick bars and bearer bars (surrounding border) make it more reliable when printed on uneven cardboard.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use.' },
];

export const itf14Generator = defineTool({
  id: 'itf14-generator',
  product: 'barcode',
  name: 'ITF-14 Generator',
  ui: { component: ITF14GeneratorUI, icon: Package },
  seo: {
    meta: {
      en: { title: 'ITF-14 Generator — Create Shipping Carton Barcodes', description: 'Generate ITF-14 barcodes for outer shipping cartons and wholesale packaging. Free online ITF-14 generator with bearer bars.', keywords: ['ITF-14 generator', 'ITF-14 barcode', 'shipping barcode', 'carton barcode', 'wholesale packaging'] },
      ru: { title: 'Генератор ITF-14 — Создание штрихкодов для коробок', description: 'Создавайте штрихкоды ITF-14 для упаковки. Бесплатный генератор.' },
      de: { title: 'ITF-14 Generator — Barcodes für Versandkartons', description: 'Erstellen Sie ITF-14 Barcodes für Versandkartons. Kostenloser Generator.' },
      es: { title: 'Generador ITF-14 — Cree códigos de barras para envíos', description: 'Cree códigos de barras ITF-14. Generador gratuito.' },
      fr: { title: 'Générateur ITF-14 — Codes-barres pour cartons d\'expédition', description: 'Créez des codes-barres ITF-14. Générateur gratuit.' },
      pt: { title: 'Gerador ITF-14 — Crie códigos de barras para remessas', description: 'Crie códigos de barras ITF-14. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
