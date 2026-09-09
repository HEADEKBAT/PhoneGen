'use client';

import { useMemo } from 'react';
import { runScanTest } from '@/lib/qr/scanTest';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import type { ErrorCorrection } from '@/lib/qr/types';

interface QRScannerTestProps {
  content: string;
  errorCorrection: ErrorCorrection;
  contentLength: number;
}

function StatusIcon({ status }: { status: 'pass' | 'warn' | 'fail' }) {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />;
    case 'warn':
      return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
    case 'fail':
      return <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />;
  }
}

export default function QRScannerTest({ content, errorCorrection, contentLength }: QRScannerTestProps) {
  const result = useMemo(
    () => runScanTest(content, errorCorrection, contentLength),
    [content, errorCorrection, contentLength]
  );

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Info className="h-8 w-8 mb-2" />
        <p className="text-xs">Enter content to see scan test results</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-background">
        <StatusIcon status={result.readable ? 'pass' : 'fail'} />
        <div>
          <p className="text-xs font-medium text-foreground">
            {result.readable ? 'Readable' : 'May not be readable'}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Estimated scan quality: {result.estimatedScanQuality}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl border border-border bg-background">
          <p className="text-[10px] text-muted-foreground">Version</p>
          <p className="text-xs font-mono text-foreground mt-0.5">{result.version}</p>
        </div>
        <div className="p-2.5 rounded-xl border border-border bg-background">
          <p className="text-[10px] text-muted-foreground">Encoding</p>
          <p className="text-xs font-mono text-foreground mt-0.5">{result.encoding}</p>
        </div>
        <div className="p-2.5 rounded-xl border border-border bg-background">
          <p className="text-[10px] text-muted-foreground">Module Count</p>
          <p className="text-xs font-mono text-foreground mt-0.5">{result.size}×{result.size}</p>
        </div>
        <div className="p-2.5 rounded-xl border border-border bg-background">
          <p className="text-[10px] text-muted-foreground">Content Length</p>
          <p className="text-xs font-mono text-foreground mt-0.5">{contentLength} chars</p>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="space-y-1.5">
          {result.warnings.map((warning, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-600">{warning}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
