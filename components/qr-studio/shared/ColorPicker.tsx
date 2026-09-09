'use client';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
}

const DEFAULT_PRESETS = [
  '#000000', '#1a1a2e', '#16213e', '#0f3460',
  '#e94560', '#533483', '#6c5ce7', '#0984e3',
  '#00b894', '#00cec9', '#fdcb6e', '#e17055',
  '#d63031', '#636e72', '#2d3436', '#ffffff',
];

export default function ColorPicker({ label, value, onChange, presetColors }: ColorPickerProps) {
  const presets = presetColors || DEFAULT_PRESETS;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
            }}
            className="w-20 h-7 rounded-lg border border-input bg-background px-2 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            maxLength={7}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-6 h-6 rounded-lg border transition-all ${
              value === color ? 'ring-2 ring-primary ring-offset-1 ring-offset-background scale-110' : 'border-border hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
