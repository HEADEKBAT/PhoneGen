import { Key, Scan, KeyRound, Hash, Lock, Shuffle, Fingerprint, type LucideIcon } from 'lucide-react';
import type { FormatBadge } from '@/lib/config/credentialLanding';

interface SupportedFormatsProps {
  formats: FormatBadge[];
  title?: string;
  subtitle?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Key, Scan, KeyRound, Hash, Lock, Shuffle, Fingerprint,
};

export default function SupportedFormats({ formats, title, subtitle }: SupportedFormatsProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || "Supported Formats"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || "Every credential format you need, all in one place"}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {formats.map((fmt) => {
            const Icon = ICON_MAP[fmt.icon] || Hash;
            return (
              <div
                key={fmt.id}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/50 transition-all"
              >
                <Icon size={14} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{fmt.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
