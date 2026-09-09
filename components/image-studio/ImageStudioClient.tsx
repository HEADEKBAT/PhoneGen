'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import { useImageStudioStore } from '@/lib/stores/imageStudio';
import { useTranslations } from '@/lib/i18n/useTranslations';
import type { ImageStudioMode } from '@/lib/image-studio/types';

/* ─── Tab definitions ────────────────────────────────────────────────────── */

interface TabDefinition {
  id: ImageStudioMode;
  labelKey: string;
  descriptionKey: string;
}

const TABS: TabDefinition[] = [
  {
    id: 'background-remover',
    labelKey: 'imageStudio.tabBackgroundRemover',
    descriptionKey: 'imageStudio.tabBackgroundRemoverDesc',
  },
];

/* ─── Lazy-loaded tab components ─────────────────────────────────────────── */

const BackgroundRemoverTab = lazy(() => import('./tools/BackgroundRemoverTab'));

/* ─── Tab content resolver ───────────────────────────────────────────────── */

function TabContent({ mode }: { mode: ImageStudioMode }) {
  switch (mode) {
    case 'background-remover':
      return <BackgroundRemoverTab />;
    default:
      return <BackgroundRemoverTab />;
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

/* ─── Props ─────────────────────────────────────────────────────────------- */

interface ImageStudioClientProps {
  standalone?: boolean;
  initialMode?: ImageStudioMode;
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function ImageStudioClient({
  standalone = true,
  initialMode,
}: ImageStudioClientProps) {
  const { t } = useTranslations();
  const { mode, setMode } = useImageStudioStore();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Read ?mode=X from URL on mount for deep-linking from SEO pages
  useEffect(() => {
    if (initialMode) {
      const validModes = TABS.map((t) => t.id) as string[];
      if (validModes.includes(initialMode)) {
        setMode(initialMode);
        setMounted(true);
        return;
      }
    }
    const modeParam = searchParams?.get('mode');
    if (modeParam) {
      const validModes = TABS.map((t) => t.id) as string[];
      if (validModes.includes(modeParam)) {
        setMode(modeParam as ImageStudioMode);
      }
    }
    setMounted(true);
  }, [searchParams, setMode, initialMode]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const content = (
    <>
      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 border-b border-border/50 pb-0 no-scrollbar">
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
            title={t(tab.descriptionKey)}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="mt-6">
        <Suspense fallback={<TabLoader />}>
          <TabContent mode={mode} />
        </Suspense>
      </div>
    </>
  );

  if (standalone) {
    return <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6">{content}</div>;
  }

  return content;
}
