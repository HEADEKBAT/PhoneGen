'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useImageStudioStore, selectRenderSettings, selectExportMatte } from '@/lib/stores/imageStudio';
import type { ControlMode } from '@/lib/stores/imageStudio';
import { getBackgroundRemoverService } from '@/lib/image-studio/backgroundRemover';
import type { ProcessOptions, BackgroundOption, ImageExportFormat } from '@/lib/image-studio/types';
import {
  prepareRenderSource,
  disposeRenderSource,
  renderComposite,
  maskFromCutout,
  replaceMask,
  type RenderSource,
} from '@/lib/image-studio/compositor';
import { canvasToBlob, decodeImage, closeImage, releaseCanvas } from '@/lib/image-studio/canvas';
import { encodeCanvas, baseName, type EncodeResult } from '@/lib/image-studio/exporter';
import { ImageUploadZone } from '@/components/image-studio/shared/ImageUploadZone';
import { BeforeAfterSlider } from '@/components/image-studio/shared/BeforeAfterSlider';
import { ExportPanel } from '@/components/image-studio/shared/ExportPanel';
import EdgeRefinementControls from '@/components/image-studio/controls/EdgeRefinementControls';
import ShadowControls from '@/components/image-studio/controls/ShadowControls';
import ProductPresetsGrid from '@/components/image-studio/controls/ProductPresetsGrid';
import SocialPresetsGrid from '@/components/image-studio/controls/SocialPresetsGrid';
import BatchQueueManager from '@/components/image-studio/controls/BatchQueueManager';
import LivePreviewContexts from '@/components/image-studio/shared/LivePreviewContexts';
import WorkflowCTA from '@/components/image-studio/controls/WorkflowCTA';
import QualityControls from '@/components/image-studio/controls/QualityControls';
import { trackStudioEvent } from '@/lib/image-studio/analytics';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { cn } from '@/lib/utils';

/** Settings changes are coalesced for this long before re-rendering. */
const RENDER_DEBOUNCE_MS = 160;

/* ─── Processing Animation ───────────────────────────────────────────────── */

function ProcessingAnimation() {
  const { t } = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative size-16">
        <div className="absolute inset-0 size-full animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-0 size-full animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-3 rounded-full bg-primary" />
        </div>
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium text-foreground">
          {t('imageStudio.processingTitle')}
        </p>
        <p className="text-xs text-muted-foreground">
          {t('imageStudio.processingSubtitle')}
        </p>
      </div>
    </div>
  );
}

/* ─── Background Options Row ─────────────────────────────────────────────── */

const BACKGROUND_PRESETS: { labelKey: string; option: BackgroundOption }[] = [
  { labelKey: 'imageStudio.backgroundTransparent', option: { type: 'transparent' } },
  { labelKey: 'imageStudio.backgroundWhite', option: { type: 'white', color: '#ffffff' } },
  { labelKey: 'imageStudio.backgroundBlack', option: { type: 'black', color: '#000000' } },
  { labelKey: 'imageStudio.backgroundCustom', option: { type: 'custom', color: '#6366f1' } },
];

function BackgroundOptionsRow() {
  const { t } = useTranslations();
  const { background, setBackground } = useImageStudioStore();

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">{t('imageStudio.backgroundLabel')}</p>
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.labelKey}
            type="button"
            onClick={() => setBackground(preset.option)}
            className={cn(
              'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
              background.type === preset.option.type
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(preset.labelKey)}
          </button>
        ))}
      </div>

      {/* Colour picker, only where a colour is actually used */}
      {background.type === 'custom' && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="color"
            aria-label={t('imageStudio.backgroundColorAria')}
            value={background.color ?? '#6366f1'}
            onChange={(e) => setBackground({ type: 'custom', color: e.target.value })}
            className="size-7 shrink-0 cursor-pointer rounded border border-border bg-transparent p-0.5"
          />
          <span className="text-[11px] text-muted-foreground tabular-nums uppercase">
            {background.color ?? '#6366f1'}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Mode Selector Row ──────────────────────────────────────────────────── */

const CONTROL_MODES: { mode: ControlMode; labelKey: string }[] = [
  { mode: 'standard', labelKey: 'imageStudio.modeStandard' },
  { mode: 'product', labelKey: 'imageStudio.modeProduct' },
  { mode: 'social', labelKey: 'imageStudio.modeSocial' },
  { mode: 'batch', labelKey: 'imageStudio.modeBatch' },
];

function ModeSelectorRow({ onModeChange }: { onModeChange?: (mode: ControlMode) => void }) {
  const { t } = useTranslations();
  const { controlMode, setControlMode } = useImageStudioStore();

  const handleClick = (mode: ControlMode) => {
    if (mode !== controlMode) {
      onModeChange?.(mode);
      setControlMode(mode);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">{t('imageStudio.modeLabel')}</p>
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border">
        {CONTROL_MODES.map((item) => (
          <button
            key={item.mode}
            type="button"
            onClick={() => handleClick(item.mode)}
            className={cn(
              'flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all',
              controlMode === item.mode
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function BackgroundRemoverTab() {
  const { t } = useTranslations();
  const currentImage = useImageStudioStore((s) => s.currentImage);
  const processingState = useImageStudioStore((s) => s.processingState);
  const controlMode = useImageStudioStore((s) => s.controlMode);
  const setCurrentImage = useImageStudioStore((s) => s.setCurrentImage);
  const setProcessingState = useImageStudioStore((s) => s.setProcessingState);
  const addBatchFiles = useImageStudioStore((s) => s.addBatchFiles);

  // Render-affecting settings: any change re-runs the compositor, not the
  // segmentation, so dragging a slider costs one GPU pass.
  const background = useImageStudioStore((s) => s.background);
  const edgeRefinement = useImageStudioStore((s) => s.edgeRefinement);
  const shadow = useImageStudioStore((s) => s.shadow);
  const selectedProductPreset = useImageStudioStore((s) => s.selectedProductPreset);
  const selectedSocialPreset = useImageStudioStore((s) => s.selectedSocialPreset);

  /* ── Scroll targets for WorkflowCTA ─────────────────────────────────── */
  const backgroundSectionRef = useRef<HTMLDivElement>(null);
  const settingsSectionRef = useRef<HTMLDivElement>(null);
  const presetSectionRef = useRef<HTMLDivElement>(null);
  const exportSectionRef = useRef<HTMLDivElement>(null);

  /* ── Render pipeline state ──────────────────────────────────────────── */
  const sourceRef = useRef<RenderSource | null>(null);
  const composedUrlRef = useRef<string | null>(null);
  const renderSeqRef = useRef(0);
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [hasExported, setHasExported] = useState(false);

  /* ── Composite rendering ────────────────────────────────────────────── */
  const renderPreview = useCallback(async () => {
    const source = sourceRef.current;
    if (!source) return;

    const seq = ++renderSeqRef.current;
    setIsRendering(true);
    setRenderError(null);

    try {
      const settings = selectRenderSettings(useImageStudioStore.getState());
      const composite = renderComposite(source, settings);

      let blob: Blob;
      try {
        blob = await canvasToBlob(composite.canvas, 'image/png');
      } finally {
        releaseCanvas(composite.canvas);
      }

      // A newer render started while this one was encoding — drop this result.
      if (seq !== renderSeqRef.current) return;

      const url = URL.createObjectURL(blob);
      if (composedUrlRef.current) URL.revokeObjectURL(composedUrlRef.current);
      composedUrlRef.current = url;
      setComposedUrl(url);
    } catch (err) {
      if (seq === renderSeqRef.current) {
        setRenderError(err instanceof Error ? err.message : t('imageStudio.previewFailed'));
      }
    } finally {
      if (seq === renderSeqRef.current) setIsRendering(false);
    }
  }, [t]);

  /* ── Re-render whenever a setting changes ───────────────────────────── */
  useEffect(() => {
    if (!sourceRef.current) return;
    const timer = setTimeout(renderPreview, RENDER_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [
    background,
    edgeRefinement,
    shadow,
    selectedProductPreset,
    selectedSocialPreset,
    controlMode,
    renderPreview,
  ]);

  /* ── Release everything on unmount ──────────────────────────────────── */
  useEffect(() => {
    return () => {
      disposeRenderSource(sourceRef.current);
      sourceRef.current = null;
      if (composedUrlRef.current) URL.revokeObjectURL(composedUrlRef.current);
      composedUrlRef.current = null;
    };
  }, []);

  /* ── Scroll-to-section handler (for WorkflowCTA) ────────────────────── */
  const handleScrollToSection = useCallback((sectionKey: string) => {
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      background: backgroundSectionRef,
      settings: settingsSectionRef,
      preset: presetSectionRef,
      export: exportSectionRef,
    };
    refMap[sectionKey]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  /* ── Core processing ────────────────────────────────────────────────── */
  const processImage = useCallback(
    async (image: { id: string; name: string; originalUrl: string }) => {
      const store = useImageStudioStore.getState();
      const quality = store.processQuality;
      const tolerance = store.tolerance;

      setProcessingState({ status: 'processing', progress: 0, error: undefined });
      setHasExported(false);

      trackStudioEvent({
        type: 'processing_started',
        payload: { mode: store.controlMode, quality },
      });

      try {
        const response = await fetch(image.originalUrl);
        const blob = await response.blob();

        const options: ProcessOptions = {
          quality,
          tolerance,
          onProgress: (percent) => setProcessingState({ progress: percent }),
        };

        const result = await getBackgroundRemoverService().process(blob, options);

        const resultUrl = URL.createObjectURL(result.resultBlob);
        const maskUrl = URL.createObjectURL(result.maskBlob);

        // Prepare the reusable render source before flipping to `done`, so the
        // first paint already has a composite to show.
        disposeRenderSource(sourceRef.current);
        sourceRef.current = await prepareRenderSource(blob, result.maskBlob);

        setCurrentImage({
          ...image,
          resultUrl,
          maskUrl,
          processingTimeMs: result.processingTimeMs,
        });
        setProcessingState({ status: 'done', progress: 100 });

        await renderPreview();

        trackStudioEvent({
          type: 'processing_completed',
          payload: { processingTimeMs: result.processingTimeMs, mode: store.controlMode },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to process image';
        setProcessingState({ status: 'error', error: message });
        trackStudioEvent({
          type: 'processing_failed',
          payload: { error: message, mode: store.controlMode },
        });
      }
    },
    [setCurrentImage, setProcessingState, renderPreview],
  );

  /* ── Upload ─────────────────────────────────────────────────────────── */
  const handleUpload = useCallback(
    (file: File) => {
      trackStudioEvent({
        type: 'image_uploaded',
        payload: { fileSize: file.size, fileType: file.type, mode: controlMode },
      });

      // Batch mode has its own queue and its own Process All action.
      if (controlMode === 'batch') {
        addBatchFiles([file]);
        return;
      }

      const entry = {
        id: crypto.randomUUID(),
        name: file.name,
        originalUrl: URL.createObjectURL(file),
      };

      setCurrentImage(entry);
      void processImage(entry);
    },
    [controlMode, addBatchFiles, setCurrentImage, processImage],
  );

  /* ── Reprocess with current segmentation settings ───────────────────── */
  const handleProcess = useCallback(() => {
    const image = useImageStudioStore.getState().currentImage;
    if (!image) return;
    void processImage(image);
  }, [processImage]);

  /* ── Start over ─────────────────────────────────────────────────────── */
  const handleRetry = useCallback(() => {
    disposeRenderSource(sourceRef.current);
    sourceRef.current = null;

    if (composedUrlRef.current) URL.revokeObjectURL(composedUrlRef.current);
    composedUrlRef.current = null;
    setComposedUrl(null);
    setHasExported(false);

    setCurrentImage(null);
    setProcessingState({ status: 'idle', progress: 0, error: undefined });
  }, [setCurrentImage, setProcessingState]);

  /* ── Brush touch-up → fold back into the mask ───────────────────────── */
  const handleBrushResultChange = useCallback(
    async (blobUrl: string) => {
      const source = sourceRef.current;
      if (!source) {
        URL.revokeObjectURL(blobUrl);
        return;
      }

      try {
        const blob = await fetch(blobUrl).then((r) => r.blob());
        const decoded = await decodeImage(blob);
        replaceMask(source, maskFromCutout(decoded, source.width, source.height));
        closeImage(decoded);
        await renderPreview();
      } catch {
        /* A failed touch-up must not take the editor down. */
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    },
    [renderPreview],
  );

  /* ── Export ─────────────────────────────────────────────────────────── */
  const handleExport = useCallback(
    async (format: ImageExportFormat, quality: number): Promise<EncodeResult | null> => {
      const source = sourceRef.current;
      if (!source) return null;

      const state = useImageStudioStore.getState();
      const composite = renderComposite(source, selectRenderSettings(state));

      try {
        const result = await encodeCanvas(composite.canvas, {
          format,
          quality,
          matte: selectExportMatte(state),
        });

        setHasExported(true);
        trackStudioEvent({
          type: 'image_exported',
          payload: { format: result.format, quality, mode: state.controlMode },
        });
        return result;
      } finally {
        releaseCanvas(composite.canvas);
      }
    },
    [],
  );

  const handleModeChange = useCallback(
    (newMode: ControlMode) => {
      if (newMode !== controlMode) {
        trackStudioEvent({ type: 'mode_changed', payload: { from: controlMode, to: newMode } });
      }
    },
    [controlMode],
  );

  /* ── Batch mode owns the whole panel ────────────────────────────────── */
  // Previously this only rendered inside the `done` branch, which meant the
  // queue was unreachable until you had already processed an image by hand.
  if (controlMode === 'batch') {
    return (
      <div className="space-y-6">
        <ModeSelectorRow onModeChange={handleModeChange} />
        <BatchQueueManager />
      </div>
    );
  }

  /* ── Render by state ────────────────────────────────────────────────── */
  const renderContent = () => {
    switch (processingState.status) {
      /* ────── IDLE / UPLOADING ────── */
      case 'idle':
      case 'uploading':
        return (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-sm font-semibold text-foreground">
                {t('imageStudio.uploadTitle')}
              </h2>
              <p className="text-xs text-muted-foreground">{t('imageStudio.uploadHint')}</p>
            </div>
            <ImageUploadZone onImageUpload={handleUpload} />
            {processingState.status === 'uploading' && currentImage && (
              <div className="flex items-center justify-center gap-2">
                <div className="size-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">{t('imageStudio.uploading')}</p>
              </div>
            )}
          </div>
        );

      /* ────── PROCESSING ────── */
      case 'processing': {
        const progress = processingState.progress;
        return (
          <div className="space-y-6">
            {currentImage && (
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.originalUrl}
                  alt={t('imageStudio.labelOriginal')}
                  className="size-full object-contain bg-muted"
                  style={{ maxHeight: 240 }}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md bg-black/50 text-white backdrop-blur-sm">
                  {t('imageStudio.labelOriginal')}
                </div>
              </div>
            )}

            <ProcessingAnimation />

            <div className="mx-auto max-w-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('imageStudio.processingLabel')}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      }

      /* ────── DONE ────── */
      case 'done': {
        if (!currentImage?.resultUrl) return null;

        const isPresetSelected =
          (controlMode === 'product' && selectedProductPreset !== null) ||
          (controlMode === 'social' && selectedSocialPreset !== null);

        const settingsAdjusted =
          shadow !== null ||
          edgeRefinement.smooth > 0 ||
          edgeRefinement.feather > 0 ||
          edgeRefinement.expand !== 0 ||
          edgeRefinement.hairDetail;

        // The composite is what everything downstream consumes; the raw cutout
        // is only what the brush edits.
        const previewUrl = composedUrl ?? currentImage.resultUrl;

        return (
          <div className="space-y-6">
            <BeforeAfterSlider
              originalUrl={currentImage.originalUrl}
              resultUrl={currentImage.resultUrl}
              previewUrl={previewUrl}
              isPreviewStale={isRendering}
              onResultChange={handleBrushResultChange}
            />

            {currentImage.processingTimeMs != null && (
              <p className="text-center text-[10px] text-muted-foreground">
                {t('imageStudio.processedIn', {
                  seconds: (currentImage.processingTimeMs / 1000).toFixed(1),
                })}
              </p>
            )}

            {renderError && (
              <p className="text-center text-[11px] text-destructive">{renderError}</p>
            )}

            <QualityControls onReprocess={handleProcess} isProcessing={false} />

            <WorkflowCTA
              controlMode={controlMode}
              backgroundChosen={background.type !== 'transparent'}
              settingsAdjusted={settingsAdjusted}
              isPresetSelected={isPresetSelected}
              hasExported={hasExported}
              onScrollToSection={handleScrollToSection}
            />

            <ModeSelectorRow onModeChange={handleModeChange} />

            <div ref={backgroundSectionRef}>
              <BackgroundOptionsRow />
            </div>

            <div ref={settingsSectionRef} className="space-y-4">
              <EdgeRefinementControls />
              <ShadowControls />
            </div>

            <div ref={presetSectionRef}>
              {controlMode === 'product' && <ProductPresetsGrid />}
              {controlMode === 'social' && <SocialPresetsGrid />}
            </div>

            <LivePreviewContexts imageUrl={previewUrl} />

            <div ref={exportSectionRef}>
              <ExportPanel
                fileName={baseName(currentImage.name)}
                onExport={handleExport}
                /* `sourceRef.current` was read here, during render. A ref does
                   not trigger a re-render, so the button's disabled state could
                   not update when the source appeared. `composedUrl` is state
                   and is non-null exactly when a composite exists — which is
                   also the better condition: there is nothing to export until
                   one has been rendered. handleExport still guards on the ref
                   itself, so a race cannot export a disposed source. */
                disabled={!composedUrl}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
              >
                {t('imageStudio.startOverLink')}
              </button>
            </div>
          </div>
        );
      }

      /* ────── ERROR ────── */
      case 'error':
        return (
          <div className="space-y-6">
            {currentImage && (
              <div className="relative mx-auto max-w-sm overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImage.originalUrl}
                  alt={t('imageStudio.labelOriginal')}
                  className="size-full object-contain bg-muted"
                  style={{ maxHeight: 240 }}
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-md bg-black/50 text-white backdrop-blur-sm">
                  {t('imageStudio.labelOriginal')}
                </div>
              </div>
            )}

            <div className="mx-auto max-w-sm space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-destructive"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  {t('imageStudio.errorTitle')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {processingState.error || t('imageStudio.errorUnknown')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleProcess}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t('imageStudio.retry')}
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('imageStudio.startOver')}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {processingState.status === 'idle' && <ModeSelectorRow onModeChange={handleModeChange} />}
      {renderContent()}
    </div>
  );
}
