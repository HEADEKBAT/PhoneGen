'use client';

/**
 * ThemePreview — live UI preview showing a themed navbar, hero, cards, buttons.
 * Automatically re-renders when the design system or theme mode changes.
 */

import type { DesignSystem } from '@/lib/color-studio/themeBuilder';

interface ThemePreviewProps {
  ds: DesignSystem;
  mode: 'light' | 'dark';
}

export function ThemePreview({ ds, mode }: ThemePreviewProps) {
  const theme = mode === 'light' ? ds.light : ds.dark;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-colors"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        borderColor: theme.border,
      }}
    >
      {/* Navbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: theme.border, backgroundColor: theme.surface }}
      >
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: ds.primary['500'] }} />
          <span className="text-xs font-bold" style={{ color: theme.text }}>GenCore</span>
        </div>
        <nav className="flex gap-4">
          {['Home', 'Products', 'Pricing'].map((item) => (
            <span key={item} className="text-[11px]" style={{ color: theme.muted }}>{item}</span>
          ))}
        </nav>
        <button
          className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{
            backgroundColor: ds.primary['500'],
            color: '#fff',
          }}
        >
          Get Started
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 py-8 text-center space-y-4">
        <h2 className="text-xl font-bold" style={{ color: theme.text }}>
          Build Beautiful Products
        </h2>
        <p
          className="text-xs max-w-sm mx-auto leading-relaxed"
          style={{ color: theme.muted }}
        >
          A complete, accessible color system for your next project.
          Ready for developers and designers.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            className="text-xs font-semibold px-5 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: ds.primary['500'], color: '#fff' }}
          >
            Primary CTA
          </button>
          <button
            className="text-xs font-semibold px-5 py-2 rounded-lg border transition-colors"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            Secondary
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {['Analytics', 'Settings', 'Users'].map((title, i) => (
            <div
              key={title}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div
                className="size-5 rounded-md mb-2"
                style={{ backgroundColor: i === 1 ? ds.secondary['400'] : ds.primary['200'] }}
              />
              <div
                className="text-[11px] font-semibold mb-1"
                style={{ color: theme.text }}
              >
                {title}
              </div>
              <div
                className="h-1.5 rounded-full w-3/4 mb-1.5"
                style={{ backgroundColor: theme.muted + '40' }}
              />
              <div
                className="h-1.5 rounded-full w-1/2"
                style={{ backgroundColor: theme.muted + '30' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
