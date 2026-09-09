/**
 * EAN-13 Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import EAN13GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is EAN-13 used for?', a: 'EAN-13 is the global standard retail barcode used to identify products at point of sale worldwide (except North America, where UPC-A is standard).' },
  { q: 'How is the check digit calculated?', a: 'Each digit is multiplied by alternating weights of 1 and 3, the products are summed, and the check digit rounds the total up to the next multiple of 10.' },
  { q: 'Is this barcode valid for real products?', a: 'Barcodes generated here have correct structure and check digits. For commercial products you must use GS1-assigned prefixes.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use. Both formats are suitable for printing on labels and packaging.' },
];

export const ean13Generator = defineTool({
  id: 'ean13-generator',
  product: 'barcode',
  name: 'EAN-13 Generator',
  ui: {
    component: EAN13GeneratorUI,
    icon: Scan,
  },
  seo: {
    meta: {
      en: {
        title: 'EAN-13 Generator — Create Valid EAN-13 Barcodes Online',
        description: 'Generate EAN-13 barcodes with correct check digits. Free online EAN-13 barcode generator with SVG/PNG export and bulk generation.',
        keywords: ['EAN-13 generator', 'EAN-13 barcode', 'retail barcode', 'product barcode', 'check digit'],
      },
      ru: {
        title: 'Генератор EAN-13 — Создание штрихкодов EAN-13 онлайн',
        description: 'Создавайте штрихкоды EAN-13 с правильными контрольными цифрами. Бесплатный генератор.',
      },
      de: {
        title: 'EAN-13 Generator — EAN-13 Barcodes online erstellen',
        description: 'Erstellen Sie EAN-13 Barcodes mit korrekten Prüfziffern. Kostenloser Generator.',
      },
      es: {
        title: 'Generador EAN-13 — Cree códigos de barras EAN-13',
        description: 'Cree códigos de barras EAN-13 con dígitos de verificación. Generador gratuito.',
      },
      fr: {
        title: 'Générateur EAN-13 — Créez des codes-barres EAN-13',
        description: 'Créez des codes-barres EAN-13 avec chiffres de contrôle. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador EAN-13 — Crie códigos de barras EAN-13',
        description: 'Crie códigos de barras EAN-13 com dígitos de verificação. Gerador gratuito.',
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
