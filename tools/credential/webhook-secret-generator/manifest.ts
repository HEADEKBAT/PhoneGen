/**
 * Webhook Secret Generator — Tool Manifest
 */

import { Globe } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import WebhookSecretGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a Webhook Secret?', a: 'A webhook secret is a shared secret used to sign webhook payloads. It ensures that incoming webhooks are genuinely from the expected sender.' },
  { q: 'How is a webhook secret used?', a: 'The sender signs the webhook payload with the secret, and the receiver verifies the signature. This prevents tampering and forgery.' },
  { q: 'How long should a webhook secret be?', a: 'A webhook secret should be at least 32 bytes of random data. The whsec_ prefix identifies it as a webhook signing secret.' },
];

export const webhookSecretGenerator = defineTool({
  id: 'webhook-secret-generator',
  product: 'credential',
  name: 'Webhook Secret Generator',
  ui: {
    component: WebhookSecretGeneratorUI,
    icon: Globe,
  },
  seo: {
    meta: {
      en: {
        title: 'Webhook Secret Generator — Create Signing Secrets',
        description: 'Generate secure webhook signing secrets with whsec_ prefix. Free client-side webhook secret generator.',
        keywords: ['webhook secret', 'webhook signing', 'whsec', 'payload signature', 'webhook security'],
      },
      ru: {
        title: 'Генератор секретов вебхуков — Создайте подписанные секреты',
        description: 'Создавайте безопасные секреты вебхуков. Бесплатный генератор.',
      },
      de: {
        title: 'Webhook-Secret-Generator — Erstellen Sie Signiergeheimnisse',
        description: 'Erstellen Sie sichere Webhook-Geheimnisse. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de secretos de webhook — Cree secretos de firma',
        description: 'Genere secretos de webhook seguros. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de secret webhook — Créez des secrets de signature',
        description: 'Générez des secrets webhook sécurisés. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de segredos de webhook — Crie segredos de assinatura',
        description: 'Gere segredos de webhook seguros. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
