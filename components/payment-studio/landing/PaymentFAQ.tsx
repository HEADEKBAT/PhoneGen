'use client';

interface SEOFaq {
  q: string;
  a: string;
}

interface PaymentFAQProps {
  faqs: SEOFaq[];
  title?: string;
}

/**
 * FAQ section for Payment Studio SEO landing pages.
 * Pattern follows CredentialFAQ from credential-landing.
 */
export default function PaymentFAQ({ faqs, title = 'Frequently Asked Questions' }: PaymentFAQProps) {
  if (!faqs.length) return null;

  return (
    <section className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center mb-10">
          {title}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border bg-card overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                {faq.q}
                <svg
                  className="size-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
