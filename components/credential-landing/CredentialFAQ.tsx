'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

interface CredentialFAQProps {
  faqs: FaqItem[];
  title?: string;
}

export default function CredentialFAQ({ faqs, title = 'Frequently Asked Questions' }: CredentialFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <>
      {/* JSON-LD for FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
              },
            })),
          }),
        }}
      />

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-heading font-medium text-foreground text-sm pr-4">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
