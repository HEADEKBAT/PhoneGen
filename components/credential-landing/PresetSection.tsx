import Link from 'next/link';
import { Wifi, Code, Database, Container, Lock, Key, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { Preset } from '@/lib/config/credentialPresets';

interface PresetSectionProps {
  presets: Preset[];
  locale: string;
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Wifi, Code, Database, Container, Lock, Key, ShieldCheck,
};

export default function PresetSection({ presets, locale, title, subtitle }: PresetSectionProps) {
  const featured = presets.slice(0, 7);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || "Quick Presets"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || "Pre-configured settings for popular services \u2014 one click to generate"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {featured.map((preset) => {
            const Icon = ICON_MAP[preset.icon] || Lock;
            return (
              <Link
                key={preset.id}
                href={`/${locale}/credential-generator/tool?preset=${preset.id}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
              >
                <div className="size-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {preset.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground truncate">{preset.service}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}/credential-generator/tool`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View all presets &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
