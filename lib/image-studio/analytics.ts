/**
 * Image Studio — Analytics Service
 *
 * Wraps @vercel/analytics track() for Image Studio-specific events.
 * Gracefully handles cases where analytics is not initialized.
 */

import { track } from '@vercel/analytics/react';
import type { ControlMode } from '@/lib/stores/imageStudio';
import type { ImageExportFormat, ProcessQuality } from '@/lib/image-studio/types';

/* ── Event Types ───────────────────────────────────────────────────────────── */

/* ── Event Types ───────────────────────────────────────────────────────────── */

export interface ImageUploadedPayload {
  fileSize: number;
  fileType: string;
  mode: ControlMode;
}

export interface ProcessingStartedPayload {
  mode: ControlMode;
  quality: ProcessQuality;
}

export interface ProcessingCompletedPayload {
  processingTimeMs: number;
  mode: ControlMode;
}

export interface ProcessingFailedPayload {
  error: string;
  mode: ControlMode;
}

export interface ImageExportedPayload {
  format: ImageExportFormat;
  quality: number;
  mode: ControlMode;
}

export interface ModeChangedPayload {
  from: ControlMode;
  to: ControlMode;
}

export interface BatchProcessedPayload {
  count: number;
  totalTimeMs: number;
}

export interface PresetAppliedPayload {
  presetId: string;
  type: 'product' | 'social';
}

export type ImageStudioEvent =
  | { type: 'image_uploaded'; payload: ImageUploadedPayload }
  | { type: 'processing_started'; payload: ProcessingStartedPayload }
  | { type: 'processing_completed'; payload: ProcessingCompletedPayload }
  | { type: 'processing_failed'; payload: ProcessingFailedPayload }
  | { type: 'image_exported'; payload: ImageExportedPayload }
  | { type: 'mode_changed'; payload: ModeChangedPayload }
  | { type: 'batch_processed'; payload: BatchProcessedPayload }
  | { type: 'preset_applied'; payload: PresetAppliedPayload };

/* ── Event name map ────────────────────────────────────────────────────────── */

const EVENT_NAMES: Record<ImageStudioEvent['type'], string> = {
  image_uploaded: 'is_image_uploaded',
  processing_started: 'is_processing_started',
  processing_completed: 'is_processing_completed',
  processing_failed: 'is_processing_failed',
  image_exported: 'is_image_exported',
  mode_changed: 'is_mode_changed',
  batch_processed: 'is_batch_processed',
  preset_applied: 'is_preset_applied',
};

/* ── Track ─────────────────────────────────────────────────────────────────── */

/**
 * Track an Image Studio event.
 * Swallows errors silently — analytics should never break the user experience.
 */
export function trackStudioEvent(event: ImageStudioEvent): void {
  try {
    const eventName = EVENT_NAMES[event.type];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    track(eventName, event.payload as any);
  } catch {
    // Analytics is optional — fail silently
  }
}
