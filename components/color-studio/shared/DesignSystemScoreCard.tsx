'use client';

/**
 * DesignSystemScoreCard — animated score display for the 6 design system metrics.
 */

import type { DesignSystemScore } from '@/lib/color-studio/themeBuilder';

interface DesignSystemScoreCardProps {
  score: DesignSystemScore;
}

function ScoreItem({
  label,
  value,
  display,
  suffix,
  color,
}: {
  label: string;
  value: number;
  display?: string;
  suffix: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card text-center">
      <div className={`text-lg font-bold font-mono ${color}`}>
        {display || `${value}${suffix}`}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight text-center">{label}</div>
    </div>
  );
}

export function DesignSystemScoreCard({ score }: DesignSystemScoreCardProps) {
  const items = [
    {
      label: 'Accessibility',
      value: score.accessibility,
      suffix: '%',
      color: score.accessibility >= 90 ? 'text-green-500' : score.accessibility >= 70 ? 'text-amber-500' : 'text-red-500',
    },
    {
      label: 'Contrast',
      value: 0,
      display: score.contrastLevel.toUpperCase(),
      suffix: '',
      color: score.contrastLevel === 'AAA' ? 'text-green-500' : score.contrastLevel === 'AA' ? 'text-green-500' : score.contrastLevel === 'fail' ? 'text-red-500' : 'text-amber-500',
    },
    {
      label: 'Visual\nBalance',
      value: score.visualBalance,
      suffix: '%',
      color: score.visualBalance >= 90 ? 'text-green-500' : score.visualBalance >= 70 ? 'text-amber-500' : 'text-red-500',
    },
    {
      label: 'Brand',
      value: score.brandConsistency,
      suffix: '%',
      color: score.brandConsistency >= 90 ? 'text-green-500' : score.brandConsistency >= 70 ? 'text-amber-500' : 'text-red-500',
    },
    {
      label: 'Readability',
      value: score.readability,
      suffix: '%',
      color: score.readability >= 90 ? 'text-green-500' : score.readability >= 70 ? 'text-amber-500' : 'text-red-500',
    },
    {
      label: 'Dev\nReady',
      value: score.developerReady,
      suffix: '%',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {items.map((item) => (
        <ScoreItem key={item.label} {...item} />
      ))}
    </div>
  );
}
