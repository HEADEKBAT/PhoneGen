import { type LucideIcon } from 'lucide-react';
import { Code, FlaskConical, Store, Warehouse, Palette, GraduationCap } from 'lucide-react';
import type { AudienceCard } from '@/lib/config/barcode';

interface AudienceSectionProps {
  audience: AudienceCard[];
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Code, FlaskConical, Store, Warehouse, Palette, GraduationCap,
};

export default function AudienceSection({ audience, title, subtitle }: AudienceSectionProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || 'Who Is It For'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            {subtitle || 'Every tool for every role — from developers to retail professionals'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {audience.map((card) => {
            const Icon = ICON_MAP[card.id] || Code;
            return (
              <div
                key={card.id}
                className="flex flex-col p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
              >
                <div className="size-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-3 shrink-0">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
