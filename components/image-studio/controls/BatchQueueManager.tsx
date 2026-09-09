'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Download, Trash2, Upload, X } from 'lucide-react';
import {
  useImageStudioStore,
  selectRenderSettings,
  selectExportMatte,
  type BatchEntry,
} from '@/lib/stores/imageStudio';
import { getBackgroundRemoverService } from '@/lib/image-studio/backgroundRemover';
import {
  prepareRenderSource,
  disposeRenderSource,
  renderComposite,
} from '@/lib/image-studio/compositor';
import { releaseCanvas } from '@/lib/image-studio/canvas';
import { encodeCanvas, baseName, formatBytes } from '@/lib/image-studio/exporter';
import { trackStudioEvent } from '@/lib/image-studio/analytics';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ProcessOptions } from '@/lib/image-studio/types';
import { cn } from '@/lib/utils';

type BatchStatus = 'idle' | 'processing' | 'done';

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function BatchQueueManager() {
  const { t } = useTranslations();
  // One source of truth: the queue lives in the store, so files dropped on the
  // main upload zone and files added here are the same list.
  const batchQueue = useImageStudioStore((s) => s.batchQueue);
  const addBatchFiles = useImageStudioStore((s) => s.addBatchFiles);
  const updateBatchEntry = useImageStudioStore((s) => s.updateBatchEntry);
  const removeBatchEntry = useImageStudioStore((s) => s.removeBatchEntry);
  const clearBatchQueue = useImageStudioStore((s) => s.clearBatchQueue);

  const [open, setOpen] = useState(true);
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('idle');
  const [zipping, setZipping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doneCount = batchQueue.filter((i) => i.status === 'done').length;
  const waitingCount = batchQueue.filter((i) => i.status === 'waiting').length;
  const isProcessing = batchStatus === 'processing';

  /* ── Cancel any in-flight run when the panel goes away ──────────────────── */
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /* ── Add files ──────────────────────────────────────────────────────────── */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        addBatchFiles(Array.from(e.target.files));
        e.target.value = '';
      }
    },
    [addBatchFiles],
  );

  /* ── Process one entry end to end ───────────────────────────────────────── */
  const processEntry = useCallback(
    async (entry: BatchEntry, signal: AbortSignal) => {
      const state = useImageStudioStore.getState();

      updateBatchEntry(entry.id, { status: 'processing', progress: 0, error: undefined });

      const options: ProcessOptions = {
        // Batch honours the same quality and tolerance as single-image mode,
        // instead of silently hardcoding "balanced".
        quality: state.processQuality,
        tolerance: state.tolerance,
        signal,
        onProgress: (percent) => updateBatchEntry(entry.id, { progress: percent }),
      };

      const result = await getBackgroundRemoverService().process(entry.file, options);

      // Same pipeline as single-image mode: background, edges, shadow and the
      // preset's output size all apply to every file in the queue.
      const source = await prepareRenderSource(entry.file, result.maskBlob);
      try {
        const composite = renderComposite(source, selectRenderSettings(state));
        try {
          const encoded = await encodeCanvas(composite.canvas, {
            format: state.exportFormat,
            quality: state.exportQuality,
            matte: selectExportMatte(state),
          });

          updateBatchEntry(entry.id, {
            status: 'done',
            progress: 100,
            resultUrl: URL.createObjectURL(encoded.blob),
            resultExtension: encoded.extension,
            bytes: encoded.bytes,
            processingTimeMs: result.processingTimeMs,
          });
        } finally {
          releaseCanvas(composite.canvas);
        }
      } finally {
        disposeRenderSource(source);
      }
    },
    [updateBatchEntry],
  );

  /* ── Process all ────────────────────────────────────────────────────────── */
  const handleProcessAll = useCallback(async () => {
    const pending = useImageStudioStore
      .getState()
      .batchQueue.filter((i) => i.status === 'waiting');
    if (pending.length === 0) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setBatchStatus('processing');

    const startedAt = performance.now();
    let completed = 0;

    for (const entry of pending) {
      if (controller.signal.aborted) break;

      try {
        await processEntry(entry, controller.signal);
        completed++;
      } catch (err) {
        if (controller.signal.aborted) {
          // Put the entry back so a cancelled run can simply be resumed.
          updateBatchEntry(entry.id, { status: 'waiting', progress: 0 });
          break;
        }
        updateBatchEntry(entry.id, {
          status: 'error',
          progress: 0,
          error: err instanceof Error ? err.message : t('imageStudio.batchFailed'),
        });
      }
    }

    abortRef.current = null;

    // Read fresh state — the loop above ran across many store updates.
    const finalQueue = useImageStudioStore.getState().batchQueue;
    setBatchStatus(
      finalQueue.length > 0 && finalQueue.every((i) => i.status === 'done' || i.status === 'error')
        ? 'done'
        : 'idle',
    );

    if (completed > 0) {
      trackStudioEvent({
        type: 'batch_processed',
        payload: { count: completed, totalTimeMs: performance.now() - startedAt },
      });
    }
  }, [processEntry, updateBatchEntry, t]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  /* ── Clear all ──────────────────────────────────────────────────────────── */
  const handleClearAll = useCallback(() => {
    abortRef.current?.abort();
    clearBatchQueue();
    setBatchStatus('idle');
  }, [clearBatchQueue]);

  /* ── Download all as ZIP ────────────────────────────────────────────────── */
  const handleDownloadAll = useCallback(async () => {
    const doneItems = useImageStudioStore
      .getState()
      .batchQueue.filter((i) => i.status === 'done' && i.resultUrl);
    if (doneItems.length === 0) return;

    setZipping(true);
    let zipUrl: string | null = null;
    try {
      // Dynamic import keeps jszip out of the initial chunk.
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const used = new Set<string>();

      for (const item of doneItems) {
        if (!item.resultUrl) continue;
        try {
          const blob = await fetch(item.resultUrl).then((r) => r.blob());

          // Two files called "photo.jpg" and "photo.png" collapse to one name
          // once re-encoded; disambiguate rather than silently dropping one.
          let name = `${baseName(item.name)}.${item.resultExtension ?? 'png'}`;
          let suffix = 1;
          while (used.has(name)) {
            name = `${baseName(item.name)}-${++suffix}.${item.resultExtension ?? 'png'}`;
          }
          used.add(name);

          zip.file(name, blob);
        } catch {
          /* Skip files that can no longer be read. */
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      zipUrl = URL.createObjectURL(zipBlob);

      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `background-removed-${doneItems.length}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setZipping(false);
      const url = zipUrl;
      // Revoking immediately cancels the download in Firefox.
      if (url) setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <h4 className="text-xs font-semibold text-foreground">
          {t('imageStudio.batchTitle')}
          {batchQueue.length > 0 && (
            <span className="ml-1.5 text-muted-foreground font-normal">
              ({batchQueue.length})
            </span>
          )}
        </h4>
        {open ? (
          <ChevronUp size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-medium rounded-lg border-2 border-dashed transition-colors',
              isProcessing
                ? 'border-border/30 text-muted-foreground cursor-not-allowed'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            <Upload size={14} />
            {t('imageStudio.batchUpload')}
          </button>

          <p className="text-[10px] text-muted-foreground text-center">
            {t('imageStudio.batchHint')}
          </p>

          {/* Action buttons */}
          {batchQueue.length > 0 && (
            <div className="flex gap-2">
              {isProcessing ? (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                >
                  {t('imageStudio.batchCancel')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleProcessAll}
                  disabled={waitingCount === 0}
                  className={cn(
                    'flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    waitingCount > 0
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed',
                  )}
                >
                  {t('imageStudio.batchProcessAll', { count: waitingCount })}
                </button>
              )}

              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={doneCount === 0 || isProcessing || zipping}
                className={cn(
                  'flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-1.5',
                  doneCount > 0 && !isProcessing && !zipping
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed',
                )}
              >
                <Download size={12} />
                {zipping
                  ? t('imageStudio.batchZipping')
                  : t('imageStudio.batchZip', { count: doneCount })}
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
              >
                <Trash2 size={12} />
                {t('imageStudio.batchClear')}
              </button>
            </div>
          )}

          {/* Item list */}
          {batchQueue.length > 0 && (
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {batchQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                >
                  {/* Thumbnail — a stable URL created once, not one per render */}
                  <div className="size-10 shrink-0 rounded overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl || item.previewUrl}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {item.status === 'waiting' && t('imageStudio.batchWaiting')}
                      {item.status === 'processing' && `${item.progress}%`}
                      {item.status === 'done' &&
                        [
                          item.processingTimeMs
                            ? `${(item.processingTimeMs / 1000).toFixed(1)}s`
                            : null,
                          item.bytes ? formatBytes(item.bytes) : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      {item.status === 'error' && (item.error || t('imageStudio.batchFailed'))}
                    </p>
                  </div>

                  {/* Progress bar (processing) */}
                  {item.status === 'processing' && (
                    <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Status indicator */}
                  {item.status === 'done' && (
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                      {t('imageStudio.batchDone')}
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-[10px] font-medium text-destructive">
                      {t('imageStudio.batchError')}
                    </span>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeBatchEntry(item.id)}
                    disabled={isProcessing}
                    aria-label={t('imageStudio.batchRemove', { name: item.name })}
                    className="shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {batchQueue.length === 0 && (
            <p className="text-[11px] text-muted-foreground text-center py-4">
              {t('imageStudio.batchEmpty')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
