'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, ImageIcon, Link, Clipboard, Loader2 } from 'lucide-react';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

/** Extension → MIME, for naming the File we build from a remote fetch. */
const EXTENSION_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
};

interface ImageUploadZoneProps {
  onImageUpload: (file: File) => void;
  className?: string;
}

export function ImageUploadZone({ onImageUpload, className = '' }: ImageUploadZoneProps) {
  const { t } = useTranslations();
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlValue, setUrlValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const validateAndProcess = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(t('imageStudio.errUnsupported'));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(t('imageStudio.errTooLarge'));
        return;
      }

      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      setLoading(false);
      onImageUpload(file);
    },
    [onImageUpload, t],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndProcess(file);
      // Reset so the same file can be re-selected
      e.target.value = '';
    },
    [validateAndProcess],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) validateAndProcess(file);
          return;
        }
      }
    },
    [validateAndProcess],
  );

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  // Revoke the preview URL we are replacing, and the last one on unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ── Load from URL ────────────────────────────────────────────────────── */
  // Goes through /api/image-proxy: a direct browser fetch is blocked by CORS on
  // most image hosts, and would taint the canvas even where it is not.
  const handleUrlLoad = useCallback(async () => {
    const trimmed = urlValue.trim();
    if (!trimmed) return;

    setError(null);

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      setError(t('imageStudio.errUrlIncomplete'));
      return;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      setError(t('imageStudio.errUrlProtocol'));
      return;
    }

    // Check the path's real extension — a query string like ?ref=logo.png must
    // not be mistaken for the image itself.
    const extension = parsed.pathname.split('.').pop()?.toLowerCase() ?? '';
    const mime = EXTENSION_MIME[extension];

    setLoading(true);
    try {
      const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(trimmed)}`);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        setError(body?.error ?? t('imageStudio.errUrlFailed'));
        return;
      }

      const blob = await response.blob();
      const type = ACCEPTED_TYPES.includes(blob.type) ? blob.type : mime ?? 'image/png';
      const name = parsed.pathname.split('/').pop() || `image.${extension || 'png'}`;

      validateAndProcess(new File([blob], name, { type }));
    } catch {
      setError(t('imageStudio.errUrlFailed'));
    } finally {
      setLoading(false);
    }
  }, [urlValue, validateAndProcess, t]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        ref={dropRef}
        role="button"
        tabIndex={0}
        aria-label={t('imageStudio.uploadAria')}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer',
          'bg-background/60 backdrop-blur-sm',
          dragOver
            ? 'border-primary/60 bg-primary/5 shadow-[0_0_24px_rgba(59,130,246,0.15)]'
            : 'border-border/50 hover:border-primary/40 hover:bg-muted/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]',
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.avif"
          className="hidden"
          onChange={handleFileChange}
        />

        {loading ? (
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        ) : preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={preview}
            alt={t('imageStudio.uploadPreviewAlt')}
            className="max-h-48 max-w-full rounded-lg object-contain"
          />
        ) : (
          <>
            <div className="flex items-center justify-center size-14 rounded-full bg-primary/10">
              <Upload size={24} className="text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {t('imageStudio.uploadDrop')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('imageStudio.uploadClick')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ImageIcon size={12} />
                {t('imageStudio.uploadClickShort')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clipboard size={12} />
                {t('imageStudio.uploadPaste')}
              </span>
            </div>
          </>
        )}
      </div>

      {/* URL input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="url"
            inputMode="url"
            aria-label={t('imageStudio.uploadUrlLabel')}
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleUrlLoad();
            }}
            placeholder={t('imageStudio.uploadUrlPlaceholder')}
            className="w-full h-9 pl-9 pr-3 text-xs bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={() => void handleUrlLoad()}
          disabled={loading || !urlValue.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {t('imageStudio.uploadUrlButton')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-destructive inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}
