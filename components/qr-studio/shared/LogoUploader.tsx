'use client';

import { useRef, useState } from 'react';
import { Image, Upload, X, AlertTriangle } from 'lucide-react';

interface LogoUploaderProps {
  logo?: { dataUrl: string; size: number };
  onChange: (logo: { dataUrl: string; size: number } | undefined) => void;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
}

const MAX_LOGO_PERCENT = { L: 20, M: 25, Q: 30, H: 35 };

export default function LogoUploader({ logo, onChange, errorCorrection = 'H' }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const maxPercent = MAX_LOGO_PERCENT[errorCorrection] || 25;
  const isOversized = logo && logo.size > maxPercent;

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = document.createElement('img');
      img.onload = () => {
        const qrModuleSize = 100; // reference
        const sizePercent = Math.round((img.width / qrModuleSize) * 100);
        onChange({ dataUrl, size: sizePercent });
      };
      img.onerror = () => setError('Failed to load image');
      img.src = dataUrl;
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">
      {logo ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
          <div className="w-12 h-12 rounded-lg border border-border overflow-hidden flex-shrink-0 bg-white p-1">
            <img src={logo.dataUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Logo uploaded</p>
            <p className="text-[10px] text-muted-foreground">
              Logo size: ~{logo.size}% of QR module
              {isOversized && ' (may affect readability)'}
            </p>
          </div>
          <button
            onClick={() => onChange(undefined)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground/30 hover:bg-muted/20'
          }`}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center">
            Drop logo here or click to upload
          </p>
          <p className="text-[10px] text-muted-foreground">
            PNG, JPG, SVG • Max 2 MB • Transparent background recommended
          </p>
        </div>
      )}

      {isOversized && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-600">
            Logo may be too large for {errorCorrection} error correction level.
            Max recommended: {maxPercent}% of QR size.
          </p>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
