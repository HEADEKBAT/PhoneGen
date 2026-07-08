'use client';

import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/config';

const STATUS_CONFIG = {
  done: { icon: CheckCircle2, className: 'text-primary' },
  'in-progress': { icon: Loader2, className: 'text-amber-500' },
  planned: { icon: Clock, className: 'text-muted-foreground' },
} as const;

/**
 * Roadmap section — reads directly from Platform Config.
 * Shows all roadmap items with their status indicators.
 */
export default function RoadmapSection() {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Roadmap
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            What we&apos;ve built and what&apos;s coming next.
          </p>
        </div>

        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

          {PLATFORM_CONFIG.roadmap.map((item) => {
            const config = STATUS_CONFIG[item.status];
            const Icon = config.icon;
            return (
              <div key={item.title} className="relative flex items-start gap-4 pb-8 last:pb-0">
                <div className={`relative z-10 flex size-10 items-center justify-center rounded-full border border-border bg-card ${item.status === 'done' ? 'text-primary' : item.status === 'in-progress' ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  <Icon size={16} className={item.status === 'in-progress' ? 'animate-spin' : ''} />
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <h3 className="font-heading font-semibold text-foreground text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full mt-2 ${
                  item.status === 'done'
                    ? 'bg-primary/10 text-primary'
                    : item.status === 'in-progress'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {item.status === 'done' ? 'Done' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
