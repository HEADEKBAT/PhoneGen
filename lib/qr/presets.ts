/**
 * QR Studio — Preset templates library.
 *
 * Ready-to-use QR code templates for common use cases.
 * Each template has default data, suggested design options, and a description.
 */

import type { QRTemplate } from './types';

export const QR_PRESETS: QRTemplate[] = [
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Link to your digital restaurant menu',
    contentType: 'url',
    icon: 'Utensils',
    defaultData: { url: 'https://example.com/menu', title: 'View Our Menu', description: 'Browse our selection' },
    defaultOptions: { moduleStyle: 'rounded', eyeStyle: 'rounded', quietZone: 2, errorCorrection: 'Q' },
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Share your contact information',
    contentType: 'vcard',
    icon: 'Contact',
    defaultData: { firstName: 'John', lastName: 'Doe', company: 'Acme Inc', phone: '+1234567890', email: 'john@acme.com' },
    defaultOptions: { moduleStyle: 'square', eyeStyle: 'classic', quietZone: 2, errorCorrection: 'M' },
  },
  {
    id: 'wifi-login',
    name: 'Wi-Fi Login',
    description: 'Quick Wi-Fi access without typing passwords',
    contentType: 'wifi',
    icon: 'Wifi',
    defaultData: { ssid: 'Guest Wi-Fi', password: '', encryption: 'WPA', hidden: 'false' },
    defaultOptions: { moduleStyle: 'dots', eyeStyle: 'circle', quietZone: 2, errorCorrection: 'Q' },
  },
  {
    id: 'event',
    name: 'Calendar Event',
    description: 'Add event to calendar',
    contentType: 'calendar',
    icon: 'Calendar',
    defaultData: { title: 'Meeting', description: 'Team sync', start: '20260101T090000', end: '20260101T100000' },
    defaultOptions: { moduleStyle: 'rounded', eyeStyle: 'classic', quietZone: 2, errorCorrection: 'M' },
  },
  {
    id: 'payment',
    name: 'Payment / Tip',
    description: 'Receive payments via PayPal or UPI',
    contentType: 'paypal',
    icon: 'CreditCard',
    defaultData: { paypalId: 'merchant@example.com', amount: '10.00', currency: 'USD' },
    defaultOptions: { moduleStyle: 'square', eyeStyle: 'classic', quietZone: 2, errorCorrection: 'Q' },
  },
  {
    id: 'social-profile',
    name: 'Social Profile',
    description: 'Link to your social media profile',
    contentType: 'instagram',
    icon: 'Camera',
    defaultData: { username: 'username' },
    defaultOptions: { moduleStyle: 'rounded', eyeStyle: 'rounded', quietZone: 2, errorCorrection: 'M' },
  },
  {
    id: 'product-link',
    name: 'Product Page',
    description: 'Link to a product or store page',
    contentType: 'url',
    icon: 'ShoppingBag',
    defaultData: { url: 'https://example.com/product', title: 'Product Name', description: 'Check out this product' },
    defaultOptions: { moduleStyle: 'square', eyeStyle: 'frame', quietZone: 2, errorCorrection: 'Q' },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Link to your portfolio or website',
    contentType: 'url',
    icon: 'Briefcase',
    defaultData: { url: 'https://example.com/portfolio', title: 'My Portfolio', description: 'View my work' },
    defaultOptions: { moduleStyle: 'diamond', eyeStyle: 'modern', quietZone: 2, errorCorrection: 'M' },
  },
  {
    id: 'resume',
    name: 'Digital Resume',
    description: 'Link to your online resume or LinkedIn',
    contentType: 'linkedin',
    icon: 'FileText',
    defaultData: { profile: 'https://linkedin.com/in/username' },
    defaultOptions: { moduleStyle: 'square', eyeStyle: 'classic', quietZone: 2, errorCorrection: 'M' },
  },
  {
    id: 'app-download',
    name: 'App Download',
    description: 'Link to your app on App Store or Google Play',
    contentType: 'app-store',
    icon: 'Smartphone',
    defaultData: { appId: 'com.example.app', country: 'us' },
    defaultOptions: { moduleStyle: 'rounded', eyeStyle: 'rounded', quietZone: 2, errorCorrection: 'Q' },
  },
];

export function getPreset(id: string): QRTemplate | undefined {
  return QR_PRESETS.find((p) => p.id === id);
}

export function getAllPresets(): QRTemplate[] {
  return QR_PRESETS;
}
