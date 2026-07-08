import { Cpu, Globe, EyeOff, CloudOff, Trash2, Code, type LucideIcon } from 'lucide-react';
import type { SecurityItem } from '@/lib/config/credentialLanding';

interface SecuritySectionProps {
  items: SecurityItem[];
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Cpu, Globe, EyeOff, CloudOff, Trash2, Code,
};

export default function SecuritySection({ items, title, subtitle }: SecuritySectionProps) {
  return (
    <section className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || "Security First"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || "Your credentials never leave your device \u2014 guaranteed"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon] || ShieldCheck;
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <div className="size-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{item.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
