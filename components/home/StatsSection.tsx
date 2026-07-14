'use client';

import { motion } from 'framer-motion';
import { Globe, Zap, ShieldCheck, Users } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/config';

const STAGGER_DELAY = 0.1;

/**
 * Statistics section — reads data from Platform Config.
 * Shows key metrics about the platform.
 */
export default function StatsSection() {
  const icons = [Globe, Zap, ShieldCheck, Users];

  return (
    <section className="border-y border-border bg-muted/40 dark:bg-muted/20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          {PLATFORM_CONFIG.stats.map((stat, i) => {
            const Icon = icons[i] || Users;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * STAGGER_DELAY, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center"
              >
                <div className="flex items-center justify-center size-12 mx-auto rounded-2xl bg-primary/8 text-primary mb-4">
                  <Icon size={20} />
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1.5 font-light">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
