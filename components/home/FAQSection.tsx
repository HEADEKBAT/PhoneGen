'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'What is GenCore?',
    a: 'GenCore is a free data generation platform for developers, QA engineers, and testers. Generate realistic phone numbers, user profiles, addresses, credentials, and more — all valid and ready to use in testing and development.',
  },
  {
    q: 'Is GenCore free?',
    a: 'Yes, GenCore is 100% free. No sign-up, no credit card, no limits. We believe test data should be accessible to everyone.',
  },
  {
    q: 'How are phone numbers generated?',
    a: 'Phone numbers are generated using libphonenumber-js, Google\'s phone number handling library. Numbers pass actual validation and match real country formats.',
  },
  {
    q: 'Do you store generated data?',
    a: 'No. All generation happens in your browser. We never store, log, or transmit generated data to any server.',
  },
  {
    q: 'Can I use this for production testing?',
    a: 'Absolutely. GenCore is designed for development, testing, QA, and staging environments. The generated data is realistic and follows proper format rules.',
  },
];

/**
 * FAQ accordion section with JSON-LD structured data and smooth animations.
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20 sm:py-28">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center mb-12"
      >
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Frequently Asked Questions
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="space-y-3"
      >
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-elevated hover:border-primary/15"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex items-center justify-between w-full text-left px-6 py-5 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-foreground pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <ChevronDown size={14} className="shrink-0 text-muted-foreground" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
