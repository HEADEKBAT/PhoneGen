'use client';

import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { exportGradient, getExportFormats, GRADIENT_EXPORT_FORMAT_LABELS, GRADIENT_EXPORT_FORMAT_DESCRIPTIONS } from '@/lib/color-studio/gradientExport';
import { GradientExportCodeBlock } from './shared/GradientExportCodeBlock';
import { Check, FileCode } from 'lucide-react';
import { useState } from 'react';

export function GradientExportTab() {
  const currentGradient = useGradientStudioStore((s) => s.currentGradient);
  const exportFormat = useGradientStudioStore((s) => s.exportFormat);
  const exportOptions = useGradientStudioStore((s) => s.exportOptions);
  const setExportFormat = useGradientStudioStore((s) => s.setExportFormat);
  const setExportOptions = useGradientStudioStore((s) => s.setExportOptions);

  const [copied, setCopied] = useState(false);

  const formats = getExportFormats();

  const code = exportGradient(currentGradient, exportFormat, exportOptions);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Format selector */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Export Format</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {formats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setExportFormat(fmt)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                exportFormat === fmt
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border/50 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <FileCode size={14} className={exportFormat === fmt ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-xs font-semibold ${exportFormat === fmt ? 'text-primary' : 'text-foreground'}`}>
                  {GRADIENT_EXPORT_FORMAT_LABELS[fmt]}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {GRADIENT_EXPORT_FORMAT_DESCRIPTIONS[fmt]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-3">
        {(['includeVariables', 'includeMeta', 'includeAnimation', 'includeNoise', 'includeMasks'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={exportOptions[opt]}
              onChange={(e) => setExportOptions({ [opt]: e.target.checked })}
              className="accent-primary size-3.5"
            />
            <span className="text-[11px] font-medium text-muted-foreground">
              {opt.replace('include', '')}
            </span>
          </label>
        ))}
      </div>

      {/* Code block */}
      <GradientExportCodeBlock
        code={code}
        language={exportFormat}
        label={`${GRADIENT_EXPORT_FORMAT_LABELS[exportFormat]} Export`}
      />

      {/* Copy all button */}
      <button
        type="button"
        onClick={handleCopy}
        className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium rounded-xl border border-border/50 bg-card hover:bg-muted transition-colors"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-500" />
            <span className="text-green-500">Copied to clipboard!</span>
          </>
        ) : (
          <>
            <FileCode size={16} />
            <span>Copy {GRADIENT_EXPORT_FORMAT_LABELS[exportFormat]} Code</span>
          </>
        )}
      </button>
    </div>
  );
}
