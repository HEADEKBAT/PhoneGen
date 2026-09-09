/**
 * Credit Card Generator — Tool Manifest
 *
 * SEO-optimized tool page for credit card number generation.
 * Uses the PaymentStudioClientLoader with configured initial mode.
 */

import { CreditCard } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import CreditCardGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'Are these real credit card numbers?', a: 'No. All generated numbers are test numbers that pass Luhn validation but are not linked to any real accounts. They are safe for development and testing purposes.' },
  { q: 'Is this safe to use?', a: 'Yes. All generation happens entirely in your browser using the Web Crypto API. No data is ever sent to any server, and no credentials leave your device.' },
  { q: 'What is Luhn validation?', a: 'The Luhn algorithm (ISO/IEC 7812) is a checksum formula used by all major credit card networks to validate card numbers. All generated numbers pass this check.' },
  { q: 'Can I use these numbers in production?', a: 'No. These numbers are intended for development, testing, and QA purposes only. For production, use real card numbers issued by financial institutions.' },
  { q: 'How many card networks do you support?', a: 'Our generator supports 15+ card networks: Visa, Mastercard, American Express, Discover, JCB, Diners Club, UnionPay, Maestro, MIR, Elo, Hipercard, RuPay, Verve, Dankort, and UATP.' },
];

export const creditCardGenerator = defineTool({
  id: 'credit-card-generator',
  product: 'payment',
  name: 'Credit Card Generator',
  ui: {
    component: CreditCardGeneratorUI,
    icon: CreditCard,
  },
  seo: {
    meta: {
      en: {
        title: 'Credit Card Generator — Generate Test Card Numbers for 15+ Networks',
        description: 'Generate valid test credit card numbers for Visa, Mastercard, Amex, Discover, JCB, and 10+ payment networks. Free online credit card generator with Luhn validation, BIN lookup, and multiple export formats.',
        keywords: ['credit card generator', 'test card numbers', 'fake credit card', 'payment testing', 'card number generator', 'Luhn validation', 'BIN generator'],
      },
      ru: {
        title: 'Генератор кредитных карт — Создание тестовых номеров карт для 15+ сетей',
        description: 'Создавайте тестовые номера кредитных карт для Visa, Mastercard, Amex и других платежных систем. Бесплатный генератор с проверкой Луна.',
      },
      de: {
        title: 'Kreditkartengenerator — Testkartennummern für 15+ Netzwerke',
        description: 'Generieren Sie gültige Testkreditkartennummern. Kostenloser Generator mit Luhn-Prüfung.',
      },
      es: {
        title: 'Generador de tarjetas de crédito — Números de prueba para 15+ redes',
        description: 'Genere números de tarjetas de crédito de prueba válidos. Generador gratuito con validación Luhn.',
      },
      fr: {
        title: 'Générateur de cartes de crédit — Numéros de test pour 15+ réseaux',
        description: 'Générez des numéros de cartes de crédit de test valides. Générateur gratuit avec validation Luhn.',
      },
      pt: {
        title: 'Gerador de cartões de crédito — Números de teste para 15+ redes',
        description: 'Gere números de cartão de crédito de teste válidos. Gerador gratuito com validação Luhn.',
      },
    },
    faqs,
  },
  capabilities: {
    history: false,
    export: ['json', 'csv', 'txt'],
    share: false,
    favorites: false,
    bulk: true,
  },
  routes: {
    quick: {
      seo: {
        meta: {
          en: { title: 'Quick Card Generator — Generate Test Cards Instantly', description: 'Quick mode for generating single test credit card numbers instantly with one click.' },
        },
      },
    },
    advanced: {
      seo: {
        meta: {
          en: { title: 'Advanced Card Generator — Full Control Over Card Parameters', description: 'Generate test credit cards with full control over network, BIN, expiry, CVV, and cardholder details.' },
        },
      },
    },
    bin: {
      seo: {
        meta: {
          en: { title: 'BIN Card Generator — Generate Cards from BIN Numbers', description: 'Generate test credit card numbers from a specific BIN/IIN prefix. Perfect for testing specific issuing banks.' },
        },
      },
    },
    bulk: {
      seo: {
        meta: {
          en: { title: 'Bulk Card Generator — Generate 100s of Test Cards at Once', description: 'Generate up to 1000 test credit card numbers at once and export in TXT, CSV, JSON, SQL, XML, or YAML format.' },
        },
      },
    },
    developer: {
      seo: {
        meta: {
          en: { title: 'Developer Card Generator — Raw PAN, Regex & Validation Rules', description: 'Developer mode for raw PAN data, formatted numbers, masked numbers, regex patterns, and validation rules.' },
        },
      },
    },
    'negative-testing': {
      seo: {
        meta: {
          en: { title: 'Negative Testing Cards — Invalid, Expired & Edge-Case Cards', description: 'Generate credit cards with invalid checksums, wrong lengths, expired dates, and other edge cases for negative testing.' },
        },
      },
    },
  },
});
