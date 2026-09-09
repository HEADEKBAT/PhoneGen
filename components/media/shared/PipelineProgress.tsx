'use client';

import type { PipelineStage } from '@/lib/media';
import { Check, Loader2 } from 'lucide-react';

interface PipelineProgressProps {
  currentStage: PipelineStage;
  progress: number;
  message: string;
}

const STAGES: { id: PipelineStage; label: string }[] = [
  { id: 'upload', label: 'Upload' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'prepare', label: 'Prepare' },
  { id: 'encode', label: 'Encode' },
  { id: 'optimize', label: 'Optimize' },
  { id: 'finalize', label: 'Finalize' },
  { id: 'done', label: 'Done' },
];

const STAGE_ORDER: PipelineStage[] = ['upload', 'analyze', 'prepare', 'encode', 'optimize', 'finalize', 'done'];

export default function PipelineProgress({ currentStage, progress, message }: PipelineProgressProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="w-full space-y-4">
      {/* Pipeline stages */}
      <div className="flex items-center justify-between">
        {STAGES.map((stage, idx) => {
          const isComplete = currentIndex > idx;
          const isCurrent = currentStage === stage.id;
          const isFuture = currentIndex < idx;

          return (
            <div key={stage.id} className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300
                  ${isComplete ? 'bg-primary text-primary-foreground' : ''}
                  ${isCurrent ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 animate-pulse' : ''}
                  ${isFuture ? 'bg-muted text-muted-foreground' : ''}
                `}
              >
                {isComplete ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Message */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        {currentStage !== 'done' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        <span>{message}</span>
        <span className="text-xs font-mono">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
