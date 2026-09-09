/**
 * QR Code Generator — Tool Manifest
 *
 * SEO-optimized tool page for QR code generation.
 * Uses the QRStudioLoader with configured initial options.
 */

import { QrCode } from 'lucide-react';
import { defineTool } from '@/core';
import type { ToolFAQ } from '@/core/types';
import QRCodeGeneratorUI from './ui';

const faqs: ToolFAQ[] = [
  { q: 'What is a QR code?', a: 'A QR code (Quick Response code) is a two-dimensional barcode that can be read by smartphones and QR scanners. It stores data like URLs, text, contact information, Wi-Fi credentials, and more.' },
  { q: 'Are these QR codes free to use?', a: 'Yes. All QR codes generated here are completely free to use, with no watermarks, no expiration, and no tracking. You can download and use them anywhere.' },
  { q: 'What data types do you support?', a: 'We support 37+ data types including URLs, text, email, phone, SMS, WhatsApp, Wi-Fi, vCard, location, calendar events, cryptocurrency addresses, social media profiles, and custom URIs.' },
  { q: 'Can I customize the QR code design?', a: 'Yes. You can change module style (square, rounded, dots, circle, diamond, pixel, hexagon, minimal), eye style, colors, gradient, background, and add a logo.' },
  { q: 'What is error correction?', a: 'Error correction allows QR codes to be read even when partially damaged or obscured. Levels range from L (~7% recovery) to H (~30% recovery). Higher levels mean denser codes but better reliability.' },
  { q: 'Can I add a logo to my QR code?', a: 'Yes. You can upload a logo image. The safe size is automatically calculated based on your error correction level to ensure the QR code remains scannable.' },
];

export const qrCodeGenerator = defineTool({
  id: 'qr-code-generator',
  product: 'qr',
  name: 'QR Code Generator',
  ui: {
    component: QRCodeGeneratorUI,
    icon: QrCode,
  },
  seo: {
    meta: {
      en: {
        title: 'QR Code Generator — Create Custom QR Codes Online Free',
        description: 'Generate custom QR codes for URLs, Wi-Fi, vCard, email, social media, and 37+ data types. Free online QR code generator with designer, logo upload, custom colors, and multiple export formats.',
        keywords: ['QR code generator', 'QR creator', 'free QR code', 'custom QR code', 'QR with logo', 'Wi-Fi QR code', 'vCard QR code', 'QR code designer'],
      },
      ru: {
        title: 'Генератор QR-кодов — Создание QR-кодов онлайн бесплатно',
        description: 'Создавайте QR-коды для URL, Wi-Fi, vCard, email, соцсетей и 37+ типов данных. Бесплатный генератор с дизайнером, загрузкой логотипа и экспортом.',
      },
      de: {
        title: 'QR-Code Generator — Kostenlos QR-Codes online erstellen',
        description: 'Erstellen Sie QR-Codes für URLs, WLAN, vCard, E-Mail, soziale Medien und 37+ Datentypen. Kostenloser Generator mit Designer, Logo-Upload und Export.',
      },
      es: {
        title: 'Generador de Códigos QR — Crea Códigos QR Gratis Online',
        description: 'Cree códigos QR para URL, Wi-Fi, vCard, email, redes sociales y más de 37 tipos de datos. Generador gratuito con diseñador, carga de logotipo y exportación.',
      },
      fr: {
        title: 'Générateur de QR Code — Créez des QR Codes Gratuits en Ligne',
        description: 'Créez des QR codes pour URL, Wi-Fi, vCard, email, réseaux sociaux et 37+ types de données. Générateur gratuit avec design, logo et export.',
      },
      pt: {
        title: 'Gerador de QR Code — Crie QR Codes Grátis Online',
        description: 'Gere QR codes para URL, Wi-Fi, vCard, email, redes sociais e mais de 37 tipos de dados. Gerador gratuito com designer, upload de logo e exportação.',
      },
    },
    faqs,
  },
  capabilities: {
    history: false,
    export: ['png', 'svg'],
    share: false,
    favorites: false,
    bulk: true,
  },
});
