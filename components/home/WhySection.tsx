'use client';

import { motion } from 'framer-motion';
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

const STAGGER_DELAY = 0.08;

export default function WhySection() {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
        >
          Why GenCore?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 text-base text-muted-foreground max-w-lg mx-auto font-light"
        >
          One platform for all your test data needs. Built for developers, by developers.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {AUDIENCES.map((audience, i) => {
          const Icon = audience.icon;
          return (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * STAGGER_DELAY, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-elevated hover:border-primary/15"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-base mb-3">
                {audience.title}
              </h3>
              <ul className="space-y-2">
                {audience.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
