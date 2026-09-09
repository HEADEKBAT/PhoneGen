/**
 * Image Studio — Platform Presets
 *
 * Single source of truth for Product Mode and Social Mode presets.
 * Pure data — no UI imports.
 */

import type { ProductPreset, SocialPreset } from './types';

/* ── Product Mode Presets (e-commerce platforms) ──────────────────────────── */

export const PRODUCT_PRESETS: ProductPreset[] = [
  {
    id: 'amazon',
    label: 'Amazon',
    platform: 'amazon',
    background: { type: 'white', color: '#ffffff' },
    size: { width: 1000, height: 1000 },
    padding: 20,
    format: 'png',
    quality: 90,
  },
  {
    id: 'shopify',
    label: 'Shopify',
    platform: 'shopify',
    background: { type: 'white', color: '#ffffff' },
    size: { width: 2048, height: 2048 },
    padding: 0,
    format: 'jpeg',
    quality: 85,
  },
  {
    id: 'etsy',
    label: 'Etsy',
    platform: 'etsy',
    background: { type: 'white', color: '#ffffff' },
    size: { width: 2000, height: 2000 },
    padding: 30,
    format: 'png',
    quality: 90,
  },
  {
    id: 'wildberries',
    label: 'Wildberries',
    platform: 'wildberries',
    background: { type: 'transparent' },
    size: { width: 1200, height: 1200 },
    padding: 0,
    format: 'png',
    quality: 100,
  },
  {
    id: 'ozon',
    label: 'Ozon',
    platform: 'ozon',
    background: { type: 'white', color: '#ffffff' },
    size: { width: 1500, height: 1500 },
    padding: 10,
    format: 'jpeg',
    quality: 80,
  },
  {
    id: 'ebay',
    label: 'eBay',
    platform: 'ebay',
    background: { type: 'white', color: '#ffffff' },
    size: { width: 1600, height: 1600 },
    padding: 15,
    format: 'png',
    quality: 90,
  },
];

/* ── Social Mode Presets ──────────────────────────────────────────────────── */

export const SOCIAL_PRESETS: SocialPreset[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    platform: 'instagram',
    size: { width: 1080, height: 1080 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    platform: 'facebook',
    size: { width: 1200, height: 630 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    platform: 'tiktok',
    size: { width: 1080, height: 1920 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    platform: 'youtube',
    size: { width: 1280, height: 720 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    platform: 'linkedin',
    size: { width: 1200, height: 627 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    platform: 'telegram',
    size: { width: 512, height: 512 },
    background: { type: 'transparent' },
    format: 'png',
  },
  {
    id: 'x',
    label: 'X',
    platform: 'x',
    size: { width: 1200, height: 675 },
    background: { type: 'transparent' },
    format: 'png',
  },
];
