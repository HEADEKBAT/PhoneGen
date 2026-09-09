/**
 * QR Studio — Core types.
 *
 * Defines all type enums and interfaces for the QR code engine.
 * Shared between engine, UI, and export modules — no React dependencies.
 */

/* ── Content types ───────────────────────────────────────────────────── */

export type QRContentType =
  | 'url' | 'text' | 'email' | 'phone' | 'sms'
  | 'whatsapp' | 'telegram' | 'discord' | 'skype' | 'facetime'
  | 'wifi' | 'vcard' | 'location' | 'google-maps' | 'calendar'
  | 'bitcoin' | 'ethereum' | 'litecoin' | 'monero'
  | 'paypal' | 'upi' | 'sepa'
  | 'app-store' | 'google-play'
  | 'zoom' | 'teams'
  | 'youtube' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'x' | 'github' | 'gitlab'
  | 'steam' | 'epic-games'
  | 'custom-uri';

/* ── Design options ──────────────────────────────────────────────────── */

export type ModuleStyle = 'square' | 'rounded' | 'dots' | 'circle' | 'diamond' | 'pixel' | 'hexagon' | 'minimal';
export type EyeStyle = 'classic' | 'rounded' | 'circle' | 'frame' | 'diamond' | 'modern';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type GradientType = 'linear' | 'radial' | 'conic';
export type BackgroundType = 'transparent' | 'solid' | 'gradient' | 'pattern' | 'glass';
export type ExportFormat = 'png' | 'svg' | 'pdf' | 'eps' | 'webp' | 'jpeg';

/* ── Form fields ─────────────────────────────────────────────────────── */

export type FormFieldType = 'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'textarea' | 'select' | 'switch' | 'color';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  options?: FormFieldOption[];
  description?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

/* ── Content type config ─────────────────────────────────────────────── */

export interface QRContentTypeConfig {
  id: QRContentType;
  label: string;
  icon: string;
  category: 'url' | 'text' | 'contact' | 'network' | 'location' | 'payment' | 'social' | 'app' | 'crypto' | 'custom';
  fields: FormField[];
  encode: (data: Record<string, string>) => string;
  validate: (data: Record<string, string>) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
}

/* ── QR generation options ──────────────────────────────────────────── */

export interface QRColorOptions {
  pattern: string;
  eye: string;
  background: string;
  gradient?: {
    type: GradientType;
    colors: string[];
    rotation?: number;
  };
}

export interface QRBackgroundOptions {
  type: BackgroundType;
  value: string;
}

export interface QROptions {
  content: string;
  moduleStyle: ModuleStyle;
  eyeStyle: EyeStyle;
  colors: QRColorOptions;
  background: QRBackgroundOptions;
  logo?: {
    dataUrl: string;
    size: number;
  } | null;
  quietZone: number;
  errorCorrection: ErrorCorrection;
}

/* ── QR generation result ──────────────────────────────────────────── */

export interface QRResult {
  /** Raw QR code data URL (SVG or PNG) */
  dataUrl: string;
  /** QR code version (1-40) */
  version: number;
  /** Error correction level used */
  errorCorrection: ErrorCorrection;
  /** Module count */
  moduleCount: number;
  /** Total size in pixels (based on moduleCount and moduleSize) */
  size: number;
  /** Encoding mode used */
  encoding: string;
  /** Whether the QR code is estimated to be readable */
  estimatedReadable: boolean;
  /** Contrast ratio (for accessibility) */
  contrastRatio?: number;
  /** Whether contrast passes WCAG AA */
  contrastPassAA?: boolean;
}

/* ── Scan test result ───────────────────────────────────────────────── */

export interface ScanTestResult {
  readable: boolean;
  errorCorrection: ErrorCorrection;
  version: number;
  encoding: string;
  size: number;
  estimatedScanQuality: 'excellent' | 'good' | 'fair' | 'poor';
  warnings: string[];
}

/* ── Export options ──────────────────────────────────────────────────── */

export interface ExportOptions {
  format: ExportFormat;
  size: number;
  margin: number;
  scale?: number;
}

/* ── Preset / template ──────────────────────────────────────────────── */

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  contentType: QRContentType;
  icon: string;
  defaultData: Record<string, string>;
  defaultOptions?: Partial<QROptions>;
}
