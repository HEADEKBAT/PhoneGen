'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

/**
 * CTA section — "Ready to generate?" with link to Phone Generator.
 */
export default function CTASection() {
  const { locale } = useParams<{ locale: string }>() ?? { locale: 'en' };

  return (
    <section className="border-t border-border bg-muted/40 dark:bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
        >
          Ready to generate?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-3 text-base text-muted-foreground max-w-md mx-auto font-light"
        >
          Start with the Phone Generator — create valid phone numbers for 245+ countries in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
            href={`/${locale}/phone-generator`}
            className="group inline-flex items-center gap-2 mt-8 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Get Started
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
