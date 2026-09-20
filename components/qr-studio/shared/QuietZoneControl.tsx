'use client';

import { REQUIRED_QUIET_ZONE } from '@/lib/qr/matrix';
import { useTranslations } from '@/lib/i18n';

interface QuietZoneControlProps {
  value: number;
  onChange: (value: number) => void;
}

/**
 * The empty border, in modules.
 *
 * It was always labelled "modules" and always passed to the drawing library as
 * pixels, which is what that library's `margin` means. At a 300-pixel preview
 * with a version-2 symbol a module is twelve pixels, so the default of four
 * produced a third of one module of clear space — and ISO/IEC 18004 §5.3.1
 * requires four. `buildStylingOptions` does the conversion now; this control
 * just states the unit it was always claiming.
 *
 * The range still starts at zero, because a code pasted into artwork that
 * already has white space around it does not need its own. That choice is the
 * user's to make knowingly, and the readiness panel says what it costs.
 */
export default function QuietZoneControl({ value, onChange }: QuietZoneControlProps) {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          {t('qrStudio.quietZone.label')}
        </label>
        <span className="font-mono text-xs text-muted-foreground">
          {t('qrStudio.quietZone.value', { modules: String(value) })}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={8}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-action [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-action"
      />
      <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
        {t('qrStudio.quietZone.help', { required: String(REQUIRED_QUIET_ZONE) })}
      </p>
    </div>
  );
}
