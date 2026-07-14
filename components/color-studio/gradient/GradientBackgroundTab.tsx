'use client';

import { useState, useMemo } from 'react';
import { useGradientStudioStore } from '@/lib/stores/gradientStudio';
import { gradientToCSS } from '@/lib/color-studio/gradients';
import { GradientPreviewCard } from './shared/GradientPreviewCard';
import type { BackgroundContext, BackgroundMood } from '@/lib/color-studio/gradientTypes';
import type { GradientConfig } from '@/lib/color-studio/gradientTypes';
import { generateGradientId } from '@/lib/color-studio/gradientTypes';

/* ── Context/mood-aware gradient suggestions ───────────────────────────────── */

interface SuggestionConfig {
  context: BackgroundContext;
  mood: BackgroundMood;
  label: string;
  gradient: () => GradientConfig;
}

function suggestion(
  context: BackgroundContext,
  mood: BackgroundMood,
  label: string,
  stops: { offset: number; color: string }[],
  type: GradientConfig['type'] = 'linear',
  angle = 135,
): SuggestionConfig {
  return {
    context,
    mood,
    label,
    gradient: () => ({
      id: generateGradientId(),
      name: label,
      type,
      angle,
      stops,
      tags: [context, mood],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: { x: 0.5, y: 0.5 },
      shape: 'circle',
      size: 'farthest-corner',
      blendMode: 'normal',
      noise: null,
      mask: null,
      animation: null,
      mesh: null,
      aurora: null,
    }),
  };
}

const SUGGESTIONS: SuggestionConfig[] = [
  // Landing
  suggestion('landing', 'professional', 'Corporate Hero', [{ offset: 0, color: '#1e3a8a' }, { offset: 1, color: '#3b82f6' }]),
  suggestion('landing', 'creative', 'Creative Splash', [{ offset: 0, color: '#667eea' }, { offset: 0.5, color: '#764ba2' }, { offset: 1, color: '#f093fb' }]),
  suggestion('landing', 'calm', 'Calm Landing', [{ offset: 0, color: '#0ea5e9' }, { offset: 1, color: '#38bdf8' }]),
  suggestion('landing', 'energetic', 'Energetic Hero', [{ offset: 0, color: '#ff6b6b' }, { offset: 0.5, color: '#feca57' }, { offset: 1, color: '#48dbfb' }]),
  suggestion('landing', 'luxury', 'Luxury Brand', [{ offset: 0, color: '#bf953f' }, { offset: 0.5, color: '#fcf6ba' }, { offset: 1, color: '#b38728' }]),
  suggestion('landing', 'dark', 'Dark Landing', [{ offset: 0, color: '#0f0c29' }, { offset: 1, color: '#302b63' }]),
  suggestion('landing', 'minimal', 'Clean Landing', [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0f0f0' }]),
  suggestion('landing', 'light', 'Light Hero', [{ offset: 0, color: '#f8fafc' }, { offset: 1, color: '#e2e8f0' }]),
  // Dashboard
  suggestion('dashboard', 'professional', 'Dashboard Blue', [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1e293b' }]),
  suggestion('dashboard', 'calm', 'Calm Dashboard', [{ offset: 0, color: '#1e3a5f' }, { offset: 1, color: '#2d4a7a' }]),
  suggestion('dashboard', 'dark', 'Dark Dashboard', [{ offset: 0, color: '#0a0a0a' }, { offset: 1, color: '#1a1a2e' }]),
  suggestion('dashboard', 'creative', 'Creative Dashboard', [{ offset: 0, color: '#312e81' }, { offset: 1, color: '#4f46e5' }]),
  // Admin Panel
  suggestion('admin-panel', 'professional', 'Admin Navy', [{ offset: 0, color: '#1e293b' }, { offset: 1, color: '#334155' }]),
  suggestion('admin-panel', 'dark', 'Dark Admin', [{ offset: 0, color: '#0f0f0f' }, { offset: 1, color: '#1a1a2e' }]),
  suggestion('admin-panel', 'minimal', 'Clean Admin', [{ offset: 0, color: '#f8fafc' }, { offset: 1, color: '#f1f5f9' }]),
  // Portfolio
  suggestion('portfolio', 'creative', 'Portfolio Vibrant', [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]),
  suggestion('portfolio', 'minimal', 'Portfolio Minimal', [{ offset: 0, color: '#fafafa' }, { offset: 1, color: '#eaeaea' }]),
  suggestion('portfolio', 'dark', 'Portfolio Dark', [{ offset: 0, color: '#0a0a0a' }, { offset: 1, color: '#16213e' }]),
  // Mobile App
  suggestion('mobile-app', 'energetic', 'App Vibrant', [{ offset: 0, color: '#6366f1' }, { offset: 1, color: '#8b5cf6' }]),
  suggestion('mobile-app', 'calm', 'App Calm', [{ offset: 0, color: '#06b6d4' }, { offset: 1, color: '#0ea5e9' }]),
  suggestion('mobile-app', 'light', 'App Light', [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f0f9ff' }]),
  // Documentation
  suggestion('documentation', 'minimal', 'Docs Clean', [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f8fafc' }]),
  suggestion('documentation', 'professional', 'Docs Blue', [{ offset: 0, color: '#1e40af' }, { offset: 0.3, color: '#3b82f6' }, { offset: 1, color: '#93c5fd' }]),
  // Card
  suggestion('card', 'minimal', 'Card Clean', [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f3f4f6' }]),
  suggestion('card', 'creative', 'Card Gradient', [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]),
  // Navbar
  suggestion('navbar', 'professional', 'Navbar Dark', [{ offset: 0, color: '#0f172a' }, { offset: 1, color: '#1e293b' }]),
  suggestion('navbar', 'light', 'Navbar Light', [{ offset: 0, color: '#ffffff' }, { offset: 1, color: '#f1f5f9' }]),
  // CTA
  suggestion('cta', 'energetic', 'CTA Vibrant', [{ offset: 0, color: '#2563eb' }, { offset: 1, color: '#7c3aed' }]),
  suggestion('cta', 'luxury', 'CTA Gold', [{ offset: 0, color: '#bf953f' }, { offset: 1, color: '#fcf6ba' }]),
];

const CONTEXT_LABELS: Record<BackgroundContext, string> = {
  landing: 'Landing Page',
  dashboard: 'Dashboard',
  'admin-panel': 'Admin Panel',
  portfolio: 'Portfolio',
  'mobile-app': 'Mobile App',
  documentation: 'Documentation',
  pricing: 'Pricing Page',
  hero: 'Hero Section',
  blog: 'Blog',
  sidebar: 'Sidebar',
  navbar: 'Navbar',
  card: 'Card',
  button: 'Button',
  cta: 'CTA',
};

const MOOD_LABELS: Record<BackgroundMood, string> = {
  professional: 'Professional',
  creative: 'Creative',
  calm: 'Calm',
  energetic: 'Energetic',
  luxury: 'Luxury',
  minimal: 'Minimal',
  dark: 'Dark',
  light: 'Light',
};

export function GradientBackgroundTab() {
  const setCurrentGradient = useGradientStudioStore((s) => s.setCurrentGradient);
  const pushHistory = useGradientStudioStore((s) => s.pushHistory);
  const currentGradient = useGradientStudioStore((s) => s.currentGradient);

  const [selectedContext, setSelectedContext] = useState<BackgroundContext | null>(null);
  const [selectedMood, setSelectedMood] = useState<BackgroundMood | null>(null);

  const filtered = useMemo(() => {
    let results = SUGGESTIONS;
    if (selectedContext) {
      results = results.filter((s) => s.context === selectedContext);
    }
    if (selectedMood) {
      results = results.filter((s) => s.mood === selectedMood);
    }
    return results;
  }, [selectedContext, selectedMood]);

  const handleSelect = (sug: SuggestionConfig) => {
    pushHistory(currentGradient);
    setCurrentGradient(sug.gradient());
  };

  const contexts = [...new Set(SUGGESTIONS.map((s) => s.context))];
  const moods: BackgroundMood[] = ['professional', 'creative', 'calm', 'energetic', 'luxury', 'minimal', 'dark', 'light'];

  return (
    <div className="space-y-4">
      {/* Context selector */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Context</label>
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedContext(null)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
              selectedContext === null
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border/50 text-muted-foreground hover:border-border'
            }`}
          >
            All
          </button>
          {contexts.map((ctx) => (
            <button
              key={ctx}
              type="button"
              onClick={() => setSelectedContext(selectedContext === ctx ? null : ctx)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
                selectedContext === ctx
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-border'
              }`}
            >
              {CONTEXT_LABELS[ctx]}
            </button>
          ))}
        </div>
      </div>

      {/* Mood selector */}
      <div>
        <label className="text-xs font-semibold text-foreground mb-2 block">Mood</label>
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedMood(null)}
            className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
              selectedMood === null
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-card border-border/50 text-muted-foreground hover:border-border'
            }`}
          >
            All
          </button>
          {moods.map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setSelectedMood(selectedMood === mood ? null : mood)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-full border transition-colors ${
                selectedMood === mood
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border/50 text-muted-foreground hover:border-border'
              }`}
            >
              {MOOD_LABELS[mood]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((sug, idx) => (
          <button
            key={`${sug.context}-${sug.mood}-${idx}`}
            type="button"
            onClick={() => handleSelect(sug)}
            className="group text-left rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-colors bg-card"
          >
            <GradientPreviewCard gradient={sug.gradient()} height={72} />
            <div className="p-2">
              <p className="text-xs font-medium text-foreground truncate">{sug.label}</p>
              <p className="text-[10px] text-muted-foreground truncate">{CONTEXT_LABELS[sug.context]} · {MOOD_LABELS[sug.mood]}</p>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No suggestions for this combination</p>
        </div>
      )}
    </div>
  );
}
