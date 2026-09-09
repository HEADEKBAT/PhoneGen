'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/i18n/useTranslations';

/* ─── Context Tab Definitions ───────────────────────────────────────────────── */

/**
 * Tab identity is a stable id, never the visible label — the label is
 * translated and cannot be switched on.
 *
 * The mock page chrome inside each preview (brand name, prices, "Add to Cart")
 * stays untranslated on purpose: it stands in for a generic third-party page,
 * not for this application's own interface.
 */
const PREVIEW_TABS = [
  { id: 'landing', labelKey: 'imageStudio.previewLanding' },
  { id: 'product-card', labelKey: 'imageStudio.previewProductCard' },
  { id: 'marketplace', labelKey: 'imageStudio.previewMarketplace' },
  { id: 'social-post', labelKey: 'imageStudio.previewSocialPost' },
  { id: 'avatar', labelKey: 'imageStudio.previewAvatar' },
  { id: 'presentation', labelKey: 'imageStudio.previewPresentation' },
] as const;

type PreviewTab = (typeof PREVIEW_TABS)[number]['id'];

/* ─── Props ─────────────────────────────────────────────────────────────────── */

interface LivePreviewContextsProps {
  imageUrl: string;
}

/* ─── Tab Button ────────────────────────────────────────────────────────────── */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
        active
          ? 'bg-primary/10 text-primary border-primary/30'
          : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

/* ─── Individual Context Previews ───────────────────────────────────────────── */

function LandingPagePreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-background">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/30">
        <span className="text-xs font-bold text-foreground">Brand</span>
        <div className="flex gap-3">
          <span className="text-[10px] text-muted-foreground">Features</span>
          <span className="text-[10px] text-muted-foreground">Pricing</span>
          <span className="text-[10px] text-muted-foreground">Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div className="sm:flex items-center gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Professional Product Photography
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI-powered background removal for e-commerce, social media, and more.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg bg-primary text-primary-foreground"
            >
              Get Started
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border text-muted-foreground"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 shrink-0">
          <div className="size-28 sm:size-36 rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={imageUrl}
              alt="Product preview on landing page"
              className="size-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCardPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="max-w-52 mx-auto rounded-lg overflow-hidden border border-border bg-card">
      {/* Image */}
      <div className="aspect-square bg-muted">
        <img
          src={imageUrl}
          alt="Product preview in card"
          className="size-full object-contain"
        />
      </div>
      {/* Details */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-xs font-semibold text-foreground truncate">
          Premium Product Name
        </h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400"
              aria-hidden="true"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          ))}
          <span className="text-[10px] text-muted-foreground ml-1">(128)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-foreground">$29.99</span>
          <button
            type="button"
            className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-primary text-primary-foreground"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function MarketplacePreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card">
      <div className="sm:flex">
        {/* Main image */}
        <div className="sm:w-1/2 bg-muted aspect-square sm:aspect-auto">
          <img
            src={imageUrl}
            alt="Product preview in marketplace listing"
            className="size-full object-contain"
          />
        </div>
        {/* Details */}
        <div className="p-4 sm:w-1/2 space-y-3">
          <h3 className="text-sm font-bold text-foreground">Premium Product Name</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">$29.99</span>
            <span className="text-[11px] text-muted-foreground line-through">$49.99</span>
            <span className="text-[10px] font-medium text-green-600 dark:text-green-400">40% off</span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-amber-400"
                aria-hidden="true"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            ))}
            <span className="text-[11px] text-muted-foreground">4.8 (128 reviews)</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            High-quality product with premium features. Perfect for everyday use.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex-1 px-3 py-1.5 text-[11px] font-medium rounded-lg bg-primary text-primary-foreground"
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg border border-border text-muted-foreground"
            >
              Wishlist
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground">
            SKU: PRD-2024-001 &middot; In Stock
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialPostPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="max-w-64 mx-auto rounded-lg overflow-hidden border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="size-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          U
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-foreground truncate">username</p>
          <p className="text-[9px] text-muted-foreground">Location</p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </div>
      {/* Image */}
      <div className="aspect-square bg-muted">
        <img
          src={imageUrl}
          alt="Product preview in social post"
          className="size-full object-contain"
        />
      </div>
      {/* Actions */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground"
            aria-hidden="true"
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </div>
        <p className="text-[11px] font-semibold text-foreground">
          1,234 likes
        </p>
        <p className="text-[11px] text-foreground">
          <span className="font-semibold">username</span> Amazing product shot! #photography
        </p>
      </div>
    </div>
  );
}

function AvatarPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="max-w-64 mx-auto rounded-lg overflow-hidden border border-border bg-card p-4">
      {/* Profile header */}
      <div className="flex items-center gap-3">
        <div className="size-14 rounded-full overflow-hidden border-2 border-border bg-muted shrink-0">
          <img
            src={imageUrl}
            alt="Avatar preview — circular profile picture"
            className="size-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">John Doe</p>
          <p className="text-[11px] text-muted-foreground">Product Designer</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-muted-foreground">1,234 followers</span>
            <span className="text-[10px] text-muted-foreground">&middot;</span>
            <span className="text-[10px] text-muted-foreground">567 following</span>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          className="flex-1 px-3 py-1 text-[10px] font-medium rounded-md bg-primary text-primary-foreground"
        >
          Follow
        </button>
        <button
          type="button"
          className="flex-1 px-3 py-1 text-[10px] font-medium rounded-md border border-border text-muted-foreground"
        >
          Message
        </button>
      </div>
    </div>
  );
}

function PresentationPreview({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card">
      {/* Slide */}
      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center p-6">
        <div className="flex items-center gap-6 max-w-md w-full">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              PRODUCT SHOWCASE
            </div>
            <h3 className="text-sm font-bold text-foreground">
              Transform Your Product Photography
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AI-powered background removal in seconds
            </p>
          </div>
          <div className="size-24 shrink-0 rounded-lg overflow-hidden border border-border/50 bg-muted shadow-sm">
            <img
              src={imageUrl}
              alt="Product preview in presentation slide"
              className="size-full object-contain"
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
        <span className="text-[10px] text-muted-foreground">Slide 3 / 12</span>
        <span className="text-[10px] text-muted-foreground">Image Studio &mdash; 2026</span>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function LivePreviewContexts({ imageUrl }: LivePreviewContextsProps) {
  const { t } = useTranslations();
  const [activeTab, setActiveTab] = useState<PreviewTab>('landing');

  const renderPreview = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPagePreview imageUrl={imageUrl} />;
      case 'product-card':
        return <ProductCardPreview imageUrl={imageUrl} />;
      case 'marketplace':
        return <MarketplacePreview imageUrl={imageUrl} />;
      case 'social-post':
        return <SocialPostPreview imageUrl={imageUrl} />;
      case 'avatar':
        return <AvatarPreview imageUrl={imageUrl} />;
      case 'presentation':
        return <PresentationPreview imageUrl={imageUrl} />;
    }
  };

  const activeLabel = t(
    PREVIEW_TABS.find((tab) => tab.id === activeTab)?.labelKey ?? '',
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-foreground">{t('imageStudio.previewTitle')}</h4>

      {/* Tab switcher */}
      <div
        className="flex flex-wrap gap-1.5"
        role="tablist"
        aria-label={t('imageStudio.previewContextAria')}
      >
        {PREVIEW_TABS.map((tab) => (
          <TabButton
            key={tab.id}
            label={t(tab.labelKey)}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      {/* Preview render area */}
      <div role="tabpanel" aria-label={activeLabel}>
        {renderPreview()}
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        {t('imageStudio.previewHint')}
      </p>
    </div>
  );
}
