'use client';

import {
  ShieldCheck,
  Grid3x3,
  Globe,
  Zap,
  Users,
  Download,
  MapPin,
  Building,
  Mail,
  User,
  Sparkles,
  Key,
  Briefcase,
  Palette,
  Layers,
  Droplets,
  Eye,
  Scan,
} from 'lucide-react';
import type { Feature } from '@/lib/config/productLanding';
import { useTranslations } from '@/lib/i18n';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Grid3x3,
  Globe,
  Zap,
  Users,
  Download,
  MapPin,
  Building,
  Mail,
  User,
  Sparkles,
  Key,
  Briefcase,
  Palette,
  Layers,
  Droplets,
  Eye,
  Scan,
};

interface FeatureGridProps {
  features: Feature[];
}

export default function FeatureGrid({ features }: FeatureGridProps) {
  const { t } = useTranslations();

  if (features.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((feature, i) => {
          const Icon = ICON_MAP[feature.iconName];
          return (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {Icon && <Icon size={18} />}
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-foreground text-sm">
                  {t(feature.titleKey)}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
