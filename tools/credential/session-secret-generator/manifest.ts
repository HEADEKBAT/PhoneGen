/**
 * Session Secret Generator — Tool Manifest
 */

import { ShieldCheck } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import SessionSecretGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a Session Secret?', a: 'A session secret is used to sign and encrypt session cookies in web applications. It prevents tampering with session data.' },
  { q: 'How long should a session secret be?', a: '32 bytes (256 bits) is the recommended minimum. Session secrets should be raw random data encoded as Base64URL.' },
  { q: 'Can I rotate session secrets?', a: 'Yes. For production applications, rotate session secrets periodically and support multiple valid secrets during transition periods.' },
];

export const sessionSecretGenerator = defineTool({
  id: 'session-secret-generator',
  product: 'credential',
  name: 'Session Secret Generator',
  ui: {
    component: SessionSecretGeneratorUI,
    icon: ShieldCheck,
  },
  seo: {
    meta: {
      en: {
        title: 'Session Secret Generator — Secure Session Keys',
        description: 'Generate secure session signing secrets for web application cookies. Free client-side session secret generator.',
        keywords: ['session secret', 'session key', 'cookie secret', 'session signing', 'express session'],
      },
      ru: {
        title: 'Генератор секретов сессий — Безопасные ключи сессий',
        description: 'Создавайте безопасные секреты сессий. Бесплатный генератор.',
      },
      de: {
        title: 'Session-Secret-Generator — Sichere Sitzungsschlüssel',
        description: 'Erstellen Sie sichere Sitzungsgeheimnisse. Kostenloser Generator.',
      },
      es: {
        title: 'Generador de secretos de sesión — Claves de sesión seguras',
        description: 'Cree secretos de sesión seguros. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de secret de session — Clés de session sécurisées',
        description: 'Créez des secrets de session sécurisés. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de segredos de sessão — Chaves de sessão seguras',
        description: 'Crie segredos de sessão seguros. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'txt'],
  },
});
