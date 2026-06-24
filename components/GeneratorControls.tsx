'use client';

import { useState, useMemo } from 'react';
import {
  FlaskConical,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  RefreshCw,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { PhoneFormat, GenerationMode } from '@/lib/phoneGenerator';
import { useTranslations } from '@/lib/i18n';

const QUANTITY_OPTIONS = [1, 5, 10, 25, 50, 100];
const FORMAT_OPTIONS: { id: PhoneFormat; labelKey: string }[] = [
  { id: 'international', labelKey: 'generator.international' },
  { id: 'national', labelKey: 'generator.national' },
  { id: 'e164', labelKey: 'generator.e164' },
  { id: 'rfc3966', labelKey: 'generator.rfc3966' },
];
const MODE_OPTIONS: { id: GenerationMode; labelKey: string; recommended?: boolean }[] = [
  { id: 'random', labelKey: 'generator.modeRandom' },
  { id: 'valid', labelKey: 'generator.modeValid', recommended: true },
  { id: 'example', labelKey: 'generator.modeExample' },
];

export default function GeneratorControls({
  onQuantityChange,
  onFormatChange,
  onModeChange,
  onSeedChange,
  onRegenerate,
  defaultQuantity,
  defaultFormat,
  defaultMode,
}: {
  onQuantityChange: (quantity: number) => void;
  onFormatChange: (format: PhoneFormat) => void;
  onModeChange?: (mode: GenerationMode) => void;
  onSeedChange?: (seed: string) => void;
  onRegenerate?: () => void;
  defaultQuantity?: number;
  defaultFormat?: PhoneFormat;
  defaultMode?: GenerationMode;
}) {
  const { t } = useTranslations();
  const [quantity, setQuantity] = useState(defaultQuantity || 10);
  const [format, setFormat] = useState<PhoneFormat>(defaultFormat || 'international');
  const [mode, setMode] = useState<GenerationMode>(defaultMode || 'valid');
  const [seed, setSeed] = useState('');
  const [showSeed, setShowSeed] = useState(false);

  const formatOptions = useMemo(
    () => FORMAT_OPTIONS.map((opt) => ({ id: opt.id, label: t(opt.labelKey) })),
    [t]
  );

  const modeOptions = useMemo(
    () => MODE_OPTIONS.map((opt) => ({
      id: opt.id,
      label: opt.recommended ? `${t(opt.labelKey)} ★` : t(opt.labelKey),
      recommended: opt.recommended,
    })),
    [t]
  );

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    setQuantity(num);
    onQuantityChange(num);
  };

  const handleFormatChange = (value: string) => {
    const fmt = value as PhoneFormat;
    setFormat(fmt);
    onFormatChange(fmt);
  };

  const handleModeChange = (value: string) => {
    const m = value as GenerationMode;
    setMode(m);
    onModeChange?.(m);
  };

  const handleSeedChange = (value: string) => {
    setSeed(value);
    onSeedChange?.(value);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      {/* Main row: controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Quantity */}
        <fieldset className="min-w-0">
          <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
            {t('generator.quantity')}
          </legend>
          <Select value={String(quantity)} onValueChange={handleQuantityChange}>
            <SelectTrigger className="h-10 w-24 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUANTITY_OPTIONS.map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        {/* Mode */}
        <fieldset className="min-w-0">
          <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
            {t('generator.mode')}
          </legend>
          <Select value={mode} onValueChange={handleModeChange}>
            <SelectTrigger className="h-10 w-36 sm:w-40 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modeOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        {/* Format */}
        <fieldset className="min-w-0">
          <legend className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
            {t('generator.format')}
          </legend>
          <Select value={format} onValueChange={handleFormatChange}>
            <SelectTrigger className="h-10 w-40 sm:w-44 rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </fieldset>

        {/* Spacer */}
        <div className="flex-1 min-w-2" />

        {/* Seed Toggle */}
        <TooltipProvider delayDuration={100}>
          <div className="flex items-center gap-1.5 h-10 self-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSeed(!showSeed)}
              className={`h-10 rounded-xl gap-1.5 px-3 transition-all ${
                showSeed
                  ? 'border-primary/30 bg-primary/5 text-primary hover:bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FlaskConical size={14} />
              <span className="text-xs hidden sm:inline">
                {showSeed ? t('generator.hideSeed') : t('generator.seedToggle')}
              </span>
              {showSeed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center size-6 rounded-full text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label={t('generator.seedHint')}
                >
                  <CircleHelp size={13} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-56 text-xs rounded-xl">
                {t('generator.seedHint')}
              </TooltipContent>
            </Tooltip>

            <span className="w-px h-5 bg-border mx-1 hidden sm:block" aria-hidden="true" />

            {/* Regenerate Button */}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onRegenerate?.()}
              className="h-10 rounded-xl gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-none transition-all active:scale-[0.97]"
            >
              <RefreshCw size={14} />
              <span>{t('generator.regenerate')}</span>
            </Button>
          </div>
        </TooltipProvider>
      </div>

      {/* Seed input (collapsible) */}
      {showSeed && (
        <div className="mt-3 animate-in slide-in-from-top-1 duration-200">
          <label
            htmlFor="seed-input"
            className="block text-xs font-medium text-muted-foreground mb-1.5 ml-1"
          >
            {t('generator.seedLabel')}
          </label>
          <div className="relative max-w-xs">
            <FlaskConical
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 pointer-events-none"
            />
            <Input
              id="seed-input"
              type="text"
              placeholder={t('generator.seedPlaceholder')}
              value={seed}
              onChange={(e) => handleSeedChange(e.target.value)}
              className="h-10 pl-8 rounded-xl text-sm border-primary/20 focus-visible:border-primary/40 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
