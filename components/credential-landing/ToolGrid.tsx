import Link from 'next/link';
import {
  Key, KeyRound, Hash, Clock, Scan, Lock, Webhook, Shuffle, Fingerprint, ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import type { LandingTool } from '@/lib/config/credentialLanding';

interface ToolGridProps {
  tools: LandingTool[];
  locale: string;
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Key, KeyRound, Hash, Clock, Scan, Lock, Webhook, Shuffle, Fingerprint, ShieldCheck,
};

export default function ToolGrid({ tools, locale, title, subtitle }: ToolGridProps) {
  return (
    <section id="tools" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || "Popular Tools"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || "Choose from 11 powerful credential generators"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tools.map((tool) => {
            const Icon = ICON_MAP[tool.icon] || Key;
            return (
              <Link
                key={tool.id}
                href={`/${locale}/credential-generator/tool?mode=${tool.mode}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <div className="size-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                  {tool.label}
                </span>
                <span className="text-[11px] text-muted-foreground text-center leading-tight line-clamp-2">
                  {tool.desc}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
