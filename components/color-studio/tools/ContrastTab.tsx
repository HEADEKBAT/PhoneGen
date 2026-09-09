'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  Check, Copy, AlertTriangle, ArrowRight, FileText,
  Eye, EyeOff, Download,
} from 'lucide-react';
import { useColorStudioStore } from '@/lib/stores/colorStudio';
import type { ContrastView } from '@/lib/stores/colorStudio';
import {
  hexToRgb,
  rgbToHex,
  contrastRatio,
  getWCAGLevel,
  passesWCAG,
  accessibleTextColor,
} from '@/lib/color-studio';
import {
  checkPair,
  checkAllTextRoles,
  checkAllComponents,
  generateReport,
  findAccessibleColor,
  auditTheme,
  exportReport,
  REPORT_EXPORT_FORMATS,
  getThemeAuditPairs,
} from '@/lib/color-studio/contrastReport';
import type {
  AccessibilityReport,
  ThemeAuditResult,
  TextRole,
  UIComponent,
} from '@/lib/color-studio/contrastReport';
import type { ReportExportFormat } from '@/lib/color-studio/contrastReport';
import {
  simulateBlindness,
  BLINDNESS_LABELS,
} from '@/lib/color-studio/blindness';
import type { ColorBlindnessType } from '@/lib/color-studio/types';

const BLINDNESS_TYPES: { id: ColorBlindnessType; label: string }[] = [
  { id: 'protanopia', label: 'Protanopia' },
  { id: 'deuteranopia', label: 'Deuteranopia' },
  { id: 'tritanopia', label: 'Tritanopia' },
  { id: 'achromatopsia', label: 'Achromatopsia' },
];
import { ColorPicker } from '../shared/ColorPicker';

/* ─── Helpers ───────────────────────────────────────────────────────────────── */

function ratioColor(ratio: number): string {
  if (ratio >= 7) return 'text-green-500';
  if (ratio >= 4.5) return 'text-amber-500';
  if (ratio >= 3) return 'text-orange-500';
  return 'text-red-500';
}

function ratioBg(ratio: number): string {
  if (ratio >= 7) return 'bg-green-500/10 border-green-500/20';
  if (ratio >= 4.5) return 'bg-amber-500/10 border-amber-500/20';
  if (ratio >= 3) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function WCAGResultRow({
  label,
  ratio,
  largeText,
}: {
  label: string;
  ratio: number;
  largeText: boolean;
}) {
  const level = getWCAGLevel(ratio, largeText);
  const passesAA = level === 'AA' || level === 'AAA';
  const passesAAA = level === 'AAA';

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-mono font-medium ${ratioColor(ratio)}`}>
          {ratio.toFixed(2)}:1
        </span>
        <WCAGLevelBadge level={level} />
        <div className="flex items-center gap-1">
          <span className={`text-[10px] font-medium ${passesAA ? 'text-green-500' : 'text-red-500'}`}>
            {passesAA ? 'AA' : '—'}
          </span>
          <span className={`text-[10px] font-medium ${passesAAA ? 'text-green-500' : 'text-red-500'}`}>
            {passesAAA ? 'AAA' : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function WCAGLevelBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    'AAA': 'text-green-600 bg-green-500/10 border-green-500/20',
    'AA': 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    'AA-large': 'text-orange-600 bg-orange-500/10 border-orange-500/20',
    'fail': 'text-red-600 bg-red-500/10 border-red-500/20',
  };

  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded border ${colorMap[level] || 'text-muted-foreground bg-muted border-border'}`}>
      {level.toUpperCase()}
    </span>
  );
}

function ContrastPreview({ fg, bg }: { fg: string; bg: string }) {
  return (
    <div
      className="rounded-xl border border-border/50 p-6 text-center space-y-2"
      style={{ backgroundColor: bg, color: fg }}
    >
      <p className="text-3xl font-bold">Aa</p>
      <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
      <p className="text-xs opacity-60" style={{ color: fg }}>
        {fg} on {bg}
      </p>
    </div>
  );
}

function ContrastHeatmap() {
  const { fgColor, bgColor } = useColorStudioStore();
  const fgRgb = hexToRgb(fgColor);
  const bgRgb = hexToRgb(bgColor);

  const points = useMemo(() => {
    if (!fgRgb || !bgRgb) return [];

    const results: { fontSize: number; weight: number; ratio: number; passes: boolean; label: string }[] = [];

    // Simulate various font sizes and weights
    const sizes = [
      { fontSize: 10, weight: 400, label: '10px regular' },
      { fontSize: 12, weight: 400, label: '12px regular' },
      { fontSize: 14, weight: 400, label: '14px regular' },
      { fontSize: 14, weight: 700, label: '14px bold' },
      { fontSize: 16, weight: 400, label: '16px regular' },
      { fontSize: 18, weight: 400, label: '18px regular' },
      { fontSize: 18, weight: 700, label: '18px bold' },
      { fontSize: 24, weight: 400, label: '24px regular' },
    ];

    for (const s of sizes) {
      const isLarge = (s.fontSize >= 18 && s.weight >= 700) || s.fontSize >= 24;
      const ratio = contrastRatio(fgRgb, bgRgb);
      const level = getWCAGLevel(ratio, isLarge);
      const passes = level === 'AA' || level === 'AAA';
      results.push({ ...s, ratio, passes, label: s.label });
    }

    return results;
  }, [fgRgb, bgRgb]);

  if (points.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-foreground">Contrast Heatmap</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {points.map((p) => (
          <div
            key={p.label}
            className={`p-2 rounded-lg border text-center text-[10px] ${
              p.passes
                ? 'bg-green-500/5 border-green-500/20 text-green-600'
                : 'bg-red-500/5 border-red-500/20 text-red-600'
            }`}
          >
            <div className="font-semibold">{p.passes ? '✓' : '✗'}</div>
            <div>{p.label}</div>
            <div className="font-mono">{p.ratio.toFixed(1)}:1</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorBlindnessSim() {
  const { fgColor, bgColor } = useColorStudioStore();

  const simulations = useMemo(() => {
    const fgRgb = hexToRgb(fgColor);
    if (!fgRgb) return [];
    const bgRgb = hexToRgb(bgColor);
    return BLINDNESS_TYPES.map((bt) => {
      const simRgb = simulateBlindness(fgRgb, bt.id as ColorBlindnessType);
      const simHex = rgbToHex(simRgb);
      const ratio = bgRgb ? contrastRatio(simRgb, bgRgb) : 0;
      const level = getWCAGLevel(ratio);
      return { ...bt, simHex, ratio, level, passesLevel: level };
    });
  }, [fgColor, bgColor]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-foreground">Color Blindness Simulation</h4>
      <p className="text-[11px] text-muted-foreground">
        Preview how your text appears to users with color vision deficiencies.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {simulations.map((sim) => (
          <div key={sim.id} className="rounded-lg border border-border overflow-hidden">
            <div
              className="px-3 py-4 text-center text-sm font-bold"
              style={{ backgroundColor: bgColor, color: sim.simHex }}
            >
              Aa
            </div>
            <div className="p-2 space-y-1">
              <div className="text-[10px] font-medium text-foreground">{sim.label}</div>
              <div className="text-[10px] font-mono text-muted-foreground">
                {sim.ratio.toFixed(2)}:1
              </div>
              <WCAGLevelBadge level={sim.level} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoFixPanel() {
  const { fgColor, bgColor, setFgColor } = useColorStudioStore();

  const accessible = useMemo(() => {
    return {
      AA_normal: findAccessibleColor(fgColor, bgColor, 'AA', false),
      AA_large: findAccessibleColor(fgColor, bgColor, 'AA', true),
      AAA_normal: findAccessibleColor(fgColor, bgColor, 'AAA', false),
      AAA_large: findAccessibleColor(fgColor, bgColor, 'AAA', true),
    };
  }, [fgColor, bgColor]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <h4 className="text-xs font-semibold text-foreground">Auto-Fix Accessible Colors</h4>
      <p className="text-[11px] text-muted-foreground">
        Automatically finds accessible alternatives by adjusting lightness in OKLCH space.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(accessible).map(([key, result]) => (
          <div key={key} className="rounded-lg border border-border p-2.5 space-y-1.5">
            <div className="text-[10px] font-medium text-foreground capitalize">
              {key.replace('_', ' ')}
            </div>
            <div
              className="h-6 rounded text-[10px] font-mono flex items-center justify-center"
              style={{ backgroundColor: bgColor, color: result.color }}
            >
              {result.color}
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className={`font-mono ${ratioColor(result.ratio)}`}>
                {result.ratio.toFixed(2)}:1
              </span>
              {result.adjusted && (
                <button
                  type="button"
                  onClick={() => setFgColor(result.color)}
                  className="text-primary hover:underline"
                  title="Apply this color"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TextRolesPanel() {
  const { fgColor, bgColor } = useColorStudioStore();

  const results = useMemo(() => checkAllTextRoles(fgColor, bgColor), [fgColor, bgColor]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <h4 className="text-xs font-semibold text-foreground">Text Role Accessibility</h4>
      {results.map((r) => (
        <WCAGResultRow
          key={r.label}
          label={r.label}
          ratio={r.ratio}
          largeText={r.levelLarge === 'AA' || r.levelLarge === 'AAA'}
        />
      ))}
    </div>
  );
}

function ComponentsPanel() {
  const { fgColor, bgColor } = useColorStudioStore();

  const results = useMemo(() => checkAllComponents(fgColor, bgColor), [fgColor, bgColor]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <h4 className="text-xs font-semibold text-foreground">Component Contrast Checks</h4>
      {results.map((r) => (
        <WCAGResultRow
          key={r.label}
          label={r.label}
          ratio={r.ratio}
          largeText={r.levelLarge === 'AA' || r.levelLarge === 'AAA'}
        />
      ))}
    </div>
  );
}

function AuditPanel() {
  const { fgColor, bgColor, setFgColor, setBgColor, setMode } = useColorStudioStore();

  const theme: ThemeAuditResult = useMemo(() => ({
    background: bgColor,
    surface: '#f8fafc',
    border: '#e2e8f0',
    primary: fgColor,
    secondary: '#8b5cf6',
    accent: '#ec4899',
    muted: '#94a3b8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
  }), [fgColor, bgColor]);

  const report = useMemo(() => {
    const pairs = getThemeAuditPairs(theme);
    return generateReport(pairs);
  }, [theme]);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h4 className="text-xs font-semibold text-foreground">Theme Audit Report</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold font-mono text-foreground">{report.overallScore}</span>
              <span className="text-[10px] text-muted-foreground">Score</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold font-mono text-green-500">{report.passedAA}</span>
              <span className="text-[10px] text-muted-foreground">Pass AA</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold font-mono text-amber-500">{report.passedAAA}</span>
              <span className="text-[10px] text-muted-foreground">Pass AAA</span>
            </div>
          </div>
          <WCAGLevelBadge level={report.maxLevel} />
        </div>
      </div>

      {/* Pairs detail */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        <h4 className="text-xs font-semibold text-foreground mb-2">Pairs</h4>
        {report.pairs.map((p, i) => (
          <div key={i} className={`flex items-center justify-between py-1 px-2 rounded ${ratioBg(p.ratio)}`}>
            <span className="text-xs text-foreground">{p.label}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-medium ${ratioColor(p.ratio)}`}>
                {p.ratio.toFixed(2)}:1
              </span>
              <span className={`text-[10px] font-medium ${p.passesAA ? 'text-green-500' : 'text-red-500'}`}>
                {p.passesAA ? '✓' : '✗'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Errors / Warnings / Suggestions */}
      {report.errors.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 space-y-1">
          <h5 className="text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertTriangle size={12} /> Errors
          </h5>
          {report.errors.map((e, i) => (
            <p key={i} className="text-[11px] text-red-600/80">{e}</p>
          ))}
        </div>
      )}
      {report.warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
          <h5 className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <AlertTriangle size={12} /> Warnings
          </h5>
          {report.warnings.map((w, i) => (
            <p key={i} className="text-[11px] text-amber-600/80">{w}</p>
          ))}
        </div>
      )}
      {report.suggestions.length > 0 && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 space-y-1">
          <h5 className="text-xs font-semibold text-blue-600">Suggestions</h5>
          {report.suggestions.map((s, i) => (
            <p key={i} className="text-[11px] text-blue-600/80">{s}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportExportPanel({ report }: { report: AccessibilityReport | null }) {
  const [format, setFormat] = useState<ReportExportFormat>('text');
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const code = useMemo(() => exportReport(report, format), [report, format]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Download size={14} /> Export Report
        </h4>
        <div className="flex items-center gap-2">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ReportExportFormat)}
            className="text-[11px] bg-background border border-input rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {REPORT_EXPORT_FORMATS.map((f) => (
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

/* ─── View mode tabs ────────────────────────────────────────────────────────── */

const VIEW_TABS: { id: ContrastView; label: string }[] = [
  { id: 'simple', label: 'Simple' },
  { id: 'text-roles', label: 'Text Roles' },
  { id: 'components', label: 'Components' },
  { id: 'audit', label: 'Audit' },
];

/* ─── Main Component ─────────────────────────────────────────────────────────── */

export default function ContrastTab() {
  const {
    fgColor, bgColor, setFgColor, setBgColor,
    contrastView, setContrastView,
    setMode,
  } = useColorStudioStore();

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showBlindness, setShowBlindness] = useState(false);
  const [showAutoFix, setShowAutoFix] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const fgRgb = hexToRgb(fgColor);
  const bgRgb = hexToRgb(bgColor);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;

  // For simple view
  const level = getWCAGLevel(ratio, false);
  const levelLarge = getWCAGLevel(ratio, true);
  const passes = fgRgb && bgRgb && passesWCAG(fgRgb, bgRgb, 'AA');
  const passesAAA = fgRgb && bgRgb && passesWCAG(fgRgb, bgRgb, 'AAA');

  // Theme audit report (for audit + export)
  const themeAuditReport = useMemo(() => {
    const theme: ThemeAuditResult = {
      background: bgColor,
      surface: '#f8fafc',
      border: '#e2e8f0',
      primary: fgColor,
      secondary: '#8b5cf6',
      accent: '#ec4899',
      muted: '#94a3b8',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#3b82f6',
    };
    return generateReport(getThemeAuditPairs(theme));
  }, [fgColor, bgColor]);

  // Simple pair report for export
  const simpleReport = useMemo(() => {
    return generateReport([{ label: 'Text on Background', foreground: fgColor, background: bgColor }]);
  }, [fgColor, bgColor]);

  const activeReport = contrastView === 'audit' ? themeAuditReport : simpleReport;

  // Accessible text suggestions for Simple view
  const accessibleSuggestions = useMemo(() => {
    if (!bgRgb) return [];
    const candidates = ['#ffffff', '#000000', '#f8fafc', '#1e293b', '#94a3b8'];
    return candidates
      .map((hex) => {
        const rgb = hexToRgb(hex);
        if (!rgb) return null;
        const r = contrastRatio(rgb, bgRgb);
        return { hex, ratio: r, level: getWCAGLevel(r, false) };
      })
      .filter(Boolean)
      .filter((s) => s!.level === 'AA' || s!.level === 'AAA')
      .sort((a, b) => b!.ratio - a!.ratio)
      .slice(0, 3);
  }, [bgRgb]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground">Contrast Checker</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Check WCAG 2.1 contrast ratios, text roles, components, and audit your theme.
        </p>
      </div>

      {/* Color pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Foreground (text)</label>
          <ColorPicker hex={fgColor} onChange={setFgColor} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Background</label>
          <ColorPicker hex={bgColor} onChange={setBgColor} />
        </div>
      </div>

      {/* Preview */}
      <ContrastPreview fg={fgColor} bg={bgColor} />

      {/* Main result */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Contrast Ratio</span>
          <span className="text-2xl font-bold font-mono text-foreground">
            {ratio.toFixed(2)}:1
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 rounded-lg border ${passes ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
            <div className={`text-xs font-medium ${passes ? 'text-green-600' : 'text-red-600'}`}>
              AA {passes ? '✓' : '✗'}
            </div>
            <div className="text-[10px] text-muted-foreground">Normal text ≥ 4.5:1</div>
          </div>
          <div className={`p-2 rounded-lg border ${levelLarge === 'AA' || levelLarge === 'AAA' ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
            <div className={`text-xs font-medium ${levelLarge === 'AA' || levelLarge === 'AAA' ? 'text-green-600' : 'text-red-600'}`}>
              AA Large {levelLarge === 'AA' || levelLarge === 'AAA' ? '✓' : '✗'}
            </div>
            <div className="text-[10px] text-muted-foreground">Large text ≥ 3:1</div>
          </div>
          <div className={`p-2 rounded-lg border ${passesAAA ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
            <div className={`text-xs font-medium ${passesAAA ? 'text-green-600' : 'text-amber-600'}`}>
              AAA {passesAAA ? '✓' : '✗'}
            </div>
            <div className="text-[10px] text-muted-foreground">Normal text ≥ 7:1</div>
          </div>
          <div className={`p-2 rounded-lg border ${levelLarge === 'AAA' ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}`}>
            <div className={`text-xs font-medium ${levelLarge === 'AAA' ? 'text-green-600' : 'text-amber-600'}`}>
              AAA Large {levelLarge === 'AAA' ? '✓' : '✗'}
            </div>
            <div className="text-[10px] text-muted-foreground">Large text ≥ 4.5:1</div>
          </div>
        </div>
      </div>

      {/* Suggested accessible colors (only in Simple view, when failing) */}
      {contrastView === 'simple' && !passes && accessibleSuggestions.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-2">
          <h4 className="text-xs font-semibold text-foreground">Suggested Text Colors</h4>
          <p className="text-[11px] text-muted-foreground">
            The current combination may be hard to read. Try these:
          </p>
          <div className="flex flex-wrap gap-2">
            {accessibleSuggestions.map((s) => (
              <button
                key={s!.hex}
                type="button"
                onClick={() => setFgColor(s!.hex)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                <div className="size-5 rounded border" style={{ backgroundColor: s!.hex }} />
                <div className="text-left">
                  <div className="text-xs font-medium text-foreground">{s!.hex}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{s!.ratio.toFixed(2)}:1</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle controls */}
      <div className="flex flex-wrap gap-1 bg-muted rounded-lg p-1">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setContrastView(tab.id)}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              contrastView === tab.id
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View panels */}
      {contrastView === 'text-roles' && <TextRolesPanel />}
      {contrastView === 'components' && <ComponentsPanel />}
      {contrastView === 'audit' && <AuditPanel />}

      {/* Feature toggles (visible for simple + text-roles + components) */}
      {contrastView !== 'audit' && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
              showHeatmap
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {showHeatmap ? <EyeOff size={13} /> : <Eye size={13} />}
            Heatmap
          </button>
          <button
            type="button"
            onClick={() => setShowBlindness(!showBlindness)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
              showBlindness
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {showBlindness ? <EyeOff size={13} /> : <Eye size={13} />}
            Color Blindness
          </button>
          <button
            type="button"
            onClick={() => setShowAutoFix(!showAutoFix)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg border transition-colors ${
              showAutoFix
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            }`}
          >
            {showAutoFix ? <EyeOff size={13} /> : <Eye size={13} />}
            Auto-Fix
          </button>
        </div>
      )}

      {showHeatmap && contrastView !== 'audit' && <ContrastHeatmap />}
      {showBlindness && contrastView !== 'audit' && <ColorBlindnessSim />}
      {showAutoFix && contrastView !== 'audit' && <AutoFixPanel />}

      {/* Report Export */}
      {contrastView === 'audit' && (
        <>
          <button
            type="button"
            onClick={() => setShowExport(!showExport)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
          >
            <FileText size={14} />
            {showExport ? 'Hide Export' : 'Export Report'}
          </button>
          {showExport && <ReportExportPanel report={themeAuditReport} />}
        </>
      )}

      {/* Simple export */}
      {contrastView === 'simple' && (
        <>
          <button
            type="button"
            onClick={() => setShowExport(!showExport)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
          >
            <FileText size={14} />
            {showExport ? 'Hide Export' : 'Export Report'}
          </button>
          {showExport && <ReportExportPanel report={simpleReport} />}
        </>
      )}

      {/* Interconnection CTA */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-foreground">Export Design Tokens</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Turn your colors into production-ready design tokens for your project.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode('tokens')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Export Tokens
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
