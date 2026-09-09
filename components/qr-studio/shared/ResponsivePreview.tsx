'use client';

import { useState } from 'react';
import { Smartphone, Tablet, Monitor, Printer } from 'lucide-react';
import type { QROptions } from '@/lib/qr/types';
import QRPreview from './QRPreview';

type Viewport = 'mobile' | 'tablet' | 'desktop' | 'print';

const VIEWPORT_SIZES: Record<Viewport, { width: number; height: number; label: string }> = {
  mobile: { width: 200, height: 200, label: 'Mobile' },
  tablet: { width: 250, height: 250, label: 'Tablet' },
  desktop: { width: 300, height: 300, label: 'Desktop' },
  print: { width: 350, height: 350, label: 'Print' },
};

const VIEWPORT_ICONS: Record<Viewport, React.ReactNode> = {
  mobile: <Smartphone className="h-3.5 w-3.5" />,
  tablet: <Tablet className="h-3.5 w-3.5" />,
  desktop: <Monitor className="h-3.5 w-3.5" />,
  print: <Printer className="h-3.5 w-3.5" />,
};

interface ResponsivePreviewProps {
  options: QROptions;
}

export default function ResponsivePreview({ options }: ResponsivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const vp = VIEWPORT_SIZES[viewport];

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {(Object.keys(VIEWPORT_SIZES) as Viewport[]).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${
              viewport === v
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground hover:border-muted-foreground/30'
            }`}
          >
            {VIEWPORT_ICONS[v]}
            {VIEWPORT_SIZES[v].label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-center p-4 rounded-xl border border-border bg-background/50">
        <QRPreview options={options} size={vp.width} />
      </div>
    </div>
  );
}
