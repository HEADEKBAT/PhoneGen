'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Brush, Eraser, Loader2, Redo2, RotateCcw, Undo2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { cn } from '@/lib/utils';

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface BeforeAfterSliderProps {
  originalUrl: string;
  /** The raw cutout. This is the surface the touch-up brush edits. */
  resultUrl: string;
  /**
   * Fully composited preview (background, shadow, preset framing). Shown when
   * the brush is off; the brush switches back to the bare cutout so the user
   * can see exactly which pixels they are changing.
   */
  previewUrl?: string;
  /** A re-render is in flight, so `previewUrl` is one edit behind. */
  isPreviewStale?: boolean;
  className?: string;
  /** Called after each brush edit with a fresh blob URL of the modified cutout. */
  onResultChange?: (blobUrl: string) => void;
}

/* ─── Constants ────────────────────────────────────────────────────────────── */

const BRUSH_MIN = 5;
const BRUSH_MAX = 100;
const MAX_UNDO = 30;

type BrushMode = 'restore' | 'erase';

/* ─── Component ────────────────────────────────────────────────────────────── */

export function BeforeAfterSlider({
  originalUrl,
  resultUrl,
  previewUrl,
  isPreviewStale = false,
  className = '',
  onResultChange,
}: BeforeAfterSliderProps) {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origCanvasRef = useRef<HTMLCanvasElement | null>(null); // off-screen canvas holding original pixels
  const cursorRef = useRef<HTMLDivElement>(null);

  /* ── Slider state ──────────────────────────────────────────────────────── */
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  /* ── Touch-up state ───────────────────────────────────────────────────── */
  const [touchUpActive, setTouchUpActive] = useState(false);
  const [brushMode, setBrushMode] = useState<BrushMode>('restore');
  const [brushSize, setBrushSize] = useState(20);
  const isDrawingRef = useRef(false);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  /* ── Undo/redo ─────────────────────────────────────────────────────────── */
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  /* ── Cached render rect (object-contain geometry) ──────────────────────── */
  const renderRectRef = useRef({ x: 0, y: 0, w: 0, h: 0, canvasW: 0, canvasH: 0 });

  const updateRenderRect = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const imgAspect = canvas.width / canvas.height;
    const containerAspect = rect.width / rect.height;

    let renderW: number, renderH: number, renderX: number, renderY: number;
    if (imgAspect > containerAspect) {
      renderW = rect.width;
      renderH = renderW / imgAspect;
      renderX = 0;
      renderY = (rect.height - renderH) / 2;
    } else {
      renderH = rect.height;
      renderW = renderH * imgAspect;
      renderX = (rect.width - renderW) / 2;
      renderY = 0;
    }

    renderRectRef.current = { x: renderX, y: renderY, w: renderW, h: renderH, canvasW: canvas.width, canvasH: canvas.height };
  }, []);

  /* ── Load images + init canvas + off-screen original ───────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    const resultImg = new Image();
    resultImg.crossOrigin = 'anonymous';
    resultImg.onload = () => {
      if (cancelled) return;

      const origImg = new Image();
      origImg.crossOrigin = 'anonymous';
      origImg.onload = () => {
        if (cancelled) return;

        // Canvas at natural image resolution
        canvas.width = resultImg.naturalWidth;
        canvas.height = resultImg.naturalHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(resultImg, 0, 0);

        // Off-screen canvas with original pixels, sized to match the result
        // canvas exactly so brush coordinates map 1:1 between the two.
        const origCanvas = document.createElement('canvas');
        origCanvas.width = canvas.width;
        origCanvas.height = canvas.height;
        origCanvas
          .getContext('2d', { willReadFrequently: true })!
          .drawImage(origImg, 0, 0, canvas.width, canvas.height);
        origCanvasRef.current = origCanvas;

        // Seed undo stack
        const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        undoStackRef.current = [initialState];
        redoStackRef.current = [];
        setCanUndo(false);
        setCanRedo(false);
        setIsCanvasReady(true);

        // Init render rect on next frame (layout settled)
        requestAnimationFrame(updateRenderRect);
      };
      origImg.src = originalUrl;
    };
    resultImg.src = resultUrl;

    return () => {
      cancelled = true;
      origCanvasRef.current = null;
      setIsCanvasReady(false);
    };
  }, [originalUrl, resultUrl, updateRenderRect]);

  // Recalc render rect on resize
  useEffect(() => {
    if (!isCanvasReady) return;
    window.addEventListener('resize', updateRenderRect);
    return () => window.removeEventListener('resize', updateRenderRect);
  }, [isCanvasReady, updateRenderRect]);

  /* ── Coordinate mapping (display → canvas pixels) ──────────────────────── */
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return null;

    const rr = renderRectRef.current;
    if (rr.canvasW !== canvas.width || rr.canvasH !== canvas.height) {
      updateRenderRect();
    }

    const containerRect = container.getBoundingClientRect();
    const px = ((clientX - containerRect.left - rr.x) / rr.w) * canvas.width;
    const py = ((clientY - containerRect.top - rr.y) / rr.h) * canvas.height;

    if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) return null;
    return { x: px, y: py };
  }, [updateRenderRect]);

  /* ── Update brush cursor overlay position ──────────────────────────────── */
  const updateCursorPosition = useCallback(
    (clientX: number, clientY: number) => {
      const el = cursorRef.current;
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!el || !container || !canvas) return;

      const rr = renderRectRef.current;
      const containerRect = container.getBoundingClientRect();
      const displaySize = Math.max(4, brushSize * (rr.w / canvas.width));
      const cx = clientX - containerRect.left;
      const cy = clientY - containerRect.top;

      el.style.width = `${displaySize}px`;
      el.style.height = `${displaySize}px`;
      el.style.transform = `translate(${cx - displaySize / 2}px, ${cy - displaySize / 2}px)`;
      el.style.opacity = '1';
    },
    [brushSize],
  );

  /* ── Publish the edited cutout back to the parent ──────────────────────── */
  // The parent turns this into a new mask, so undo/redo/reset must publish too
  // — otherwise the on-screen canvas and the exported file drift apart.
  const emitResult = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onResultChange) return;
    canvas.toBlob((blob) => {
      if (blob) onResultChange(URL.createObjectURL(blob));
    }, 'image/png');
  }, [onResultChange]);

  /* ── Undo / Redo / Reset ──────────────────────────────────────────────── */
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(current);
    if (undoStackRef.current.length > MAX_UNDO) undoStackRef.current.shift();
    redoStackRef.current = [];
    setCanUndo(undoStackRef.current.length > 1);
    setCanRedo(false);

    emitResult();
  }, [emitResult]);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length < 2) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStackRef.current.push(current);

    undoStackRef.current.pop();
    const prev = undoStackRef.current[undoStackRef.current.length - 1];
    ctx.putImageData(prev, 0, 0);

    setCanUndo(undoStackRef.current.length > 1);
    setCanRedo(true);
    emitResult();
  }, [emitResult]);

  const handleRedo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(current);

    const redo = redoStackRef.current.pop()!;
    ctx.putImageData(redo, 0, 0);

    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
    emitResult();
  }, [emitResult]);

  const handleReset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initial = undoStackRef.current[0];
    ctx.putImageData(initial, 0, 0);
    undoStackRef.current = [initial];
    redoStackRef.current = [];

    setCanUndo(false);
    setCanRedo(false);
    emitResult();
  }, [emitResult]);

  /* ── Painting ──────────────────────────────────────────────────────────── */
  // Restore copies the original pixels back in; erase clears alpha. Both touch
  // only the brush-sized region, so stroke cost is independent of image size.
  const paint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const origCanvas = origCanvasRef.current;
      if (!canvas || !origCanvas) return;

      const coords = getCanvasCoords(clientX, clientY);
      if (!coords) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      const r = brushSize;
      const cx = Math.round(coords.x);
      const cy = Math.round(coords.y);

      const minX = Math.max(0, cx - r);
      const minY = Math.max(0, cy - r);
      const maxX = Math.min(canvas.width, cx + r);
      const maxY = Math.min(canvas.height, cy + r);
      const regionW = maxX - minX;
      const regionH = maxY - minY;

      if (regionW <= 0 || regionH <= 0) return;

      const resultPx = ctx.getImageData(minX, minY, regionW, regionH);
      const origPx =
        brushMode === 'restore'
          ? origCanvas
              .getContext('2d', { willReadFrequently: true })!
              .getImageData(minX, minY, regionW, regionH)
          : null;

      const rSq = r * r;
      for (let y = 0; y < regionH; y++) {
        for (let x = 0; x < regionW; x++) {
          const dx = minX + x - cx;
          const dy = minY + y - cy;
          if (dx * dx + dy * dy > rSq) continue;

          const i = (y * regionW + x) * 4;
          if (origPx) {
            resultPx.data[i] = origPx.data[i];
            resultPx.data[i + 1] = origPx.data[i + 1];
            resultPx.data[i + 2] = origPx.data[i + 2];
            resultPx.data[i + 3] = origPx.data[i + 3];
          } else {
            resultPx.data[i + 3] = 0;
          }
        }
      }

      ctx.putImageData(resultPx, minX, minY);
    },
    [brushSize, brushMode, getCanvasCoords],
  );

  /* ── Canvas pointer handlers ───────────────────────────────────────────── */
  const handleCanvasPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!touchUpActive) return;
      e.preventDefault();
      isDrawingRef.current = true;
      canvasRef.current?.setPointerCapture?.(e.pointerId);
      paint(e.clientX, e.clientY);
    },
    [touchUpActive, paint],
  );

  const handleCanvasPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!touchUpActive) return;
      e.preventDefault();

      updateCursorPosition(e.clientX, e.clientY);

      if (isDrawingRef.current) {
        paint(e.clientX, e.clientY);
      }
    },
    [touchUpActive, paint, updateCursorPosition],
  );

  const handleCanvasPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      isDrawingRef.current = false;
      saveState();
    },
    [saveState],
  );

  /* ── Slider handlers ───────────────────────────────────────────────────── */
  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPos((x / rect.width) * 100);
    },
    [],
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging) return;
      handleMove(e.clientX);
    },
    [dragging, handleMove],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 5;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSliderPos((prev) => Math.max(0, prev - step));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSliderPos((prev) => Math.min(100, prev + step));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSliderPos(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setSliderPos(100);
      }
    },
    [],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging) return;
      handleMove(e.touches[0].clientX);
    },
    [dragging, handleMove],
  );

  /* ── Attach global slider listeners ────────────────────────────────────── */
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  /* ── Which layer represents "after" ────────────────────────────────────── */
  // Brush on → the editable cutout canvas. Brush off → the composite, so the
  // background, shadow and preset framing the user picked are what they see.
  const showComposite = !touchUpActive && Boolean(previewUrl);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <div className={cn('space-y-2', className)}>
      {/* ── Slider area ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        role="slider"
        aria-label={t('imageStudio.comparisonAria')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(sliderPos)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          if (touchUpActive && cursorRef.current) cursorRef.current.style.opacity = '1';
        }}
        onMouseLeave={() => {
          if (cursorRef.current) cursorRef.current.style.opacity = '0';
        }}
        className="relative overflow-hidden rounded-xl border border-border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        style={{
          aspectRatio: '16 / 9',
          maxHeight: '450px',
          // Checkerboard, so a transparent cutout reads as transparent rather
          // than as a white or black background.
          backgroundImage:
            'linear-gradient(45deg, rgba(128,128,128,0.14) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.14) 75%), linear-gradient(45deg, rgba(128,128,128,0.14) 25%, transparent 25%, transparent 75%, rgba(128,128,128,0.14) 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        }}
      >
        {/* Composited preview (shown when the brush is off) */}
        {showComposite && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={previewUrl}
            alt={t('imageStudio.labelResult')}
            className="absolute inset-0 size-full object-contain"
            draggable={false}
          />
        )}

        {/* Result layer — canvas (editable, behind the original clip) */}
        <canvas
          ref={canvasRef}
          className={cn(
            'absolute inset-0 size-full',
            isCanvasReady && !showComposite ? 'block' : 'hidden',
          )}
          style={{
            objectFit: 'contain',
            touchAction: touchUpActive ? 'none' : undefined,
            cursor: touchUpActive ? 'none' : undefined, // hide native cursor in brush mode
          }}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
        />
        {!isCanvasReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Original image (clipped from left by slider position) */}
        <div
          className="absolute inset-0 size-full overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
            pointerEvents: touchUpActive ? 'none' : undefined,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-contain"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)] cursor-col-resize z-10"
          style={{ left: `${sliderPos}%` }}
        >
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
              setDragging(true);
              handleMove(e.touches[0].clientX);
            }}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'size-9 rounded-full border-[3px] border-white bg-black/40 backdrop-blur-sm',
              'flex items-center justify-center',
              'shadow-[0_0_10px_rgba(0,0,0,0.4)]',
              'transition-shadow duration-200',
              dragging && 'shadow-[0_0_18px_rgba(255,255,255,0.6)]',
            )}
          >
            <div className="flex gap-1">
              <svg width="4" height="14" viewBox="0 0 4 14" fill="none" aria-hidden="true">
                <path d="M3 1L1 7L3 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="4" height="14" viewBox="0 0 4 14" fill="none" aria-hidden="true">
                <path d="M1 1L3 7L1 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div
          className="absolute top-3 left-3 px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md bg-black/50 text-white backdrop-blur-sm pointer-events-none"
          style={{ opacity: sliderPos > 15 ? 1 : 0 }}
        >
          {t('imageStudio.labelOriginal')}
        </div>
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md bg-black/50 text-white backdrop-blur-sm pointer-events-none"
          style={{ opacity: sliderPos < 85 ? 1 : 0 }}
        >
          {isPreviewStale && <Loader2 size={10} className="animate-spin" />}
          {touchUpActive ? t('imageStudio.labelCutout') : t('imageStudio.labelResult')}
        </div>

        {/* Brush cursor overlay (circle showing brush size) */}
        <div
          ref={cursorRef}
          className="absolute pointer-events-none z-30"
          style={{
            width: 1,
            height: 1,
            border: '1.5px solid rgba(255,255,255,0.9)',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(0,0,0,0.5), inset 0 0 4px rgba(0,0,0,0.3)',
            transform: 'translate(0, 0)',
            opacity: 0,
            transition: 'opacity 0.12s ease-out',
          }}
        >
          {/* Crosshair dot in center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1 rounded-full bg-white shadow-[0_0_3px_rgba(0,0,0,0.8)]" />
        </div>

        {/* Brush toggle button */}
        {isCanvasReady && (
          <button
            type="button"
            onClick={() => {
              setTouchUpActive((prev) => !prev);
              if (cursorRef.current) cursorRef.current.style.opacity = '0';
            }}
            aria-label={
              touchUpActive
                ? t('imageStudio.brushDisable')
                : t('imageStudio.brushEnable')
            }
            aria-pressed={touchUpActive}
            className={cn(
              'absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-full border transition-colors',
              touchUpActive
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-black/40 border-white/30 text-white/80 hover:bg-black/60 hover:text-white',
            )}
          >
            <Brush size={12} />
            {touchUpActive ? t('imageStudio.brushOn') : t('imageStudio.brush')}
          </button>
        )}
      </div>

      {/* ── Percentage indicator ──────────────────────────────────────────── */}
      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        <span>{t('imageStudio.labelOriginal')}</span>
        <span>{Math.round(sliderPos)}%</span>
        <span>{touchUpActive ? t('imageStudio.labelCutout') : t('imageStudio.labelResult')}</span>
      </div>

      {/* ── Touch-up controls ──────────────────────────────────────────────── */}
      {touchUpActive && isCanvasReady && (
        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
          {/* Brush mode */}
          <div
            className="flex gap-1 p-1 rounded-lg bg-muted/50 border border-border"
            role="radiogroup"
            aria-label={t('imageStudio.brushMode')}
          >
            <button
              type="button"
              role="radio"
              aria-checked={brushMode === 'restore'}
              onClick={() => setBrushMode('restore')}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all',
                brushMode === 'restore'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Brush size={12} />
              {t('imageStudio.brushRestore')}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={brushMode === 'erase'}
              onClick={() => setBrushMode('erase')}
              className={cn(
                'flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-all',
                brushMode === 'erase'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Eraser size={12} />
              {t('imageStudio.brushErase')}
            </button>
          </div>

          {/* Brush size slider */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="touchup-brush-size">
              {t('imageStudio.brushSize')}
            </label>
            <span className="text-xs text-muted-foreground tabular-nums">{brushSize}px</span>
          </div>
          <input
            id="touchup-brush-size"
            type="range"
            aria-label={t('imageStudio.brushSize')}
            min={BRUSH_MIN}
            max={BRUSH_MAX}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:size-3.5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-sm
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:size-3.5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-primary
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:shadow-sm
              [&::-moz-range-thumb]:cursor-pointer"
          />

          {/* Undo / Redo / Reset */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <Undo2 size={12} />
              {t('imageStudio.undo')}
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <Redo2 size={12} />
              {t('imageStudio.redo')}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!canUndo}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-lg bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <RotateCcw size={12} />
              {t('imageStudio.reset')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
