'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SEOFaq } from '@/lib/config/barcodeSEOPages';

interface BarcodeSEOFAQProps {
  faqs: SEOFaq[];
  title?: string;
}

export default function BarcodeSEOFAQ({ faqs, title }: BarcodeSEOFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title || 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
