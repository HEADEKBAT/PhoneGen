'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import type { ColorMode } from '@/lib/stores/colorStudio';

/* ─── Tab definitions ────────────────────────────────────────────────────── */

interface TabDefinition {
  id: ColorMode;
  label: string;
  description: string;
}

const TABS: TabDefinition[] = [
  { id: 'random', label: 'Random', description: 'Generate random colors' },
  { id: 'palette', label: 'Palette', description: 'Generate harmonies, shades, tints' },
  { id: 'theme', label: 'Theme', description: 'Create a complete design system from one color' },
  { id: 'gradient', label: 'Gradients', description: 'Create gradient presets' },
  { id: 'converter', label: 'Converter', description: 'Convert between color spaces' },
  { id: 'contrast', label: 'Contrast', description: 'WCAG accessibility checker' },
  { id: 'names', label: 'Names', description: 'Browse color names' },
  { id: 'brands', label: 'Brands', description: 'Brand color palettes' },
  { id: 'tokens', label: 'Tokens', description: 'Export design tokens' },
  { id: 'history', label: 'History', description: 'Color history' },
  { id: 'favorites', label: 'Favorites', description: 'Saved palettes' },
];

/* ─── Lazy-loaded tab components ─────────────────────────────────────────── */

const RandomColorTab = lazy(() => import('./tools/RandomColorTab'));
const PaletteGeneratorTab = lazy(() => import('./tools/PaletteGeneratorTab'));
const ThemeBuilderTab = lazy(() => import('./tools/ThemeBuilderTab'));
const ColorConverterTab = lazy(() => import('./tools/ColorConverterTab'));
const GradientStudioTab = lazy(() => import('./gradient/GradientStudio'));
const ContrastTab = lazy(() => import('./tools/ContrastTab'));
const ColorNamesTab = lazy(() => import('./tools/ColorNamesTab'));
const BrandsTab = lazy(() => import('./tools/BrandsTab'));
const DesignTokensTab = lazy(() => import('./tools/DesignTokensTab'));
const ColorHistoryTab = lazy(() => import('./tools/ColorHistoryTab'));
const ColorFavoritesTab = lazy(() => import('./tools/ColorFavoritesTab'));

/* ─── Tab content resolver ───────────────────────────────────────────────── */

function TabContent({ mode }: { mode: ColorMode }) {
  switch (mode) {
    case 'random':
      return <RandomColorTab />;
    case 'palette':
      return <PaletteGeneratorTab />;
    case 'theme':
      return <ThemeBuilderTab />;
    case 'converter':
      return <ColorConverterTab />;
    case 'gradient':
      return <GradientStudioTab />;
    case 'contrast':
      return <ContrastTab />;
    case 'names':
      return <ColorNamesTab />;
    case 'brands':
      return <BrandsTab />;
    case 'tokens':
      return <DesignTokensTab />;
    case 'history':
      return <ColorHistoryTab />;
    case 'favorites':
      return <ColorFavoritesTab />;
    default:
      return <RandomColorTab />;
  }
}

/* ─── Loading skeleton for lazy tabs ─────────────────────────────────────── */

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function ColorStudioClient() {
  const { mode, setMode } = useColorStudioStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Read ?mode=X from URL on mount for deep-linking from SEO pages
  useEffect(() => {
    const modeParam = searchParams?.get('mode');
    if (modeParam) {
      const validModes = TABS.map((t) => t.id) as string[];
      if (validModes.includes(modeParam)) {
        setMode(modeParam as ColorMode);
      }
    }
    setMounted(true);
  }, [searchParams, setMode]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6">
      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 border-b border-border pb-0 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`shrink-0 px-4 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
              mode === tab.id
                ? 'border-primary text-foreground bg-muted/30'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
            title={tab.description}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mt-6">
        <Suspense fallback={<TabLoader />}>
          <TabContent mode={mode} />
        </Suspense>
      </div>
    </div>
  );
}
