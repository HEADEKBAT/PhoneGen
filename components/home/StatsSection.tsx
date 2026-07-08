'use client';

import { Globe, Zap, ShieldCheck, Users } from 'lucide-react';
import { PLATFORM_CONFIG } from '@/lib/config';

const STAT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, Zap, ShieldCheck, Users,
};

/**
 * Statistics section — reads data from Platform Config.
 * Shows key metrics about the platform.
 */
export default function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {PLATFORM_CONFIG.stats.map((stat, i) => {
            const icons = [Globe, Zap, ShieldCheck, Users];
            const Icon = icons[i] || Users;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center size-10 mx-auto rounded-lg bg-primary/10 text-primary mb-3">
                  <Icon size={18} />
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
