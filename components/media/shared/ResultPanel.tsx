'use client';

import type { ConversionResult } from '@/lib/media';
import { Download, RotateCcw, Copy, Check, Clock, HardDrive, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface ResultPanelProps {
  result: ConversionResult;
  onReset: () => void;
  onNextAction: (action: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const NEXT_ACTIONS = [
  { action: 'compress', label: 'Compress Again', icon: 'FileDown' },
  { action: 'resize', label: 'Resize', icon: 'Maximize' },
  { action: 'trim', label: 'Trim', icon: 'Scissors' },
  { action: 'extract-audio', label: 'Extract Audio', icon: 'Headphones' },
  { action: 'create-gif', label: 'Generate GIF', icon: 'Image' },
];

export default function ResultPanel({ result, onReset, onNextAction }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const savedPercent = result.originalSize > 0
    ? Math.round((1 - result.outputSize / result.originalSize) * 100)
    : 0;

  const handleCopy = async () => {
    try {
      const response = await fetch(result.blobUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: copy filename
      await navigator.clipboard.writeText(result.fileName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.blobUrl;
    a.download = result.fileName;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Before / After stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Original Size</p>
          <p className="text-2xl font-bold text-foreground">{formatBytes(result.originalSize)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Output Size</p>
          <p className="text-2xl font-bold text-primary">{formatBytes(result.outputSize)}</p>
        </div>
      </div>

      {/* Savings */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/5 to-transparent p-4">
        <div className="flex items-center gap-3">
          <ArrowDown className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Space Saved</p>
            <p className="text-xl font-bold text-foreground">
              {formatBytes(result.originalSize - result.outputSize)} ({savedPercent}%)
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {(result.encodingTime / 1000).toFixed(1)}s encoding
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" /> {result.container.toUpperCase()} format
          </span>
        </div>
      </div>

      {/* Video preview */}
      <div className="overflow-hidden rounded-xl border border-border bg-black/5">
        <video
          src={result.blobUrl}
          controls
          className="w-full max-h-[400px] object-contain"
          preload="metadata"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Convert Another
        </button>
      </div>

      {/* Next actions */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Next Actions</p>
        <div className="flex flex-wrap gap-2">
          {NEXT_ACTIONS.map((action) => (
            <button
              key={action.action}
              onClick={() => onNextAction(action.action)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
