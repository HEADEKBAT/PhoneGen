/**
 * QR Studio — Engine barrel exports.
 */

export type {
  QRContentType,
  ModuleStyle,
  EyeStyle,
  ErrorCorrection,
  GradientType,
  BackgroundType,
  ExportFormat,
  FormField,
  FormFieldOption,
  FormFieldType,
  QRContentTypeConfig,
  ValidationResult,
  QRColorOptions,
  QRBackgroundOptions,
  QROptions,
  QRResult,
  ScanTestResult,
  ExportOptions,
  QRTemplate,
} from './types';

export {
  QR_CONTENT_TYPES,
  getContentTypeConfig,
  getAllContentTypes,
  getContentTypesByCategory,
  CONTENT_TYPE_CATEGORIES,
} from './contentTypes';

export {
  generateQR,
  generateQRToDataURL,
  generateQRToCanvas,
  exportQRToFormat,
  exportQRToSVG,
  calculateSafeLogoSize,
  isLogoSafe,
} from './generator';

export {
  validateUrl,
  validateEmail,
  validatePhone,
  validateCoordinates,
  validateIBAN,
  validateBIC,
  validateUPI,
  validateBitcoinAddress,
  validateEthereumAddress,
  validateContentLength,
  validateContentType,
} from './validation';

export {
  exportQR,
  exportQRToBlob,
  getExportMimeType,
  getExportExtension,
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
  EXPORT_FORMAT_MIME,
  EXPORT_FORMAT_EXTENSIONS,
} from './exporters';

export {
  runScanTest,
  getErrorCorrectionDescription,
  getErrorCorrectionRecommendation,
} from './scanTest';

export {
  checkQRContrast,
  contrastRatio,
  relativeLuminance,
  isLightColor,
  recommendedTextColor,
} from './contrastCheck';
export type { ContrastResult } from './contrastCheck';

export { QR_PRESETS, getPreset, getAllPresets } from './presets';
