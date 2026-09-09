/**
 * GTIN Generator — Tool Manifest
 */

import { Globe } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import GTINGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is GTIN?', a: 'GTIN (Global Trade Item Number) is the umbrella term for GS1 product identifiers. GTIN-12 includes UPC-A, GTIN-13 includes EAN-13, and GTIN-14 includes ITF-14.' },
  { q: 'What is the difference between GTIN and EAN?', a: 'GTIN is the modern GS1 term. EAN-13 is now called GTIN-13. They are the same barcode — the name changed, the numbers did not.' },
  { q: 'How is the check digit calculated?', a: 'Each digit is multiplied by alternating weights of 1 and 3, the products are summed, and the check digit rounds the total up to the next multiple of 10.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use.' },
];

export const gtinGenerator = defineTool({
  id: 'gtin-generator',
  product: 'barcode',
  name: 'GTIN Generator',
  ui: { component: GTINGeneratorUI, icon: Globe },
  seo: {
    meta: {
      en: { title: 'GTIN Generator — Create Global Trade Item Numbers', description: 'Generate GTIN-13 barcodes for supply chain product identification. Free online GTIN barcode generator with check digit.', keywords: ['GTIN generator', 'GTIN barcode', 'Global Trade Item Number', 'supply chain barcode'] },
      ru: { title: 'Генератор GTIN — Создание глобальных номеров товаров', description: 'Создавайте штрихкоды GTIN. Бесплатный генератор.' },
      de: { title: 'GTIN Generator — Globale Artikelnummern erstellen', description: 'Erstellen Sie GTIN Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador GTIN — Cree números globales de productos', description: 'Cree códigos de barras GTIN. Generador gratuito.' },
      fr: { title: 'Générateur GTIN — Créez des numéros d\'articles globaux', description: 'Créez des codes-barres GTIN. Générateur gratuit.' },
      pt: { title: 'Gerador GTIN — Crie números globais de produtos', description: 'Crie códigos de barras GTIN. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
