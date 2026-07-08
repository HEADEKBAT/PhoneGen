import { ShieldCheck } from 'lucide-react';

interface TrustSectionProps {
  items: string[];
  title?: string;
}

export default function TrustSection({ items, title }: TrustSectionProps) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 text-center">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-8">
          {title || "Trusted by developers worldwide"}
        </h2>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
