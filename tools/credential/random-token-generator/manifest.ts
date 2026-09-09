/**
 * Random Token Generator — Tool Manifest
 */

import { Shuffle } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import RandomTokenGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a random token?', a: 'A random token is a cryptographically random string used for authentication, authorization, or as a one-time code. Tokens can be hex, base64, or base64url encoded.' },
  { q: 'What token format should I use?', a: 'Use hex for compact string representation, base64 for shorter tokens (more bits per character), and base64url for tokens that appear in URLs.' },
  { q: 'How long should a token be?', a: 'For security tokens, use at least 32 hex characters (128 bits). For API tokens, 32-64 characters provides strong security.' },
];

export const randomTokenGenerator = defineTool({
  id: 'random-token-generator',
  product: 'credential',
  name: 'Random Token Generator',
  ui: {
    component: RandomTokenGeneratorUI,
    icon: Shuffle,
  },
  seo: {
    meta: {
      en: {
        title: 'Random Token Generator — Create Auth Tokens & One-Time Codes',
        description: 'Generate cryptographically random tokens in hex, base64, and base64url formats. Free client-side token generator.',
        keywords: ['random token', 'token generator', 'auth token', 'one-time code', 'bearer token'],
      },
      ru: {
        title: 'Генератор случайных токенов — Создайте токены авторизации',
        description: 'Создавайте криптостойкие токены. Бесплатный генератор.',
      },
      de: {
        title: 'Token-Generator — Erstellen Sie Authentifizierungs-Tokens',
        description: 'Erstellen Sie kryptografisch zufällige Tokens. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de tokens aleatorios — Cree tokens de autenticación',
        description: 'Genere tokens criptográficamente aleatorios. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de jetons aléatoires — Créez des jetons d\'auth',
        description: 'Générez des jetons cryptographiquement aléatoires. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de tokens aleatórios — Crie tokens de autenticação',
        description: 'Gere tokens criptograficamente aleatórios. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
