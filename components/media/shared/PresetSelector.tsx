'use client';

import type { DevicePreset, PresetDefinition, ConversionOptions } from '@/lib/media';
import { PRESETS } from '@/lib/media';
import {
  Smartphone,
  Monitor,
  Music,
  Film,
  Globe,
} from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: PresetDefinition) => void;
  currentOptions: ConversionOptions;
}

function PresetIcon({ id }: { id: string }) {
  const className = 'h-5 w-5';
  if (['youtube', 'tiktok', 'instagram', 'facebook', 'telegram', 'discord', 'whatsapp'].includes(id)) {
    return <Globe className={className} />;
  }
  if (['obs', 'premiere', 'davinci', 'final-cut', 'capcut'].includes(id)) {
    return <Film className={className} />;
  }
  if (['android', 'iphone'].includes(id)) {
    return <Smartphone className={className} />;
  }
  return <Monitor className={className} />;
}

const CATEGORY_LABELS: Record<string, string> = {
  social: 'Social Media',
  professional: 'Professional',
  mobile: 'Mobile Devices',
  desktop: 'Desktop',
};

const CATEGORY_ORDER = ['social', 'professional', 'mobile', 'desktop'];

export default function PresetSelector({ onSelect, currentOptions }: PresetSelectorProps) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    presets: PRESETS.filter((p) => {
      const id = p.id;
      if (cat === 'social') return ['youtube', 'tiktok', 'instagram', 'facebook', 'telegram', 'discord', 'whatsapp'].includes(id);
      if (cat === 'professional') return ['obs', 'premiere', 'davinci', 'final-cut', 'capcut'].includes(id);
      if (cat === 'mobile') return ['android', 'iphone'].includes(id);
      if (cat === 'desktop') return ['windows', 'macos'].includes(id);
      return false;
    }),
  })).filter((g) => g.presets.length > 0);

  return (
    <div className="space-y-4">
      {grouped.map((group) => (
        <div key={group.category}>
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {group.label}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {group.presets.map((preset) => {
              const isActive =
                currentOptions.container === preset.container &&
                currentOptions.videoCodec === preset.videoCodec &&
                currentOptions.width === preset.width;

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelect(preset)}
                  className={`
                    flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm
                    transition-all duration-200
                    ${isActive
                      ? 'border-primary bg-primary/10 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-accent/30'
                    }
                  `}
                  title={preset.description}
                >
                  <div className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                    <PresetIcon id={preset.id} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{preset.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {preset.container.toUpperCase()} · {preset.width || '—'}p
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
