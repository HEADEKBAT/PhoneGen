'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, X, AlertCircle } from 'lucide-react';

interface UploadZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  maxSize?: number; // bytes, default 500MB
  disabled?: boolean;
}

const DEFAULT_ACCEPT = '.mp4,.mov,.avi,.mkv,.webm,.gif,.mp3,.wav,.ogg,.aac,.m4a,.flac';
const DEFAULT_MAX_SIZE = 500 * 1024 * 1024; // 500MB

export default function UploadZone({
  onFile,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
  disabled = false,
}: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`;
    }
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowed = accept.split(',');
    if (!allowed.some((a) => a.trim() === ext) && !allowed.includes('*')) {
      return `Format ${ext} not supported`;
    }
    return null;
  }, [accept, maxSize]);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const err = validateFile(file);
    if (err) {
      setError(err);
      return;
    }
    onFile(file);
  }, [validateFile, onFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const file = e.clipboardData.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onPaste={handlePaste}
      tabIndex={0}
      role="button"
      aria-label="Upload media file"
      className={`
        relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50 hover:bg-accent/30'}
        ${dragOver ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border'}
        ${error ? 'border-destructive' : ''}
      `}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      {error ? (
        <div className="flex flex-col items-center gap-3 text-destructive">
          <AlertCircle className="h-12 w-12" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={(e) => { e.stopPropagation(); setError(null); }}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Try again
          </button>
        </div>
      ) : dragOver ? (
        <div className="flex flex-col items-center gap-3 text-primary">
          <Upload className="h-12 w-12 animate-bounce" />
          <p className="text-lg font-semibold">Drop to convert</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="rounded-xl bg-accent/50 p-4">
            <FileVideo className="h-10 w-10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">
              Drop your file here
            </p>
            <p className="mt-1 text-sm">
              or click to browse &middot; max {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'GIF', 'MP3', 'WAV'].map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {fmt}
              </span>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Paste from clipboard also supported
          </p>
        </div>
      )}
    </div>
  );
}
