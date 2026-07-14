'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/config';

const STATUS_CONFIG = {
  done: { icon: CheckCircle2, className: 'text-primary' },
  'in-progress': { icon: Loader2, className: 'text-amber-500' },
  planned: { icon: Clock, className: 'text-muted-foreground' },
} as const;

const STATUS_BADGE = {
  done: { label: 'Done', classes: 'bg-primary/10 text-primary border-primary/10' },
  'in-progress': { label: 'In Progress', classes: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15' },
  planned: { label: 'Planned', classes: 'bg-muted text-muted-foreground border-border/50' },
} as const;

const STAGGER_DELAY = 0.1;

/**
 * Roadmap section — reads directly from Platform Config.
 * Shows all roadmap items with their status indicators.
 */
export default function RoadmapSection() {
  return (
    <section className="border-y border-border bg-muted/40 dark:bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
          >
            Roadmap
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-3 text-base text-muted-foreground max-w-md mx-auto font-light"
          >
            What we&apos;ve built and what&apos;s coming next.
          </motion.p>
        </div>

        <div className="relative space-y-0">
          {/* Vertical line — subtle */}
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />

          {PLATFORM_CONFIG.roadmap.map((item, i) => {
            const config = STATUS_CONFIG[item.status];
            const badge = STATUS_BADGE[item.status];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * STAGGER_DELAY, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative flex items-start gap-5 pb-10 last:pb-0"
              >
                {/* Icon circle */}
                <div className={`relative z-10 flex size-[46px] items-center justify-center rounded-2xl border border-border bg-card shadow-sm ${item.status === 'done' ? 'text-primary' : item.status === 'in-progress' ? 'text-amber-500' : 'text-muted-foreground'}`}>
                  <Icon size={18} className={item.status === 'in-progress' ? 'animate-spin' : ''} />
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-heading font-semibold text-foreground text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <span className={`shrink-0 text-[10px] font-medium px-3 py-1 rounded-full border mt-1.5 ${badge.classes}`}>
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
