'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  Sun,
  Moon,
  Heart,
  ChevronDown,
  ChevronUp,
  Check,
  Copy,
} from 'lucide-react';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { useColorFavoritesStore } from '@/lib/stores/colorFavorites';
import { generateDesignSystem } from '@/lib/color-studio/themeBuilder';
import { generateScale, generateNeutralScale } from '@/lib/color-studio/themeBuilder';
import type { DesignSystem, DesignSystemScore } from '@/lib/color-studio/themeBuilder';
import { PALETTE_STYLES } from '@/lib/color-studio/paletteStyles';
import { PROJECT_PRESETS } from '@/lib/color-studio/projectPresets';
import { BRAND_PERSONALITIES } from '@/lib/color-studio/brandPersonality';
import { scoreDesignSystem } from '@/lib/color-studio/designSystemScoring';
import { generateTokens } from '@/lib/color-studio/tokens';
import type { TokenFormat } from '@/lib/color-studio/types';
import { hexToRgb, contrastRatio } from '@/lib/color-studio';
import { ColorPicker } from '../shared/ColorPicker';

/* ─── Color Scale Display ─────────────────────────────────────────────────── */

function ScaleDisplay({ label, colors }: { label: string; colors: Record<string, string> }) {
  const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-foreground">{label}</h4>
      <div className="flex rounded-lg overflow-hidden border border-border/50 h-10">
        {steps.map((step) => {
          const hex = colors[step] || '#ccc';
          return (
            <div
              key={step}
              className="flex-1 relative group cursor-pointer"
              style={{ backgroundColor: hex }}
              onClick={() => navigator.clipboard.writeText(hex)}
              title={`${step}: ${hex}`}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono bg-black/40 text-white">
                {hex}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between px-0.5">
        {steps.map((step) => (
          <span key={step} className="text-[10px] font-mono text-muted-foreground">{step}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Semantic Color Grid ─────────────────────────────────────────────────── */

function SemanticColorGrid({ ds }: { ds: DesignSystem }) {
  const semanticColors = [
    { label: 'Success', hex: ds.success },
    { label: 'Warning', hex: ds.warning },
    { label: 'Danger', hex: ds.danger },
    { label: 'Info', hex: ds.info },
  ];

  const bgColors = [
    { label: 'Background', hex: ds.light.background },
    { label: 'Surface', hex: ds.light.surface },
    { label: 'Card', hex: ds.light.card },
    { label: 'Border', hex: ds.light.border },
    { label: 'Text', hex: ds.light.text },
    { label: 'Muted', hex: ds.light.muted },
  ];

  const getWCAGBadge = (fg: string, bg: string) => {
    const fgRgb = hexToRgb(fg);
    const bgRgb = hexToRgb(bg);
    if (!fgRgb || !bgRgb) return null;
    const ratio = contrastRatio(fgRgb, bgRgb);
    if (ratio >= 7) return { level: 'AAA', ratio: ratio.toFixed(1) };
    if (ratio >= 4.5) return { level: 'AA', ratio: ratio.toFixed(1) };
    if (ratio >= 3) return { level: 'AA-large', ratio: ratio.toFixed(1) };
    return { level: 'FAIL', ratio: ratio.toFixed(1) };
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Semantic Colors</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {semanticColors.map(({ label, hex }) => (
            <div
              key={label}
              className="flex items-center gap-2 p-2 rounded-lg border border-border"
            >
              <div
                className="size-6 rounded-md cursor-pointer"
                style={{ backgroundColor: hex }}
                onClick={() => navigator.clipboard.writeText(hex)}
                title={hex}
              />
              <div className="min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{label}</div>
                <div className="text-[10px] font-mono text-muted-foreground truncate">{hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2">Theme Tokens</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {bgColors.map(({ label, hex }) => {
            const textBadge = getWCAGBadge(ds.light.text, hex);
            return (
              <div
                key={label}
                className="flex items-center gap-2 p-2 rounded-lg border border-border"
              >
                <div
                  className="size-6 rounded-md cursor-pointer shrink-0"
                  style={{ backgroundColor: hex }}
                  onClick={() => navigator.clipboard.writeText(hex)}
                  title={hex}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-foreground truncate">{label}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-muted-foreground truncate">{hex}</span>
                    {textBadge && (
                      <span className={`text-[9px] font-semibold px-1 py-0.5 rounded ${
                        textBadge.level === 'AAA' ? 'bg-green-500/10 text-green-600' :
                        textBadge.level === 'AA' ? 'bg-green-500/10 text-green-600' :
                        textBadge.level === 'FAIL' ? 'bg-red-500/10 text-red-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        {textBadge.level}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Design System Score ─────────────────────────────────────────────────── */

function DesignSystemScoreCard({ score }: { score: DesignSystemScore }) {
  const items = [
    { label: 'Accessibility', value: score.accessibility, suffix: '%', color: score.accessibility >= 90 ? 'text-green-500' : score.accessibility >= 70 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Contrast', value: 0, display: score.contrastLevel.toUpperCase(), suffix: '', color: score.contrastLevel === 'AAA' ? 'text-green-500' : score.contrastLevel === 'AA' ? 'text-green-500' : 'text-red-500' },
    { label: 'Visual Balance', value: score.visualBalance, suffix: '%', color: score.visualBalance >= 90 ? 'text-green-500' : score.visualBalance >= 70 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Brand', value: score.brandConsistency, suffix: '%', color: score.brandConsistency >= 90 ? 'text-green-500' : score.brandConsistency >= 70 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Readability', value: score.readability, suffix: '%', color: score.readability >= 90 ? 'text-green-500' : score.readability >= 70 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Dev Ready', value: score.developerReady, suffix: '%', color: 'text-green-500' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border bg-card text-center"
        >
          <div className={`text-lg font-bold font-mono ${item.color}`}>
            {item.display || `${item.value}${item.suffix}`}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Style/Project/Personality Selector Grid ─────────────────────────────── */

interface SelectorItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

function SelectorGrid<T extends SelectorItem>({
  items,
  selectedId,
  onSelect,
  label,
  visibleCount = 8,
}: {
  items: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
  visibleCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? items : items.slice(0, visibleCount);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">{label}</h4>
        {items.length > visibleCount && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAll ? 'Show less' : `Show all (${items.length})`}
            {showAll ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {displayed.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors text-left ${
              selectedId === item.id
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30'
            }`}
            title={item.description}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Theme Preview (Live UI) ─────────────────────────────────────────────── */

function ThemePreview({ ds, mode }: { ds: DesignSystem; mode: 'light' | 'dark' }) {
  const theme = mode === 'light' ? ds.light : ds.dark;
  const isDark = mode === 'dark';

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        borderColor: theme.border,
      }}
    >
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full" style={{ backgroundColor: ds.primary['500'] }} />
          <span className="text-xs font-semibold" style={{ color: theme.text }}>GenCore</span>
        </div>
        <nav className="flex gap-3">
          {['Home', 'Products', 'Pricing'].map((item) => (
            <span key={item} className="text-[11px]" style={{ color: theme.muted }}>{item}</span>
          ))}
        </nav>
        <button
          className="text-[11px] font-medium px-3 py-1 rounded-lg"
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
        <p className="text-xs max-w-md mx-auto" style={{ color: theme.muted }}>
          A complete color system for your next project. Accessible, consistent, developer-ready.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            className="text-xs font-medium px-4 py-2 rounded-lg"
            style={{ backgroundColor: ds.primary['500'], color: '#fff' }}
          >
            Primary CTA
          </button>
          <button
            className="text-xs font-medium px-4 py-2 rounded-lg border"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            Secondary
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: theme.card, borderColor: theme.border }}
            >
              <div className="size-6 rounded-md mb-2" style={{ backgroundColor: ds.primary['200'] }} />
              <div className="h-2 rounded-full w-3/4 mb-2" style={{ backgroundColor: theme.muted + '40' }} />
              <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: theme.muted + '30' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Token Export Panel ──────────────────────────────────────────────────── */

function ThemeTokensPanel({ ds }: { ds: DesignSystem }) {
  const [format, setFormat] = useState<TokenFormat>('css');
  const [copied, setCopied] = useState(false);

  const flatColors = useMemo(() => {
    const colors: Record<string, string> = {};
    for (const [role, scale] of Object.entries({
      primary: ds.primary,
      secondary: ds.secondary,
      accent: ds.accent,
      neutral: ds.neutral,
    })) {
      for (const [step, hex] of Object.entries(scale)) {
        colors[`${role}-${step}`] = hex;
      }
    }
    colors.success = ds.success;
    colors.warning = ds.warning;
    colors.danger = ds.danger;
    colors.info = ds.info;

    for (const [mode, prefix] of Object.entries({ light: 'light-', dark: 'dark-' })) {
      const theme = mode === 'light' ? ds.light : ds.dark;
      for (const [key, hex] of Object.entries(theme)) {
        colors[`${prefix}${key}`] = hex;
      }
    }
    return colors;
  }, [ds]);

  const code = useMemo(() => generateTokens(flatColors, format), [flatColors, format]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formats: { value: TokenFormat; label: string }[] = [
    { value: 'css', label: 'CSS Variables' },
    { value: 'tailwind', label: 'Tailwind Config' },
    { value: 'scss', label: 'SCSS Variables' },
    { value: 'less', label: 'LESS Variables' },
    { value: 'style-dictionary', label: 'Style Dictionary' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Design Tokens</h4>
        <div className="flex items-center gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as TokenFormat)}
            className="text-[11px] bg-background border border-input rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <pre className="text-[11px] font-mono bg-muted rounded-lg p-4 overflow-x-auto max-h-48 overflow-y-auto text-foreground leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

/* ─── Main Theme Builder Tab ──────────────────────────────────────────────── */

export default function ThemeBuilderTab() {
  const {
    themePrimary, setThemePrimary,
    themeStyle, setThemeStyle,
    themeProject, setThemeProject,
    themePersonality, setThemePersonality,
    themeMode, setThemeMode,
    designSystem, setDesignSystem,
  } = useColorStudioStore();

  const { addFavorite } = useColorFavoritesStore();
  const [favoriteName, setFavoriteName] = useState('My Theme');
  const [showSections, setShowSections] = useState({
    style: true,
    project: true,
    personality: true,
    preview: true,
    tokens: true,
  });

  // Regenerate design system when inputs change
  useEffect(() => {
    const style = PALETTE_STYLES.find((s) => s.id === themeStyle);
    const project = PROJECT_PRESETS.find((p) => p.id === themeProject);
    const personality = BRAND_PERSONALITIES.find((p) => p.id === themePersonality);

    const ds = generateDesignSystem(themePrimary, {
      style: style?.modifiers,
      project: project?.adjustments,
      personality: personality?.modifiers,
    });

    setDesignSystem(ds);
  }, [themePrimary, themeStyle, themeProject, themePersonality, setDesignSystem]);

  const handleSave = () => {
    if (!designSystem) return;
    const allColors = [
      ...Object.values(designSystem.primary),
      ...Object.values(designSystem.neutral),
      designSystem.success,
      designSystem.warning,
      designSystem.danger,
      designSystem.info,
    ];
    addFavorite(favoriteName || `Theme ${new Date().toLocaleDateString()}`, allColors);
  };

  const toggleSection = (key: keyof typeof showSections) => {
    setShowSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!designSystem) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Theme Builder</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate a complete design system from one color. Choose a palette style, project type, and brand personality.
        </p>
      </div>

      {/* Step 1: Primary Color */}
      <div className="flex items-center gap-3">
        <ColorPicker hex={themePrimary} onChange={setThemePrimary} label="Primary color" />
        <div className="text-xs font-mono text-muted-foreground">{themePrimary}</div>
      </div>

      {/* Step 2: Palette Style */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('style')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold text-foreground">2. Palette Style</h4>
          {showSections.style ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {showSections.style && (
          <SelectorGrid
            items={PALETTE_STYLES}
            selectedId={themeStyle}
            onSelect={setThemeStyle}
            label="Choose an aesthetic"
            visibleCount={10}
          />
        )}
      </div>

      {/* Step 3: Project Preset */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('project')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold text-foreground">3. Project Type</h4>
          {showSections.project ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {showSections.project && (
          <SelectorGrid
            items={PROJECT_PRESETS}
            selectedId={themeProject}
            onSelect={setThemeProject}
            label="What are you building?"
            visibleCount={10}
          />
        )}
      </div>

      {/* Step 4: Brand Personality */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('personality')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold text-foreground">4. Brand Personality</h4>
          {showSections.personality ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {showSections.personality && (
          <SelectorGrid
            items={BRAND_PERSONALITIES}
            selectedId={themePersonality}
            onSelect={setThemePersonality}
            label="Choose an emotional tone"
            visibleCount={10}
          />
        )}
      </div>

      {/* Generated Theme */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        {/* Theme controls */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Generated Design System</h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                themeMode === 'light'
                  ? 'bg-card text-foreground border-border'
                  : 'bg-muted text-muted-foreground border-border'
              }`}
            >
              {themeMode === 'light' ? <Sun size={14} /> : <Moon size={14} />}
              {themeMode === 'light' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => {
                const name = prompt('Save theme as:', favoriteName);
                if (name) {
                  setFavoriteName(name);
                  handleSave();
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Heart size={14} />
              Save
            </button>
          </div>
        </div>

        {/* Design System Score */}
        <DesignSystemScoreCard score={designSystem.score} />

        {/* Color Scales */}
        <div className="space-y-4">
          <ScaleDisplay label="Primary" colors={designSystem.primary} />
          <ScaleDisplay label="Secondary" colors={designSystem.secondary} />
          <ScaleDisplay label="Accent" colors={designSystem.accent} />
          <ScaleDisplay label="Neutral" colors={designSystem.neutral} />
        </div>

        {/* Semantic Colors */}
        <SemanticColorGrid ds={designSystem} />
      </div>

      {/* Live Preview Section */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('preview')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold text-foreground">Live Preview</h4>
          {showSections.preview ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {showSections.preview && (
          <ThemePreview ds={designSystem} mode={themeMode} />
        )}
      </div>

      {/* Token Export */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <button
          type="button"
          onClick={() => toggleSection('tokens')}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold text-foreground">Developer Export</h4>
          {showSections.tokens ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
        </button>
        {showSections.tokens && (
          <ThemeTokensPanel ds={designSystem} />
        )}
      </div>
    </div>
  );
}
