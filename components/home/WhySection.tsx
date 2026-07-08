'use client';

import { Code2, TestTube, Palette, GraduationCap, Building2, Shield } from 'lucide-react';

/**
 * "Why GenCore" section — explains who the platform is for.
 */
const AUDIENCES = [
  {
    icon: Code2,
    title: 'Developers',
    items: ['Generate realistic test data in seconds', 'Multiple output formats per generator', 'Open-source libraries under the hood'],
  },
  {
    icon: TestTube,
    title: 'QA Engineers',
    items: ['Validate edge cases with real-looking data', 'Generate bulk test data for performance testing', 'Consistent, reproducible results'],
  },
  {
    icon: Palette,
    title: 'Designers',
    items: ['Create realistic mockups with real data', 'Test UI with various data formats', 'No more lorem ipsum placeholders'],
  },
  {
    icon: GraduationCap,
    title: 'Students & Educators',
    items: ['Learn data validation patterns', 'Practice with real-world data formats', 'Free and unlimited use'],
  },
  {
    icon: Building2,
    title: 'Businesses',
    items: ['Test CRM and customer systems', 'Generate demo environments', 'Prototype with realistic data'],
  },
  {
    icon: Shield,
    title: 'DevOps',
    items: ['CI/CD pipeline test data generation', 'API testing with valid payloads', 'Automation-friendly outputs'],
  },
];

export default function WhySection() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Why GenCore?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
          One platform for all your test data needs. Built for developers, by developers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {AUDIENCES.map((audience) => {
          const Icon = audience.icon;
          return (
            <div
              key={audience.title}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-sm">
                {audience.title}
              </h3>
              <ul className="space-y-1.5">
                {audience.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
