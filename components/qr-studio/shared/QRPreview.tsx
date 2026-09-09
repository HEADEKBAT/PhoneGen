'use client';

import { useRef, useEffect, useState } from 'react';
import { generateQRToCanvas } from '@/lib/qr/generator';
import type { QROptions } from '@/lib/qr/types';
import { Loader2 } from 'lucide-react';
import { checkQRContrast } from '@/lib/qr/contrastCheck';

interface QRPreviewProps {
  options: QROptions;
  size?: number;
  className?: string;
  onScanTest?: (dataUrl: string) => void;
}

export default function QRPreview({ options, size = 280, className = '' }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!options.content) {
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    generateQRToCanvas(options, canvasRef.current || undefined)
      .then((canvas) => {
        if (cancelled) return;
        setLoading(false);
        setError(null);
        if (canvas && canvasRef.current !== canvas) {
          canvasRef.current?.parentNode?.appendChild(canvas);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
      });

    return () => { cancelled = true; };
  }, [options]);

  const contrast = options.colors?.pattern && options.colors?.background
    ? checkQRContrast(options.colors.pattern, options.colors.background)
    : null;

  const showWarning = contrast && !contrast.passAA;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-2xl border border-border bg-white p-4 shadow-sm"
        style={{ width: size + 32, height: size + 32 }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {!options.content && !loading && (
          <div className="text-center text-muted-foreground px-4">
            <p className="text-sm">Enter content to generate QR code</p>
          </div>
        )}
        {error && (
          <div className="text-center text-destructive px-4">
            <p className="text-xs">{error}</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`rounded-xl ${loading || !options.content ? 'opacity-0 absolute' : 'opacity-100'}`}
          style={{ width: size, height: size }}
        />
      </div>

      {showWarning && contrast && (
        <p className="text-[11px] text-amber-500 mt-2 text-center max-w-[280px]">
          Low contrast: ratio {contrast.ratio.toFixed(1)}:1 (AA requires 4.5:1).
          {contrast.suggestion}
        </p>
      )}
    </div>
  );
}
