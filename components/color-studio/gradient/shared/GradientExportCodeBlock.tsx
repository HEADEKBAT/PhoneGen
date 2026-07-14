'use client';

import { CopyButton } from '../../shared/CopyButton';

interface GradientExportCodeBlockProps {
  code: string;
  language?: string;
  label?: string;
  className?: string;
}

export function GradientExportCodeBlock({
  code,
  language = 'css',
  label,
  className = '',
}: GradientExportCodeBlockProps) {
  return (
    <div className={`rounded-xl border border-border/50 overflow-hidden ${className}`}>
      {label && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/30">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
            {language}
          </span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto bg-card text-xs font-mono leading-relaxed max-h-80">
          <code>{code}</code>
        </pre>
        <div className="absolute top-2 right-2">
          <CopyButton text={code} label="Copy" />
        </div>
      </div>
    </div>
  );
}
