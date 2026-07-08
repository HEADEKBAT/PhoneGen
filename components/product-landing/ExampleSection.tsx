'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface ExampleSectionProps {
  /** Example heading translation key */
  labelKey: string;
  /** Static example text to display (product-specific) */
  exampleText: string;
}

export default function ExampleSection({ labelKey, exampleText }: ExampleSectionProps) {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exampleText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {t(labelKey)}
          </h2>
        </div>
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-medium text-muted-foreground">
                {t('productLanding.exampleOutput')}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    {t('productLanding.copied')}
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    {t('productLanding.copyExample')}
                  </>
                )}
              </button>
            </div>
            <div className="px-4 py-5">
              <code className="text-sm font-mono text-foreground break-all select-all">
                {exampleText}
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
