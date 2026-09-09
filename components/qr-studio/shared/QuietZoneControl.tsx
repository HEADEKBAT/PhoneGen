'use client';

interface QuietZoneControlProps {
  value: number;
  onChange: (value: number) => void;
}

export default function QuietZoneControl({ value, onChange }: QuietZoneControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">Quiet Zone (modules)</label>
        <span className="text-xs font-mono text-muted-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>None (0)</span>
        <span>Default (4)</span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">
        Quiet zone is the empty border around the QR code. Minimum 4 modules for reliable scanning.
      </p>
    </div>
  );
}
