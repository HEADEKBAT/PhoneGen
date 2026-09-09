/**
 * Passphrase Generator — Tool Manifest
 */

import { KeyRound } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import PassphraseGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a passphrase?', a: 'A passphrase is a sequence of random words (e.g., "correct-horse-battery-staple"). Passphrases are easier to remember than random character passwords while providing comparable or better security.' },
  { q: 'How many words should a passphrase have?', a: 'A 4-word passphrase from a 7776-word list provides ~51 bits of entropy. For high security, use 5-6 words (~65-78 bits).' },
  { q: 'Is a passphrase more secure than a password?', a: 'A well-chosen passphrase can be both more secure and more memorable than a traditional password. The key is using sufficient word count and random selection.' },
];

export const passphraseGenerator = defineTool({
  id: 'passphrase-generator',
  product: 'credential',
  name: 'Passphrase Generator',
  ui: {
    component: PassphraseGeneratorUI,
    icon: KeyRound,
  },
  seo: {
    meta: {
      en: {
        title: 'Passphrase Generator — Memorable XKCD-Style Passphrases',
        description: 'Generate memorable passphrases using random word lists. More secure than traditional passwords and easier to remember. Free passphrase generator.',
        keywords: ['passphrase generator', 'xkcd password', 'memorable password', 'diceware', 'word list password'],
      },
      ru: {
        title: 'Генератор кодовых фраз — Запоминающиеся фразы-пароли',
        description: 'Создавайте запоминающиеся кодовые фразы. Бесплатный генератор.',
      },
      de: {
        title: 'Passphrasen-Generator — Einprägsame XKCD-Phrasen',
        description: 'Erstellen Sie einprägsame Passphrasen. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de frases de contraseña — Frases memorables',
        description: 'Cree frases de contraseña memorables. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de phrases de passe — Phrases mémorables',
        description: 'Créez des phrases de passe mémorables. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de frases secretas — Frases memoráveis',
        description: 'Crie frases secretas memoráveis. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'csv', 'txt'],
    share: true,
    favorites: true,
    presets: ['passphrase'],
  },
});
