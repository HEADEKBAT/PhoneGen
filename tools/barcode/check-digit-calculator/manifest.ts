/**
 * Check Digit Calculator — Tool Manifest
 */

import { Calculator } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import CheckDigitCalculatorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a check digit?', a: 'A check digit is a calculated digit appended to a barcode to verify its accuracy during scanning. It is derived from the other digits using a specific algorithm.' },
  { q: 'How does the EAN/UPC check digit work?', a: 'The algorithm multiplies each digit by alternating weights of 1 and 3, sums the products, and calculates the number that rounds the total up to the nearest multiple of 10.' },
  { q: 'What is the ISBN-10 check digit?', a: 'ISBN-10 uses a modulo-11 algorithm with weights decreasing from 10 to 1. The check digit can be 0-9 or X (representing 10).' },
  { q: 'Can a check digit always detect errors?', a: 'Check digits catch single-digit errors and most transposition errors. No error-detection scheme catches all errors, but check digits reduce scanning errors significantly.' },
];

export const checkDigitCalculator = defineTool({
  id: 'check-digit-calculator',
  product: 'barcode',
  name: 'Check Digit Calculator',
  ui: { component: CheckDigitCalculatorUI, icon: Calculator },
  seo: {
    meta: {
      en: { title: 'Check Digit Calculator — Calculate Barcode Check Digits', description: 'Calculate check digits for EAN-13, UPC-A, EAN-8, GTIN, and ISBN barcodes. Free online check digit calculator with step-by-step explanation.', keywords: ['check digit calculator', 'barcode check digit', 'EAN check digit', 'UPC check digit', 'ISBN check digit'] },
      ru: { title: 'Калькулятор контрольных цифр — Расчёт для штрихкодов', description: 'Рассчитайте контрольные цифры для штрихкодов. Бесплатный калькулятор.' },
      de: { title: 'Prüfziffer-Rechner — Berechnung für Barcodes', description: 'Berechnen Sie Prüfziffern für Barcodes. Kostenloser Rechner.' },
      es: { title: 'Calculadora de dígitos de verificación — Para códigos de barras', description: 'Calcule dígitos de verificación. Calculadora gratuita.' },
      fr: { title: 'Calculateur de chiffres de contrôle — Pour codes-barres', description: 'Calculez les chiffres de contrôle. Calculateur gratuit.' },
      pt: { title: 'Calculadora de dígitos de verificação — Para códigos de barras', description: 'Calcule dígitos de verificação. Calculadora gratuita.' },
    },
    faqs,
  },
  capabilities: { history: false, export: ['csv', 'json'], share: false, favorites: false, bulk: false },
});
