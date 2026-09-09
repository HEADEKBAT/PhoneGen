/**
 * ISBN Generator — Tool Manifest
 */

import { Book } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import ISBNGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is ISBN?', a: 'ISBN (International Standard Book Number) is a unique identifier for books. ISBN-13 (13 digits) is the current standard; ISBN-10 (10 digits) was used before 2007.' },
  { q: 'Can I use ISBN barcodes on my book?', a: 'ISBN numbers must be officially assigned by your country\'s ISBN agency. Generated barcodes are valid for testing and prototyping only.' },
  { q: 'How is the ISBN check digit calculated?', a: 'ISBN-13 uses the same weighted-sum algorithm as EAN-13. ISBN-10 uses a mod-11 algorithm with weights 10 through 1, producing check digits 0-9 or X.' },
];

export const isbnGenerator = defineTool({
  id: 'isbn-generator',
  product: 'barcode',
  name: 'ISBN Generator',
  ui: { component: ISBNGeneratorUI, icon: Book },
  seo: {
    meta: {
      en: { title: 'ISBN Generator — Create Book Barcodes (ISBN-13 & ISBN-10)', description: 'Generate ISBN-13 and ISBN-10 barcodes for books. Free online ISBN barcode generator with correct check digits and export.', keywords: ['ISBN generator', 'ISBN barcode', 'ISBN-13', 'ISBN-10', 'book barcode'] },
      ru: { title: 'Генератор ISBN — Создание штрихкодов для книг', description: 'Создавайте штрихкоды ISBN для книг. Бесплатный генератор.' },
      de: { title: 'ISBN Generator — Buch-Barcodes erstellen', description: 'Erstellen Sie ISBN Barcodes für Bücher. Kostenloser Generator.' },
      es: { title: 'Generador ISBN — Cree códigos de barras para libros', description: 'Cree códigos de barras ISBN para libros. Generador gratuito.' },
      fr: { title: 'Générateur ISBN — Créez des codes-barres pour livres', description: 'Créez des codes-barres ISBN pour livres. Générateur gratuit.' },
      pt: { title: 'Gerador ISBN — Crie códigos de barras para livros', description: 'Crie códigos de barras ISBN para livros. Gerador gratuito.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['svg', 'png'], share: false, favorites: false, bulk: true },
});
