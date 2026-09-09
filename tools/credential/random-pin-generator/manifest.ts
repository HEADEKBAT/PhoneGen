/**
 * Random PIN Generator — Tool Manifest
 */

import { Scan } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import RandomPinGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a PIN?', a: 'A PIN (Personal Identification Number) is a numeric code used for authentication. PINs are commonly used for ATM cards, mobile devices, and door access systems.' },
  { q: 'How long should a PIN be?', a: 'For most purposes, a 6-digit PIN provides a good balance of security and usability. For high-security applications, use 8 digits.' },
  { q: 'Are PINs secure?', a: 'PINs provide limited security due to their small keyspace. Use them only where the system includes rate limiting or lockout after failed attempts.' },
];

export const randomPinGenerator = defineTool({
  id: 'random-pin-generator',
  product: 'credential',
  name: 'PIN Generator',
  ui: {
    component: RandomPinGeneratorUI,
    icon: Scan,
  },
  seo: {
    meta: {
      en: {
        title: 'Random PIN Generator — Create Secure Numeric Codes',
        description: 'Generate random numeric PIN codes with configurable length (4-8 digits). Free client-side PIN generator for ATM, mobile, and access codes.',
        keywords: ['pin generator', 'pin code', 'numeric password', 'atm pin', 'access code'],
      },
      ru: {
        title: 'Генератор PIN-кодов — Создайте безопасные числовые коды',
        description: 'Создавайте случайные PIN-коды. Бесплатный генератор.',
      },
      de: {
        title: 'PIN-Generator — Erstellen Sie sichere Zahlencodes',
        description: 'Erstellen Sie zufällige PIN-Codes. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de PIN — Cree códigos numéricos seguros',
        description: 'Cree códigos PIN aleatorios. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de PIN — Créez des codes numériques sécurisés',
        description: 'Créez des codes PIN aléatoires. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de PIN — Crie códigos numéricos seguros',
        description: 'Crie códigos PIN aleatórios. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'csv', 'txt'],
  },
});
