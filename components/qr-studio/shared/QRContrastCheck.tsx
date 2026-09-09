'use client';

import { useMemo } from 'react';
import { checkQRContrast } from '@/lib/qr/contrastCheck';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface QRContrastCheckProps {
  foreground: string;
  background: string;
}

export default function QRContrastCheck({ foreground, background }: QRContrastCheckProps) {
  const result = useMemo(
    () => checkQRContrast(foreground, background),
    [foreground, background]
  );

  return (
    <div className="space-y-3 p-3 rounded-xl border border-border bg-background">
      <div className="flex items-center gap-2">
        {result.passAAA ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
        ) : result.passAA ? (
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
        ) : (
          <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
        )}
        <div>
          <p className="text-xs font-medium text-foreground">
            {result.passAAA ? 'Excellent contrast' : result.passAA ? 'Acceptable contrast' : 'Low contrast'}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Ratio: {result.ratio.toFixed(2)}:1
            {result.passAAA ? ' (AAA)' : result.passAA ? ' (AA)' : ' (fails AA)'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: foreground }} />
          <span className="text-[10px] font-mono text-muted-foreground">{foreground}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-md border border-border" style={{ backgroundColor: background }} />
          <span className="text-[10px] font-mono text-muted-foreground">{background}</span>
        </div>
      </div>

      {result.suggestion && (
        <p className="text-[11px] text-muted-foreground">{result.suggestion}</p>
      )}
    </div>
  );
}
