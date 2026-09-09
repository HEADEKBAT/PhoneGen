'use client';

import { useCallback } from 'react';
import { Check, Upload, Wand2, Palette, SlidersHorizontal, Grid3X3, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ControlMode } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';

/* ─── Step definition ──────────────────────────────────────────────────────── */

interface WorkflowStep {
  id: string;
  label: string;
  icon: React.ElementType;
  status: 'done' | 'current' | 'pending';
  section?: string; // section key for scroll target
}

/* ─── Props ─────────────────────────────────────────────────────────────────── */

interface WorkflowCTAProps {
  controlMode: ControlMode;
  /** The user picked a background other than transparent. */
  backgroundChosen: boolean;
  /** Edge refinement or shadow has been moved off its defaults. */
  settingsAdjusted: boolean;
  isPresetSelected: boolean;
  /** At least one file has been downloaded for this image. */
  hasExported: boolean;
  onScrollToSection?: (sectionKey: string) => void;
}

/* ─── Step Icon ─────────────────────────────────────────────────────────────── */

function StepIcon({
  icon: Icon,
  status,
}: {
  icon: React.ElementType;
  status: WorkflowStep['status'];
}) {
  return (
    <div
      className={cn(
        'size-7 shrink-0 rounded-full flex items-center justify-center transition-colors',
        status === 'done' && 'bg-green-500/15 text-green-600 dark:text-green-400',
        status === 'current' && 'bg-primary/15 text-primary',
        status === 'pending' && 'bg-muted text-muted-foreground',
      )}
      aria-hidden="true"
    >
      {status === 'done' ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <Icon size={14} />
      )}
    </div>
  );
}

/* ─── Step Label ────────────────────────────────────────────────────────────── */

function StepLabel({
  label,
  status,
}: {
  label: string;
  status: WorkflowStep['status'];
}) {
  return (
    <span
      className={cn(
        'text-xs font-medium transition-colors',
        status === 'done' && 'text-green-600 dark:text-green-400',
        status === 'current' && 'text-foreground',
        status === 'pending' && 'text-muted-foreground',
      )}
    >
      {label}
    </span>
  );
}

/* ─── Step Row ──────────────────────────────────────────────────────────────── */

function StepRow({
  step,
  isLast,
  onClick,
  t,
}: {
  step: WorkflowStep;
  isLast: boolean;
  onClick?: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const isClickable = step.section && (step.status === 'pending' || step.status === 'current');

  return (
    <div className="flex gap-3">
      {/* Icon column with connecting line */}
      <div className="flex flex-col items-center">
        <StepIcon icon={step.icon} status={step.status} />
        {!isLast && (
          <div
            className={cn(
              'w-px flex-1 min-h-[8px] mt-1 transition-colors',
              step.status === 'done' ? 'bg-green-500/30' : 'bg-border/50',
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Label + action */}
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center gap-2">
          <StepLabel label={step.label} status={step.status} />
          {step.status === 'done' && (
            <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">
              {t('imageStudio.workflowDone')}
            </span>
          )}
        </div>

        {isClickable && (
          <button
            type="button"
            onClick={onClick}
            className="mt-1 text-[11px] text-primary hover:text-primary/80 font-medium underline underline-offset-2 transition-colors"
          >
            {step.status === 'current'
              ? t('imageStudio.workflowContinue')
              : t('imageStudio.workflowSkipTo')}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function WorkflowCTA({
  controlMode,
  backgroundChosen,
  settingsAdjusted,
  isPresetSelected,
  hasExported,
  onScrollToSection,
}: WorkflowCTAProps) {
  const { t } = useTranslations();

  const handleScrollTo = useCallback(
    (sectionKey: string) => {
      onScrollToSection?.(sectionKey);
    },
    [onScrollToSection],
  );

  const needsPreset = controlMode === 'product' || controlMode === 'social';

  /**
   * Statuses are derived from what the user has actually done. The first step
   * that is not `done` becomes `current`; everything after it stays `pending`.
   */
  const completion: { id: string; label: string; icon: React.ElementType; done: boolean; section?: string }[] = [
    { id: 'upload', label: t('imageStudio.workflowUpload'), icon: Upload, done: true },
    { id: 'remove-bg', label: t('imageStudio.workflowRemoveBg'), icon: Wand2, done: true },
    {
      id: 'replace-bg',
      label: t('imageStudio.workflowReplaceBg'),
      icon: Palette,
      done: backgroundChosen,
      section: 'background',
    },
    {
      id: 'adjust',
      label: t('imageStudio.workflowAdjust'),
      icon: SlidersHorizontal,
      done: settingsAdjusted,
      section: 'settings',
    },
    ...(needsPreset
      ? [
          {
            id: 'preset',
            label:
              controlMode === 'product'
                ? t('imageStudio.workflowProductPreset')
                : t('imageStudio.workflowSocialPreset'),
            icon: Grid3X3,
            done: isPresetSelected,
            section: 'preset',
          },
        ]
      : []),
    {
      id: 'export',
      label: t('imageStudio.workflowExport'),
      icon: Download,
      done: hasExported,
      section: 'export',
    },
  ];

  const firstIncomplete = completion.findIndex((step) => !step.done);

  const steps: WorkflowStep[] = completion.map((step, index) => ({
    id: step.id,
    label: step.label,
    icon: step.icon,
    section: step.section,
    status: step.done ? 'done' : index === firstIncomplete ? 'current' : 'pending',
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <h4 className="text-xs font-semibold text-foreground mb-2">
        {t('imageStudio.workflowTitle')}
      </h4>

      <div role="list" aria-label={t('imageStudio.workflowStepsAria')}>
        {steps.map((step, index) => (
          <div key={step.id} role="listitem">
            <StepRow
              step={step}
              isLast={index === steps.length - 1}
              onClick={step.section ? () => handleScrollTo(step.section!) : undefined}
              t={t}
            />
          </div>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground pt-1">
        {t('imageStudio.workflowHint')}
      </p>
    </div>
  );
}
