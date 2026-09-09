/**
 * Password Strength Checker — Tool Manifest
 */

import { Gauge } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import PasswordStrengthCheckerUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is password strength?', a: 'Password strength measures how resistant a password is to guessing and brute-force attacks. It depends on length, character variety, and randomness.' },
  { q: 'What is password entropy?', a: 'Entropy measures unpredictability in bits. Each bit doubles the required guesses. 80+ bits is considered very strong for offline attacks.' },
  { q: 'How is crack time estimated?', a: 'Crack time is estimated based on the password\'s entropy and assumed attacker capabilities (offline: billions of guesses/sec, online: ~1000 guesses/sec).' },
  { q: 'What makes a password weak?', a: 'Short length, common patterns, dictionary words, personal information, and character repetition all reduce password strength significantly.' },
];

export const passwordStrengthChecker = defineTool({
  id: 'password-strength-checker',
  product: 'credential',
  name: 'Password Strength Checker',
  ui: {
    component: PasswordStrengthCheckerUI,
    icon: Gauge,
  },
  seo: {
    meta: {
      en: {
        title: 'Password Strength Checker — Analyze Password Security',
        description: 'Check password strength, calculate entropy, estimate crack time. Free client-side password analyzer.',
        keywords: ['password strength', 'password checker', 'entropy calculator', 'crack time', 'password security'],
      },
      ru: {
        title: 'Проверка надежности пароля — Анализ безопасности',
        description: 'Проверьте надежность пароля. Бесплатный анализатор.',
      },
      de: {
        title: 'Passwort-Stärke-Prüfung — Sicherheitsanalyse',
        description: 'Überprüfen Sie die Passwortstärke. Kostenloser Analysator.',
      },
      es: {
        title: 'Comprobador de seguridad de contraseñas — Análisis de seguridad',
        description: 'Compruebe la seguridad de las contraseñas. Analizador gratuito.',
      },
      fr: {
        title: 'Vérificateur de sécurité de mot de passe — Analyse de sécurité',
        description: 'Vérifiez la sécurité des mots de passe. Analyseur gratuit.',
      },
      pt: {
        title: 'Verificador de segurança de senhas — Análise de segurança',
        description: 'Verifique a segurança das senhas. Analisador gratuito.',
      },
    },
    faqs,
  },
  capabilities: {
    history: false,
    export: ['txt'],
  },
});
