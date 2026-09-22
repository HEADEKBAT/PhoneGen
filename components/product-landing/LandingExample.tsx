'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import LandingSection from './LandingSection';

interface LandingExampleProps {
  title: string;
  /** A real line of this product's output. Newlines are kept. */
  text: string;
}

/**
 * One line of what the generator actually produces, with a copy button.
 *
 * The section it replaces centred a 3xl heading over a 32rem card in the
 * middle of a 64rem page, and printed multi-line samples — a user profile, a
 * pair of wallet addresses — as one run-on string, because the text sat in a
 * single `<code>` with no whitespace handling.
 */
export default function LandingExample({ title, text }: LandingExampleProps) {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard access can be refused; the text is selectable either way. */
    }
  };

  return (
    <LandingSection title={title}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
          <span className="text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">
            {t('productLanding.exampleOutput')}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check size={12} className="text-action" aria-hidden="true" />
                {t('productLanding.copied')}
              </>
            ) : (
              <>
                <Copy size={12} aria-hidden="true" />
                {t('productLanding.copyExample')}
              </>
            )}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4">
          <code className="select-all font-mono text-sm leading-relaxed text-foreground">
            {text}
          </code>
        </pre>
      </div>
    </LandingSection>
  );
}
