'use client';

/**
 * ScaleDisplay — 11-step color scale visualization (50-950).
 * Shows a horizontal bar of colors with hex labels on hover.
 */

interface ScaleDisplayProps {
  label: string;
  colors: Record<string, string>;
  className?: string;
}

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

export function ScaleDisplay({ label, colors, className = '' }: ScaleDisplayProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <h4 className="text-xs font-semibold text-foreground">{label}</h4>
      <div className="flex rounded-lg overflow-hidden border border-border/50 h-9">
        {STEPS.map((step) => {
          const hex = colors[step] || '#ccc';
          return (
            <div
              key={step}
              className="flex-1 relative group cursor-pointer"
              style={{ backgroundColor: hex }}
              onClick={() => navigator.clipboard.writeText(hex)}
              title={`${step}: ${hex}`}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono bg-black/40 text-white">
                {hex}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between px-0.5">
        {STEPS.map((step) => (
          <span key={step} className="text-[9px] font-mono text-muted-foreground">{step}</span>
        ))}
      </div>
    </div>
  );
}
