/**
 * Pharmacode Generator — Tool Manifest
 */

import { Pill } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import PharmacodeGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is Pharmacode used for?', a: 'Pharmacode is a pharmaceutical barcode standard used to identify medicine packaging. It encodes a numeric code (3-6 digits) and is read by high-speed production line scanners.' },
  { q: 'How does Pharmacode differ from other barcodes?', a: 'Pharmacode is a bi-directional barcode with no start/stop characters. It uses two different bar widths and can be scanned from either direction.' },
  { q: 'Is Pharmacode used in retail?', a: 'Pharmacode is primarily used in pharmaceutical manufacturing for production line control, not retail point-of-sale.' },
];

export const pharmacodeGenerator = defineTool({
  id: 'pharmacode-generator',
  product: 'barcode',
  name: 'Pharmacode Generator',
  ui: { component: PharmacodeGeneratorUI, icon: Pill },
  seo: {
    meta: {
      en: { title: 'Pharmacode Generator — Create Pharmaceutical Barcodes', description: 'Generate Pharmacode barcodes for medicine packaging. Free online Pharmacode generator for pharmaceutical production lines.', keywords: ['Pharmacode generator', 'pharmaceutical barcode', 'medicine barcode', 'production line barcode'] },
      ru: { title: 'Генератор Pharmacode — Создание фармацевтических штрихкодов', description: 'Создавайте штрихкоды Pharmacode. Бесплатный генератор.' },
      de: { title: 'Pharmacode Generator — Pharmazeutische Barcodes erstellen', description: 'Erstellen Sie Pharmacode Barcodes. Kostenloser Generator.' },
      es: { title: 'Generador Pharmacode — Cree códigos de barras farmacéuticos', description: 'Cree códigos de barras Pharmacode. Generador gratuito.' },
      fr: { title: 'Générateur Pharmacode — Codes-barres pharmaceutiques', description: 'Créez des codes-barres Pharmacode. Générateur gratuit.' },
      pt: { title: 'Gerador Pharmacode — Crie códigos de barras farmacêuticos', description: 'Crie códigos de barras Pharmacode. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
