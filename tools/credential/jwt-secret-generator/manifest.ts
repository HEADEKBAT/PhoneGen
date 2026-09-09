/**
 * JWT Secret Generator — Tool Manifest
 */

import { ShieldCheck } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import JwtSecretGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a JWT Secret?', a: 'A JWT secret is a cryptographic key used to sign JSON Web Tokens (JWTs) via HMAC algorithms like HS256. It should be a high-entropy random string.' },
  { q: 'How long should a JWT secret be?', a: 'For HS256, use at least 32 bytes (256 bits) of random data. The generator produces 64 bytes by default, which exceeds security recommendations.' },
  { q: 'Can I use a passphrase as a JWT secret?', a: 'No. JWT secrets must be raw random bytes, not human-readable passphrases. Use a dedicated high-entropy random generator.' },
];

export const jwtSecretGenerator = defineTool({
  id: 'jwt-secret-generator',
  product: 'credential',
  name: 'JWT Secret Generator',
  ui: {
    component: JwtSecretGeneratorUI,
    icon: ShieldCheck,
  },
  seo: {
    meta: {
      en: {
        title: 'JWT Secret Generator — Create HMAC Signing Secrets',
        description: 'Generate cryptographically strong JWT secrets for HS256 and other HMAC algorithms. Free client-side JWT secret generator.',
        keywords: ['jwt secret', 'jwt generator', 'hmac secret', 'hs256', 'token signing'],
      },
      ru: {
        title: 'Генератор JWT секретов — Создайте HMAC ключи',
        description: 'Создавайте криптостойкие JWT секреты. Бесплатный генератор.',
      },
      de: {
        title: 'JWT-Secret-Generator — Erstellen Sie HMAC-Signierschlüssel',
        description: 'Erstellen Sie kryptografisch starke JWT-Geheimnisse. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de secretos JWT — Cree claves HMAC',
        description: 'Genere secretos JWT criptográficamente seguros. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de secret JWT — Créez des clés de signature HMAC',
        description: 'Générez des secrets JWT cryptographiquement forts. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de segredos JWT — Crie chaves de assinatura HMAC',
        description: 'Gere segredos JWT criptograficamente fortes. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
