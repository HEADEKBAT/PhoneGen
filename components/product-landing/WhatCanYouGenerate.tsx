'use client';

import Link from 'next/link';
import { Smartphone, Phone, PhoneOff, Radio, ArrowRight } from 'lucide-react';
import type { ToolType } from '@/lib/config/productLanding';
import { useTranslations } from '@/lib/i18n';

const TOOL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  mobile: Smartphone,
  fixedLine: Phone,
  tollFree: PhoneOff,
  voip: Radio,
};

interface WhatCanYouGenerateProps {
  toolTypes: ToolType[];
  locale: string;
  productSlug: string;
  /** URL pattern using {id} as placeholder for toolType.id (e.g. "/ru/phone-generator/US?mode={id}") */
  hrefPattern?: string;
}

export default function WhatCanYouGenerate({
  toolTypes,
  locale,
  productSlug,
  hrefPattern,
}: WhatCanYouGenerateProps) {
  const { t } = useTranslations();

  if (toolTypes.length === 0) return null;

  const hrefFor = (toolType: ToolType): string =>
    hrefPattern
      ? hrefPattern.replace('{id}', toolType.id)
      : `/${locale}/${productSlug}/${toolType.slug}`;

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="text-center mb-10">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t('productLanding.whatCanYouGenerate')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {t('productLanding.whatCanYouGenerateDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolTypes.map((toolType) => {
          const Icon = TOOL_ICONS[toolType.id];

          if (toolType.enabled) {
            return (
              <Link
                key={toolType.id}
                href={hrefFor(toolType)}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                    {Icon && <Icon size={18} />}
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary whitespace-nowrap">
                    {t('productLanding.live')}
                  </span>
                </div>
                <h3 className="mt-4 font-heading font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  {t(toolType.labelKey)}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {t(toolType.descKey)}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('productLanding.open')}
                  <ArrowRight size={12} />
                </div>
              </Link>
            );
          }

          return (
            <div
              key={toolType.id}
              className="rounded-xl border border-border bg-card/50 p-5 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {Icon && <Icon size={18} />}
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                  {t('productLanding.comingSoon')}
                </span>
              </div>
              <h3 className="mt-4 font-heading font-semibold text-muted-foreground text-sm">
                {t(toolType.labelKey)}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground/60 leading-relaxed line-clamp-2">
                {t(toolType.descKey)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
