import type { AudienceCard } from '@/lib/config/credentialLanding';

interface AudienceSectionProps {
  audience: AudienceCard[];
  title?: string;
  subtitle?: string;
}

const ICONS: Record<string, string> = {
  developers: '👨‍💻',
  qa: '🧪',
  devops: '⚙️',
  everyone: '👤',
};

export default function AudienceSection({ audience, title, subtitle }: AudienceSectionProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {title || 'Who Is It For'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            {subtitle || 'Every tool for every role — from developers to everyday users'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audience.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="text-2xl mb-3">{ICONS[card.id] || '🔑'}</div>
              <h3 className="font-heading font-semibold text-foreground text-base mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                {card.desc}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {card.tools.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[11px] font-medium text-primary"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
