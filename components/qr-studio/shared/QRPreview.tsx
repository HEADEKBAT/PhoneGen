'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { renderQRTo } from '@/lib/qr/generator';
import type { QROptions } from '@/lib/qr/types';
import { useTranslations } from '@/lib/i18n';

interface QRPreviewProps {
  options: QROptions;
  /** Rendered pixel size of the square, quiet zone included. */
  size?: number;
  className?: string;
}

/**
 * The QR code itself.
 *
 * ── What was wrong ──────────────────────────────────────────────────────────
 *
 * This component rendered nothing. It passed its own `<canvas>` to
 * `generateQRToCanvas`, which handed it to the drawing library as a
 * *container*; the library does `container.appendChild(...)`, and a `<canvas>`
 * inside a `<canvas>` is fallback content that a browser never paints. So the
 * studio drew a white square, and the contrast panel underneath reported 21:1
 * on it — white on white, scoring perfectly.
 *
 * The library appends into whatever element it is given, so the element is a
 * `<div>` now. `renderQRTo` clears it first, because the library appends
 * rather than replaces and a preview that re-rendered on every keystroke was
 * stacking canvases.
 *
 * The contrast warning that used to live here is gone: it duplicated the panel
 * beside it, word for word, from the same function. One verdict, one place —
 * `QRReadiness` now, which can also see the things a contrast ratio cannot.
 */
export default function QRPreview({ options, size = 280, className = '' }: QRPreviewProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'drawing' | 'error'>('idle');

  useEffect(() => {
    const container = holder.current;
    if (!container) return;

    if (!options.content) {
      container.replaceChildren();
      setState('idle');
      return;
    }

    setState('drawing');
    try {
      renderQRTo(container, options, { size });
      setState('idle');
    } catch {
      /* An unencodable payload — too long for version 40, most often. The
         readiness panel says which; here it is enough not to leave a stale
         symbol on screen next to new content. */
      container.replaceChildren();
      setState('error');
    }
  }, [options, size]);

  const { t } = useTranslations();

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative grid place-items-center overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm"
        style={{ width: size + 32, height: size + 32 }}
      >
        <div ref={holder} className="grid place-items-center [&>canvas]:rounded-lg [&>svg]:rounded-lg" />

        {!options.content && (
          <p className="absolute px-4 text-center text-sm text-neutral-500">
            {t('qrStudio.preview.empty')}
          </p>
        )}

        {state === 'error' && (
          <p className="absolute px-4 text-center text-xs text-red-600">
            {t('qrStudio.preview.failed')}
          </p>
        )}

        {state === 'drawing' && !options.content && (
          <Loader2 className="absolute size-6 animate-spin text-neutral-400" />
        )}
      </div>
    </div>
  );
}
