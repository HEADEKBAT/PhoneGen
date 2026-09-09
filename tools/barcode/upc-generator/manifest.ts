/**
 * UPC Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import UPCGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is the difference between UPC and EAN?', a: 'UPC-A is a 12-digit barcode used in the US and Canada. EAN-13 is a 13-digit barcode used everywhere else. Modern scanners can read both.' },
  { q: 'What do the UPC digits mean?', a: 'The first digit is the number system character, the next 5 identify the manufacturer, the following 5 identify the product, and the last digit is a check digit.' },
  { q: 'How is the check digit calculated?', a: 'Each digit is multiplied by alternating weights of 1 and 3, the products are summed, and the check digit rounds the total up to the next multiple of 10.' },
  { q: 'Can I print this barcode?', a: 'Yes. Export as SVG for unlimited resolution or PNG for quick use.' },
];

export const upcGenerator = defineTool({
  id: 'upc-generator',
  product: 'barcode',
  name: 'UPC Generator',
  ui: {
    component: UPCGeneratorUI,
    icon: Scan,
  },
  seo: {
    meta: {
      en: {
        title: 'UPC Generator — Create UPC-A & UPC-E Barcodes Online',
        description: 'Generate UPC-A and UPC-E barcodes for North American retail products. Free online UPC barcode generator with check digit and export.',
        keywords: ['UPC generator', 'UPC-A barcode', 'UPC-E barcode', 'retail barcode', 'North America'],
      },
      ru: {
        title: 'Генератор UPC — Создание штрихкодов UPC-A и UPC-E',
        description: 'Создавайте штрихкоды UPC-A и UPC-E. Бесплатный генератор.',
      },
      de: {
        title: 'UPC Generator — UPC-A & UPC-E Barcodes erstellen',
        description: 'Erstellen Sie UPC-A und UPC-E Barcodes. Kostenloser Generator.',
      },
      es: {
        title: 'Generador UPC — Cree códigos de barras UPC-A y UPC-E',
        description: 'Cree códigos de barras UPC-A y UPC-E. Generador gratuito.',
      },
      fr: {
        title: 'Générateur UPC — Créez des codes-barres UPC-A et UPC-E',
        description: 'Créez des codes-barres UPC-A et UPC-E. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador UPC — Crie códigos de barras UPC-A e UPC-E',
        description: 'Crie códigos de barras UPC-A e UPC-E. Gerador gratuito.',
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
