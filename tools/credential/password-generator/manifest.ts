/**
 * Password Generator — Tool Manifest
 *
 * SEO-optimized landing page for password generation.
 * Uses the shared CredentialClientLoader with standalone mode.
 */

import { Key } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import PasswordGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'How secure are generated passwords?', a: 'All passwords are generated using crypto.getRandomValues(), the Web Crypto API\'s cryptographically secure pseudorandom number generator. This is the same standard used by browsers for security-sensitive operations.' },
  { q: 'Are passwords generated locally?', a: 'Yes. All generation happens entirely in your browser. No data is sent to any server, and no credentials ever leave your device.' },
  { q: 'What password length should I use?', a: 'For most purposes, 16 characters provides excellent security. For master passwords or admin accounts, use 20-32 characters.' },
];

export const passwordGenerator = defineTool({
  id: 'password-generator',
  product: 'credential',
  name: 'Password Generator',
  ui: {
    component: PasswordGeneratorUI,
    icon: Key,
  },
  seo: {
    meta: {
      en: {
        title: 'Password Generator — Create Strong Random Passwords',
        description: 'Generate strong, secure random passwords with configurable length, character types, and complexity. Free client-side password generator.',
        keywords: ['password generator', 'strong password', 'random password', 'secure password', 'password creator'],
      },
      ru: {
        title: 'Генератор паролей — Создайте надежные случайные пароли',
        description: 'Создавайте надежные случайные пароли с настраиваемой длиной и сложностью. Бесплатный генератор паролей.',
      },
      de: {
        title: 'Passwort-Generator — Erstellen Sie starke Zufallspasswörter',
        description: 'Erstellen Sie starke, sichere Zufallspasswörter. Kostenloser Passwort-Generator.',
      },
      es: {
        title: 'Generador de contraseñas — Cree contraseñas seguras',
        description: 'Cree contraseñas seguras con longitud y tipos de caracteres configurables. Generador gratuito.',
      },
      fr: {
        title: 'Générateur de mots de passe — Créez des mots de passe forts',
        description: 'Créez des mots de passe forts et sécurisés. Générateur gratuit.',
      },
      pt: {
        title: 'Gerador de senhas — Crie senhas fortes e aleatórias',
        description: 'Crie senhas fortes e seguras. Gerador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: true,
    export: ['json', 'csv', 'txt'],
    share: true,
    favorites: true,
    presets: ['secure', 'pin', 'memorable'],
  },
});
