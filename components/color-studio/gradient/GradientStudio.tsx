'use client';

import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import type { GradientSubTab } from '@/lib/stores/gradientStudio';
import { GradientClassicTab } from './GradientClassicTab';
import { GradientMeshTab } from './GradientMeshTab';
import { GradientAuroraTab } from './GradientAuroraTab';
import { GradientBackgroundTab } from './GradientBackgroundTab';
import { GradientAnimationTab } from './GradientAnimationTab';
import { GradientCollectionsTab } from './GradientCollectionsTab';
import { GradientRecipesTab } from './GradientRecipesTab';
import { GradientExportTab } from './GradientExportTab';
import { Palette, Grid3X3, Sparkles, Layout, Play, Library, BookOpen, Code } from 'lucide-react';

const SUB_TABS: { key: GradientSubTab; label: string; icon: React.ReactNode }[] = [
  { key: 'classic', label: 'Classic', icon: <Palette size={14} /> },
  { key: 'mesh', label: 'Mesh', icon: <Grid3X3 size={14} /> },
  { key: 'aurora', label: 'Aurora', icon: <Sparkles size={14} /> },
  { key: 'background', label: 'Background', icon: <Layout size={14} /> },
  { key: 'animation', label: 'Animation', icon: <Play size={14} /> },
  { key: 'collections', label: 'Collections', icon: <Library size={14} /> },
  { key: 'recipes', label: 'Recipes', icon: <BookOpen size={14} /> },
  { key: 'export', label: 'Export', icon: <Code size={14} /> },
];

function TabContent() {
  const activeSubTab = useGradientStudioStore((s) => s.activeSubTab);

  switch (activeSubTab) {
    case 'classic':
      return <GradientClassicTab />;
    case 'mesh':
      return <GradientMeshTab />;
    case 'aurora':
      return <GradientAuroraTab />;
    case 'background':
      return <GradientBackgroundTab />;
    case 'animation':
      return <GradientAnimationTab />;
    case 'collections':
      return <GradientCollectionsTab />;
    case 'recipes':
      return <GradientRecipesTab />;
    case 'export':
      return <GradientExportTab />;
    default:
      return <GradientClassicTab />;
  }
}

export default function GradientStudio() {
  const activeSubTab = useGradientStudioStore((s) => s.activeSubTab);
  const setActiveSubTab = useGradientStudioStore((s) => s.setActiveSubTab);

  return (
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        {SUB_TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeSubTab === key
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        <TabContent />
      </div>
    </div>
  );
}
