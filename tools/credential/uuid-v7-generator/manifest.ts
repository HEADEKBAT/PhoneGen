/**
 * UUID v7 Generator — Tool Manifest
 */

import { Clock } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import UuidV7GeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is UUID v7?', a: 'UUID v7 is a time-ordered UUID format (RFC 9562) that encodes a Unix timestamp in the first 48 bits, making UUIDs sortable by creation time.' },
  { q: 'UUID v4 vs v7 — which to use?', a: 'Use UUID v7 when you need time-ordered sorting (e.g., database indexes). Use UUID v4 when you need purely random identifiers with no time information.' },
  { q: 'Is UUID v7 a standard?', a: 'Yes, UUID v7 is defined in RFC 9562 (2024). It is the recommended UUID version for new applications due to its time-sorting capability.' },
];

export const uuidV7Generator = defineTool({
  id: 'uuid-v7-generator',
  product: 'credential',
  name: 'UUID v7 Generator',
  ui: {
    component: UuidV7GeneratorUI,
    icon: Clock,
  },
  seo: {
    meta: {
      en: {
        title: 'UUID v7 Generator — Time-Ordered UUIDs (RFC 9562)',
        description: 'Generate time-ordered UUID v7 identifiers per RFC 9562. Sortable by creation time. Free client-side UUID v7 generator.',
        keywords: ['uuid v7', 'uuid v7 generator', 'time-ordered uuid', 'rfc 9562', 'sortable uuid'],
      },
      ru: {
        title: 'Генератор UUID v7 — Упорядоченные по времени UUID',
        description: 'Создавайте UUID v7 идентификаторы. Бесплатный генератор.',
      },
      de: {
        title: 'UUID-v7-Generator — Zeitgeordnete UUIDs (RFC 9562)',
        description: 'Erstellen Sie zeitgeordnete UUID-v7-Identifikatoren. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de UUID v7 — UUID ordenados por tiempo',
        description: 'Genere identificadores UUID v7 ordenados por tiempo. Generador gratuito.',
      },
      fr: {
        title: 'Générateur d\'UUID v7 — UUID ordonnés dans le temps',
        description: 'Générez des identifiants UUID v7 ordonnés dans le temps. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de UUID v7 — UUIDs ordenados por tempo',
        description: 'Gere identificadores UUID v7 ordenados por tempo. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
