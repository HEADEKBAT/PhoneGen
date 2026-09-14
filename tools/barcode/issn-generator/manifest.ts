/**
 * ISSN Generator — Tool Manifest
 */

import { Newspaper } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import ISSNGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is ISSN used for?', a: 'ISSN (International Standard Serial Number) identifies magazines, journals, newspapers, and other serial publications worldwide.' },
  { q: 'How does an ISSN barcode work?', a: 'An ISSN barcode encodes the 8-digit ISSN plus a 2-digit issue number (add-on). The ISSN itself already includes a check digit.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use.' },
];

export const issnGenerator = defineTool({
  id: 'issn-generator',
  product: 'barcode',
  name: 'ISSN Generator',
  ui: { component: ISSNGeneratorUI, icon: Newspaper },
  seo: {
    meta: {
      en: { title: 'ISSN Generator', description: 'Generate ISSN barcodes for magazines, journals, and periodicals. Free online ISSN barcode generator with issue number add-on.', keywords: ['ISSN generator', 'ISSN barcode', 'serial publication', 'magazine barcode', 'journal barcode'] },
      ru: { title: 'Генератор ISSN', description: 'Создавайте штрихкоды ISSN для журналов. Бесплатный генератор.' },
      de: { title: 'ISSN Generator', description: 'Erstellen Sie ISSN Barcodes für Zeitschriften. Kostenloser Generator.' },
      es: { title: 'Generador ISSN', description: 'Cree códigos de barras ISSN. Generador gratuito.' },
      fr: { title: 'Générateur ISSN', description: 'Créez des codes-barres ISSN. Générateur gratuit.' },
      pt: { title: 'Gerador ISSN', description: 'Crie códigos de barras ISSN. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
