/**
 * API Key Generator — Tool Manifest
 */

import { Lock } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import ApiKeyGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is an API Key?', a: 'An API key is a unique identifier used to authenticate API requests. They typically include a prefix (like sk_test_ for Stripe) to identify the key type.' },
  { q: 'How long should an API key be?', a: 'API keys should be at least 24 characters of random data. Most services use keys between 24-64 characters with a recognizable prefix.' },
  { q: 'Are generated API keys real?', a: 'No. All generated API keys are fake and formatted as realistic test keys. They are intended for development and testing purposes only.' },
];

export const apiKeyGenerator = defineTool({
  id: 'api-key-generator',
  product: 'credential',
  name: 'API Key Generator',
  ui: {
    component: ApiKeyGeneratorUI,
    icon: Lock,
  },
  seo: {
    meta: {
      en: {
        title: 'API Key Generator — Create Test API Keys',
        description: 'Generate realistic API keys for testing. Supports Stripe-style, GitHub-style prefixes, and more. Free client-side API key generator.',
        keywords: ['api key generator', 'api key', 'stripe key', 'test key', 'api authentication'],
      },
      ru: {
        title: 'Генератор API ключей — Создайте тестовые ключи',
        description: 'Создавайте реалистичные API ключи для тестирования. Бесплатный генератор.',
      },
      de: {
        title: 'API-Key-Generator — Erstellen Sie Test-API-Schlüssel',
        description: 'Erstellen Sie realistische API-Schlüssel für Tests. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de claves API — Cree claves de prueba',
        description: 'Genere claves API realistas para pruebas. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de clés API — Créez des clés de test',
        description: 'Générez des clés API réalistes pour les tests. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de chaves de API — Crie chaves de teste',
        description: 'Gere chaves de API realistas para teste. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'csv', 'txt'],
  },
});
