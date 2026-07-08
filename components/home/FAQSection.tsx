'use client';

import { useState } from 'react';
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
 * FAQ accordion section with JSON-LD structured data.
 */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
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

      <div className="text-center mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex items-center justify-between w-full text-left px-5 py-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-medium text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
