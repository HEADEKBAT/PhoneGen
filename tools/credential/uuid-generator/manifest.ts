/**
 * UUID Generator — Tool Manifest
 */

import { Hash } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import UuidGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit label used for unique identification in computer systems. UUID v4 is randomly generated.' },
  { q: 'Are UUIDs guaranteed to be unique?', a: 'While collisions are theoretically possible, the probability is extremely low (~1 in 2^122 for v4). They are safe for practical use in distributed systems.' },
  { q: 'What is UUID used for?', a: 'UUIDs are commonly used as database primary keys, API identifiers, session identifiers, and distributed system identifiers.' },
];

export const uuidGenerator = defineTool({
  id: 'uuid-generator',
  product: 'credential',
  name: 'UUID Generator',
  ui: {
    component: UuidGeneratorUI,
    icon: Hash,
  },
  seo: {
    meta: {
      en: {
        title: 'UUID Generator — Create Unique Identifiers Online',
        description: 'Generate UUID v4 identifiers. Free client-side UUID generator for database keys, API identifiers, and distributed systems.',
        keywords: ['uuid generator', 'uuid v4', 'guid', 'unique identifier', 'random id'],
      },
      ru: {
        title: 'Генератор UUID — Создайте уникальные идентификаторы',
        description: 'Создавайте UUID v4 идентификаторы. Бесплатный генератор.',
      },
      de: {
        title: 'UUID-Generator — Erstellen Sie eindeutige Identifikatoren',
        description: 'Erstellen Sie UUID v4 Identifikatoren. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de UUID — Cree identificadores únicos',
        description: 'Genere identificadores UUID v4. Generador gratuito.',
      },
      fr: {
        title: 'Générateur d\'UUID — Créez des identifiants uniques',
        description: 'Générez des identifiants UUID v4. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de UUID — Crie identificadores únicos',
        description: 'Gere identificadores UUID v4. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
