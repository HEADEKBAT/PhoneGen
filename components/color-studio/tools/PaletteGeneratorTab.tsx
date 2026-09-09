'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  RefreshCw, Shuffle, GitFork, Lock, Unlock,
  ChevronDown, ChevronUp, Check, Copy,
  Palette, Sparkles, Sliders, Eye, Download,
  ArrowRight, Star,
} from 'lucide-react';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import { HARMONY_GENERATORS, HARMONY_LABELS } from '@/lib/color-studio/harmonies';
import type { HarmonyType } from '@/lib/color-studio/types';

const HARMONY_KEYS = Object.keys(HARMONY_GENERATORS) as HarmonyType[];
import { PALETTE_STYLES } from '@/lib/color-studio/paletteStyles';
import {
  generateStyledPalette,
  mutatePalette,
  evolvePalette,
  ratePalette,
  generatePaletteByHarmony,
} from '@/lib/color-studio/paletteGenerator';
import type { PaletteRating } from '@/lib/color-studio/paletteGenerator';
import {
  exportPalette,
  PALETTE_EXPORT_FORMATS,
} from '@/lib/color-studio/paletteExport';
import type { PaletteExportFormat } from '@/lib/color-studio/paletteExport';
import { hexToRgb, rgbToHsl, rgbToHsv, rgbToCmyk, rgbToOklch, formatRgb, formatHsl } from '@/lib/color-studio';
import { ColorPicker } from '../shared/ColorPicker';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type GenMode = 'harmony' | 'style' | 'random';

/* ─── Lockable Color Bar ────────────────────────────────────────────────────── */

function LockableColorBar({
  colors,
  locked,
  onToggleLock,
  onColorChange,
}: {
  colors: string[];
  locked: Set<number>;
  onToggleLock: (i: number) => void;
  onColorChange: (i: number, hex: string) => void;
}) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-border/50 h-14">
      {colors.map((hex, i) => (
        <div key={i} className="flex-1 relative group cursor-pointer" style={{ backgroundColor: hex }}>
          {/* Hex label on hover */}
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-black/40 text-white">
            {hex}
          </span>
          {/* Lock toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleLock(i); }}
            className="absolute top-1 right-1 p-0.5 rounded bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
            title={locked.has(i) ? 'Unlock color' : 'Lock color'}
          >
            {locked.has(i) ? <Lock size={10} className="text-white" /> : <Unlock size={10} className="text-white/70" />}
          </button>
          {/* Click to clipboard */}
          <button
            type="button"
            className="absolute bottom-1 left-1 p-0.5 rounded bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => navigator.clipboard.writeText(hex)}
            title="Copy hex"
          >
            <Copy size={9} className="text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Palette Rating Display ─────────────────────────────────────────────────── */

function PaletteRatingCard({ rating }: { rating: PaletteRating }) {
  const items = [
    { label: 'Harmony', value: rating.harmony, color: rating.harmony >= 80 ? 'text-green-500' : rating.harmony >= 50 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Contrast', value: rating.contrast, color: rating.contrast >= 70 ? 'text-green-500' : rating.contrast >= 40 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Accessibility', value: rating.accessibility, color: rating.accessibility >= 80 ? 'text-green-500' : rating.accessibility >= 50 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Balance', value: rating.visualBalance, color: rating.visualBalance >= 70 ? 'text-green-500' : rating.visualBalance >= 40 ? 'text-amber-500' : 'text-red-500' },
    { label: 'Saturation', value: rating.saturation, color: 'text-blue-500' },
    { label: 'Brightness', value: rating.brightness, color: 'text-blue-500' },
  ];

  const tempLabel = rating.temperature > 0.3 ? 'Warm' : rating.temperature < -0.3 ? 'Cold' : 'Neutral';
  const tempColor = rating.temperature > 0.3 ? 'text-orange-500' : rating.temperature < -0.3 ? 'text-blue-500' : 'text-muted-foreground';

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Palette Rating</h4>
        <div className="flex items-center gap-1.5">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-lg font-bold font-mono text-foreground">{rating.overall}</span>
          <span className="text-[10px] text-muted-foreground">/100</span>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center p-2 rounded-lg bg-muted/50">
            <span className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Temperature: <span className={tempColor}>{tempLabel}</span></span>
        <span>Overall: {rating.overall >= 80 ? 'Excellent' : rating.overall >= 60 ? 'Good' : rating.overall >= 40 ? 'Fair' : 'Poor'}</span>
      </div>
    </div>
  );
}

/* ─── Live Previews ──────────────────────────────────────────────────────────── */

const PREVIEW_TABS = ['Landing', 'Dashboard', 'Mobile', 'Card', 'Blog'] as const;
type PreviewTab = (typeof PREVIEW_TABS)[number];

function PalettePreview({ colors, tab }: { colors: string[]; tab: PreviewTab }) {
  const primary = colors[0] || '#6366f1';
  const secondary = colors[1] || '#8b5cf6';
  const accent = colors[2] || '#ec4899';
  const bg = colors[3] || '#f8fafc';
  const text = colors[4] || '#1e293b';

  switch (tab) {
    case 'Landing':
      return (
        <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: bg }}>
          <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: primary }}>
            <span className="text-xs font-bold text-white">Brand</span>
            <div className="flex gap-3">
              <span className="text-[10px] text-white/80">Products</span>
              <span className="text-[10px] text-white/80">Pricing</span>
              <span className="text-[10px] text-white/80">Contact</span>
            </div>
          </div>
          <div className="px-6 py-6 text-center space-y-3">
            <h2 className="text-lg font-bold" style={{ color: text }}>Build Something Great</h2>
            <p className="text-xs" style={{ color: text + 'cc' }}>Modern design meets powerful functionality.</p>
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 text-xs font-medium rounded-lg text-white" style={{ backgroundColor: primary }}>Get Started</button>
              <button className="px-4 py-2 text-xs font-medium rounded-lg border" style={{ borderColor: primary, color: primary }}>Learn More</button>
            </div>
          </div>
        </div>
      );

    case 'Dashboard':
      return (
        <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: bg }}>
          <div className="flex">
            <div className="w-16 p-2 space-y-2" style={{ backgroundColor: secondary }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-2 rounded" style={{ backgroundColor: text + '20' }} />
              ))}
            </div>
            <div className="flex-1 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold" style={{ color: text }}>Dashboard</h3>
                <button className="text-[10px] font-medium px-2 py-1 rounded" style={{ backgroundColor: primary, color: '#fff' }}>+ New</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-2 rounded border" style={{ borderColor: text + '20', backgroundColor: bg }}>
                    <div className="h-4 w-8 rounded mb-1" style={{ backgroundColor: accent }} />
                    <div className="h-2 rounded w-12" style={{ backgroundColor: text + '30' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case 'Mobile':
      return (
        <div className="rounded-lg overflow-hidden border border-border max-w-40 mx-auto" style={{ backgroundColor: bg }}>
          <div className="px-3 py-2 flex items-center justify-between" style={{ backgroundColor: primary }}>
            <span className="text-xs font-bold text-white">App</span>
            <span className="text-[10px] text-white/70">9:41</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex gap-2">
              {[primary, secondary, accent].map((c, i) => (
                <div key={i} className="flex-1 h-6 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="size-4 rounded-full" style={{ backgroundColor: accent }} />
                <div className="flex-1 h-2 rounded" style={{ backgroundColor: text + '20' }} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'Card':
      return (
        <div className="rounded-lg overflow-hidden border border-border max-w-50 mx-auto" style={{ backgroundColor: bg }}>
          <div className="h-16" style={{ backgroundColor: primary }} />
          <div className="p-3 space-y-2">
            <h4 className="text-xs font-semibold" style={{ color: text }}>Card Title</h4>
            <p className="text-[10px]" style={{ color: text + 'aa' }}>This is a sample card showing how the palette works in a real UI context.</p>
            <div className="flex gap-1">
              {[primary, secondary, accent].map((c, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: c }}>Tag</span>
              ))}
            </div>
          </div>
        </div>
      );

    case 'Blog':
      return (
        <div className="rounded-lg overflow-hidden border border-border" style={{ backgroundColor: bg }}>
          <div className="h-20" style={{ backgroundColor: primary }} />
          <div className="p-3 space-y-2">
            <h3 className="text-sm font-bold" style={{ color: text }}>Article Title</h3>
            <div className="flex gap-1">
              {[accent, secondary].map((c, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: c + '20', color: c }}>{i === 0 ? 'Design' : 'Tech'}</span>
            ))}
            </div>
            <p className="text-[11px]" style={{ color: text + 'bb' }}>
              A comprehensive guide to building beautiful, accessible interfaces.
            </p>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: text + '88' }}>
              <span>By Author</span>
              <span>·</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      );
  }
}

/* ─── Export Panel ──────────────────────────────────────────────────────────── */

function PaletteExportPanel({ colors }: { colors: string[] }) {
  const [format, setFormat] = useState<PaletteExportFormat>('hex');
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => exportPalette(colors, format, 'My Palette'), [colors, format]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">Export</h4>
        <div className="flex items-center gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as PaletteExportFormat)}
            className="text-[11px] bg-background border border-input rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {PALETTE_EXPORT_FORMATS.map((f) => (
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
      <pre className="text-[11px] font-mono bg-muted rounded-lg p-4 overflow-x-auto max-h-40 overflow-y-auto text-foreground leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

/* ─── Color Info ─────────────────────────────────────────────────────────────── */

function ColorInfo({ hex }: { hex: string }) {
  const rgb = hexToRgb(hex);
  if (!rgb) return <p className="text-xs text-muted-foreground">Invalid color</p>;

  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const oklch = rgbToOklch(rgb);

  const rows = [
    { label: 'HEX', value: hex },
    { label: 'RGB', value: formatRgb(rgb) },
    { label: 'HSL', value: formatHsl(hsl) },
    { label: 'HSV', value: `hsv(${Math.round(hsv.h * 360)}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)` },
    { label: 'CMYK', value: `cmyk(${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(cmyk.y * 100)}%, ${Math.round(cmyk.k * 100)}%)` },
    { label: 'OKLCH', value: `oklch(${(oklch.l * 100).toFixed(1)}%, ${oklch.c.toFixed(3)}, ${oklch.h.toFixed(1)}°)` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
          <span className="text-[11px] font-medium text-muted-foreground">{row.label}</span>
          <span className="text-[11px] font-mono text-foreground">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function PaletteGeneratorTab() {
  const {
    paletteSubMode, setPaletteSubMode,
    paletteStyleId, setPaletteStyleId,
    paletteHarmonyType, setPaletteHarmonyType,
    setMode,
  } = useColorStudioStore();

  const [seedHex, setSeedHex] = useState('#6366f1');
  const [colors, setColors] = useState<string[]>([]);
  const [locked, setLocked] = useState<Set<number>>(new Set());
  const [evolving, setEvolving] = useState(false);
  const [evolutionStep, setEvolutionStep] = useState(0);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>('Landing');
  const [showExport, setShowExport] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Generate palette
  const generateNewPalette = useCallback(() => {
    const count = 5;

    if (paletteSubMode === 'harmony') {
      const palette = generatePaletteByHarmony(seedHex, paletteHarmonyType);
      const newColors = palette.colors.slice(0, count);
      setColors((prev) => {
        const result = [...prev];
        for (let i = 0; i < count; i++) {
          if (!locked.has(i)) result[i] = newColors[i] || result[i] || seedHex;
        }
        return result;
      });
    } else if (paletteSubMode === 'style') {
      const palette = generateStyledPalette(seedHex, {
        style: PALETTE_STYLES.find(s => s.id === paletteStyleId),
        lockedIndices: locked,
        count,
      });
      setColors(palette.colors.slice(0, count));
    } else {
      // Random mode
      const palette = generateStyledPalette(seedHex, {
        lockedIndices: locked,
        count,
      });
      setColors(palette.colors.slice(0, count));
    }

    setEvolving(false);
    setEvolutionStep(0);
  }, [seedHex, paletteSubMode, paletteHarmonyType, paletteStyleId, locked]);

  // Mutate
  const handleMutate = useCallback(() => {
    setColors((prev) => {
      if (prev.length === 0) return prev;
      const mutated = mutatePalette(prev, 0.2);
      return mutated.map((c, i) => locked.has(i) ? (prev[i] || c) : c);
    });
  }, [locked]);

  // Evolve
  const handleEvolve = useCallback(() => {
    const step = evolutionStep + 1;
    setEvolutionStep(step);
    setColors((prev) => {
      if (prev.length === 0) return prev;
      const evolved = evolvePalette(prev, step, 10);
      return evolved.map((c, i) => locked.has(i) ? (prev[i] || c) : c);
    });
    setEvolving(true);
  }, [evolutionStep, locked]);

  const toggleLock = useCallback((i: number) => {
    setLocked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }, []);

  const allLocked = colors.length > 0 && colors.every((_, i) => locked.has(i));

  // Compute rating
  const rating = useMemo(() => colors.length >= 2 ? ratePalette(colors) : null, [colors]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Palette Generator</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Create professional color palettes. Generate, mutate, evolve, and export.
        </p>
      </div>

      {/* Seed Color */}
      <div className="flex items-center gap-3">
        <ColorPicker hex={seedHex} onChange={setSeedHex} label="Seed color" />
        <div className="text-xs font-mono text-muted-foreground">{seedHex}</div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {(['harmony', 'style', 'random'] as GenMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setPaletteSubMode(mode)}
            className={`flex items-center justify-center gap-1.5 flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
              paletteSubMode === mode
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {mode === 'harmony' && <Palette size={12} />}
            {mode === 'style' && <Sparkles size={12} />}
            {mode === 'random' && <Shuffle size={12} />}
            {mode}
          </button>
        ))}
      </div>

      {/* Harmony Type Selector */}
      {paletteSubMode === 'harmony' && (
        <div className="flex flex-wrap gap-1">
          {HARMONY_KEYS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPaletteHarmonyType(type as HarmonyType)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                paletteHarmonyType === type
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-muted text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              {HARMONY_LABELS[type as HarmonyType]}
            </button>
          ))}
        </div>
      )}

      {/* Style Selector */}
      {paletteSubMode === 'style' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground">Palette Style</h4>
            {PALETTE_STYLES.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAllStyles(!showAllStyles)}
                className="flex items-center gap-0.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {showAllStyles ? 'Show less' : `Show all (${PALETTE_STYLES.length})`}
                {showAllStyles ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(showAllStyles ? PALETTE_STYLES : PALETTE_STYLES.slice(0, 10)).map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setPaletteStyleId(style.id)}
                className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
                  paletteStyleId === style.id
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/30'
                }`}
                title={style.description}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={generateNewPalette}
          disabled={allLocked}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} />
          Generate
        </button>
        {colors.length > 0 && (
          <>
            <button
              type="button"
              onClick={handleMutate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              title="Slightly modify the palette preserving its style"
            >
              <GitFork size={14} />
              Mutate
            </button>
            <button
              type="button"
              onClick={handleEvolve}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
              title="Evolve the palette — each click makes a small change"
            >
              <Shuffle size={14} />
              Evolve{evolving ? ` (${evolutionStep})` : ''}
            </button>
          </>
        )}
      </div>

      {/* Color Bar + Lock */}
      {colors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {locked.size > 0 ? `${locked.size} locked — click lock icon on colors` : 'Click lock icon on any color to fix it'}
            </span>
          </div>
          <LockableColorBar
            colors={colors}
            locked={locked}
            onToggleLock={toggleLock}
            onColorChange={(i, hex) => {
              setColors((prev) => {
                const next = [...prev];
                next[i] = hex;
                return next;
              });
            }}
          />
          <div className="flex flex-wrap gap-1.5">
            {colors.map((hex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigator.clipboard.writeText(hex)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-muted rounded-md hover:bg-border transition-colors text-muted-foreground hover:text-foreground"
              >
                {hex} <Copy size={9} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Palette Rating */}
      {rating && <PaletteRatingCard rating={rating} />}

      {/* Live Preview */}
      {colors.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center justify-between w-full"
          >
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Eye size={14} /> Live Preview
            </h4>
            {showPreview ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showPreview && (
            <div className="space-y-3">
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {PREVIEW_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPreviewTab(tab)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-colors ${
                      previewTab === tab
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <PalettePreview colors={colors} tab={previewTab} />
            </div>
          )}
        </div>
      )}

      {/* Color Info Accordion */}
      {colors.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center justify-between w-full"
          >
            <h4 className="text-xs font-semibold text-foreground">Color Values</h4>
            {showInfo ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showInfo && (
            <div className="space-y-3">
              {colors.map((hex, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-3 rounded" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-medium text-foreground">Color {i + 1}</span>
                  </div>
                  <ColorInfo hex={hex} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export */}
      {colors.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowExport(!showExport)}
            className="flex items-center justify-between w-full"
          >
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Download size={14} /> Export Palette
            </h4>
            {showExport ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
          </button>
          {showExport && <PaletteExportPanel colors={colors} />}
        </div>
      )}

      {/* Interconnection CTA */}
      {colors.length > 0 && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-foreground">Build a complete Design System</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Take your palette to the Theme Builder and generate full design tokens.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode('theme')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Build Design System
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
