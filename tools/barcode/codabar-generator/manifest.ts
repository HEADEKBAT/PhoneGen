/**
 * Codabar Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import CodabarGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is Codabar used for?', a: 'Codabar is used in libraries (book IDs), blood banks (blood bag tracking), parcel services (shipping labels), and photo labs.' },
  { q: 'What characters can Codabar encode?', a: 'Codabar encodes digits 0-9 and six special characters: -, $, :, /, ., +. It uses one of four start/stop characters (A, B, C, D).' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for maximum print quality or PNG for quick use.' },
];

export const codabarGenerator = defineTool({
  id: 'codabar-generator',
  product: 'barcode',
  name: 'Codabar Generator',
  ui: { component: CodabarGeneratorUI, icon: Scan },
  seo: {
    meta: {
      en: { title: 'Codabar Generator — Create Library & Blood Bank Barcodes', description: 'Generate Codabar barcodes for libraries, blood banks, and parcel tracking. Free online Codabar generator with start/stop characters.', keywords: ['Codabar generator', 'Codabar barcode', 'library barcode', 'blood bank barcode'] },
      ru: { title: 'Генератор Codabar — Создание штрихкодов Codabar', description: 'Создавайте штрихкоды Codabar. Бесплатный генератор.' },
      de: { title: 'Codabar Generator — Codabar Barcodes erstellen', description: 'Erstellen Sie Codabar Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador Codabar — Cree códigos de barras Codabar', description: 'Cree códigos de barras Codabar. Generador gratuito.' },
      fr: { title: 'Générateur Codabar — Créez des codes-barres Codabar', description: 'Créez des codes-barres Codabar. Générateur gratuit.' },
      pt: { title: 'Gerador Codabar — Crie códigos de barras Codabar', description: 'Crie códigos de barras Codabar. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
