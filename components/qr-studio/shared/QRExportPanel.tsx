'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { QROptions, ExportFormat } from '@/lib/qr/types';
import { exportQR } from '@/lib/qr/exporters';

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'webp', label: 'WEBP' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'pdf', label: 'PDF' },
  { value: 'eps', label: 'EPS' },
];

const SIZES = [
  { value: 256, label: 'Small (256×256)' },
  { value: 512, label: 'Medium (512×512)' },
  { value: 1024, label: 'Large (1024×1024)' },
  { value: 2048, label: 'Extra Large (2048×2048)' },
];

interface QRExportPanelProps {
  options: QROptions;
  filename?: string;
}

export default function QRExportPanel({ options, filename = 'qr-code' }: QRExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [size, setSize] = useState(512);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!options.content) return;
    setExporting(true);
    try {
      await exportQR(options, format, `${filename}.${format}`, size);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Format</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                format === f.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">Size</label>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setSize(s.value)}
              className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                size === s.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!options.content || exporting}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {exporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {exporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
      </button>

      {format === 'png' && (
        <p className="text-[11px] text-muted-foreground text-center">
          PNG export supports transparent background
        </p>
      )}
    </div>
  );
}
