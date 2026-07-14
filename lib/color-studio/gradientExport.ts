/**
 * Gradient Studio — export module.
 *
 * Generates code for CSS, Tailwind, SVG, JSON, React, Vue, SCSS, LESS,
 * and Style Dictionary formats from a GradientConfig.
 */

import type { GradientConfig, GradientExportFormat, ExportOptions } from './gradientTypes';
import { gradientToCSS } from './gradients';
import type { GradientDefinition } from './types';

/* ── CSS export ────────────────────────────────────────────────────────────── */

function exportCSS(config: GradientConfig, opts: ExportOptions): string {
  const lines: string[] = [];
  const name = cssSafeName(config.name);

  lines.push(`/* ${config.name} */`);

  if (opts.includeVariables) {
    lines.push(':root {');
    config.stops.forEach((s, i) => {
      lines.push(`  --gradient-${name}-stop-${i}: ${s.color};`);
    });
    lines.push(`  --gradient-${name}-angle: ${config.angle}deg;`);
    lines.push(`  --gradient-${name}-type: ${config.type};`);
    lines.push('}');
    lines.push('');
  }

  lines.push(`.gradient-${name} {`);
  lines.push(`  background: ${gradientToCSS(config)};`);

  if (opts.includeAnimation && config.animation && config.animation.type !== 'static') {
    lines.push(`  animation: ${name}-anim ${config.animation.speed}s ${config.animation.timingFunction} ${config.animation.delay}s ${config.animation.direction} ${config.animation.loop ? 'infinite' : '1'};`);
  }

  lines.push('}');

  if (opts.includeAnimation && config.animation && config.animation.type !== 'static') {
    lines.push('');
    lines.push(`@keyframes ${name}-anim {`);
    lines.push('  0% { transform: translate(0, 0) rotate(0deg); }');
    lines.push('  50% { transform: translate(10px, -10px) rotate(3deg); }');
    lines.push('  100% { transform: translate(0, 0) rotate(0deg); }');
    lines.push('}');
  }

  return lines.join('\n');
}

/* ── Tailwind CSS export ───────────────────────────────────────────────────── */

function exportTailwind(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  const gradientValue = gradientToCSS(config);

  return `/** ${config.name} — Tailwind CSS v4 */

@theme {
  --gradient-${name}: ${gradientValue};
  --gradient-${name}-stops: ${config.stops.map((s) => s.color).join(', ')};
  --gradient-${name}-angle: ${config.angle}deg;
}

/* Usage:
.bg-gradient-${name} {
  background-image: var(--gradient-${name});
}
*/`;
}

/* ── SVG export ────────────────────────────────────────────────────────────── */

function exportSVG(config: GradientConfig, _opts: ExportOptions): string {
  const isLinear = config.type === 'linear' || config.type === 'repeating-linear';
  const gradId = `grad-${cssSafeName(config.name)}`;
  const w = 400, h = 300;

  let gradientDef: string;
  if (isLinear) {
    gradientDef = `<linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
${config.stops.map((s) => `    <stop offset="${Math.round(s.offset * 100)}%" stop-color="${s.color}"${s.opacity !== undefined && s.opacity < 1 ? ` stop-opacity="${s.opacity}"` : ''} />`).join('\n')}
  </linearGradient>`;
  } else {
    gradientDef = `<radialGradient id="${gradId}" cx="50%" cy="50%" r="50%">
${config.stops.map((s) => `    <stop offset="${Math.round(s.offset * 100)}%" stop-color="${s.color}"${s.opacity !== undefined && s.opacity < 1 ? ` stop-opacity="${s.opacity}"` : ''} />`).join('\n')}
  </radialGradient>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
  ${gradientDef}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${gradId})" />
</svg>`;
}

/* ── JSON export ───────────────────────────────────────────────────────────── */

function exportJSON(config: GradientConfig, opts: ExportOptions): string {
  const data: Record<string, unknown> = {
    name: config.name,
    type: config.type,
    angle: config.angle,
    stops: config.stops,
  };

  if (opts.includeMeta) {
    data.id = config.id;
    data.tags = config.tags;
    data.createdAt = config.createdAt;
    data.updatedAt = config.updatedAt;
  }

  if (opts.includeAnimation && config.animation) {
    data.animation = config.animation;
  }

  if (opts.includeNoise && config.noise) {
    data.noise = config.noise;
  }

  if (opts.includeMasks && config.mask) {
    data.mask = config.mask;
  }

  return JSON.stringify(data, null, 2);
}

/* ── React component export ────────────────────────────────────────────────── */

function exportReact(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  return `import React from 'react';

interface ${name}GradientProps {
  className?: string;
  children?: React.ReactNode;
}

export function ${name}Gradient({ className, children }: ${name}GradientProps) {
  return (
    <div
      className={className}
      style={{
        background: '${gradientToCSS(config)}',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
}
`;
}

/* ── Vue component export ──────────────────────────────────────────────────── */

function exportVue(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  return `<template>
  <div
    class="${name}-gradient"
    :style="gradientStyle"
  >
    <slot />
  </div>
</template>

<script setup>
const gradientStyle = {
  background: '${gradientToCSS(config)}',
  backgroundSize: 'cover',
};
</script>

<style scoped>
.${name}-gradient {
  width: 100%;
  height: 100%;
}
</style>
`;
}

/* ── SCSS export ───────────────────────────────────────────────────────────── */

function exportSCSS(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  const lines: string[] = [];

  lines.push(`// ${config.name}`);
  lines.push('$gradient-stops: (');
  config.stops.forEach((s, i) => {
    lines.push(`  stop-${i}: ${s.color},`);
  });
  lines.push(');');
  lines.push('');
  lines.push(`@mixin gradient-${name} {`);
  lines.push(`  background: ${gradientToCSS(config)};`);
  lines.push('}');
  lines.push('');
  lines.push(`.gradient-${name} {`);
  lines.push(`  @include gradient-${name};`);
  lines.push('}');

  return lines.join('\n');
}

/* ── LESS export ───────────────────────────────────────────────────────────── */

function exportLESS(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  const lines: string[] = [];

  lines.push(`// ${config.name}`);
  lines.push(`@gradient-${name}: ${gradientToCSS(config)};`);
  lines.push('');
  lines.push(`.gradient-${name} {`);
  lines.push(`  background: @gradient-${name};`);
  lines.push('}');
  lines.push('');
  lines.push(`.gradient-${name}-mixin(@bg: @gradient-${name}) {`);
  lines.push('  background: @bg;');
  lines.push('}');

  return lines.join('\n');
}

/* ── Style Dictionary export ───────────────────────────────────────────────── */

function exportStyleDictionary(config: GradientConfig, _opts: ExportOptions): string {
  const name = cssSafeName(config.name);
  const dict: Record<string, unknown> = {
    [name]: {
      gradient: {
        type: { value: config.type },
        angle: { value: `${config.angle}deg` },
        stops: config.stops.reduce((acc, s, i) => {
          acc[`stop-${i}`] = { value: s.color };
          if (s.opacity !== undefined && s.opacity < 1) {
            acc[`stop-${i}-opacity`] = { value: s.opacity };
          }
          return acc;
        }, {} as Record<string, unknown>),
      },
    },
  };

  return JSON.stringify(dict, null, 2);
}

/* ── Utils ─────────────────────────────────────────────────────────────────── */

function cssSafeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || 'gradient';
}

/* ── Format registry ───────────────────────────────────────────────────────── */

type Exporter = (config: GradientConfig, opts: ExportOptions) => string;

const EXPORTERS: Record<GradientExportFormat, Exporter> = {
  css: exportCSS,
  tailwind: exportTailwind,
  svg: exportSVG,
  png: (_config, _opts) => '/* PNG export requires canvas rendering */',
  json: exportJSON,
  react: exportReact,
  vue: exportVue,
  scss: exportSCSS,
  less: exportLESS,
  'style-dictionary': exportStyleDictionary,
};

export const GRADIENT_EXPORT_FORMAT_LABELS: Record<GradientExportFormat, string> = {
  css: 'CSS',
  tailwind: 'Tailwind CSS',
  svg: 'SVG',
  png: 'PNG',
  json: 'JSON',
  react: 'React Component',
  vue: 'Vue Component',
  scss: 'SCSS',
  less: 'LESS',
  'style-dictionary': 'Style Dictionary',
};

export const GRADIENT_EXPORT_FORMAT_DESCRIPTIONS: Record<GradientExportFormat, string> = {
  css: 'Standard CSS with optional custom properties',
  tailwind: 'Tailwind CSS v4 @theme configuration',
  svg: 'SVG image with inline gradient definition',
  png: 'PNG image (requires canvas rendering)',
  json: 'Structured JSON configuration',
  react: 'Reusable React component',
  vue: 'Vue 3 single-file component',
  scss: 'SCSS mixin and variables',
  less: 'LESS variable and mixin',
  'style-dictionary': 'Amazon Style Dictionary format',
};

/** Export a gradient in the specified format. */
export function exportGradient(
  config: GradientConfig,
  format: GradientExportFormat,
  opts?: Partial<ExportOptions>,
): string {
  const options: ExportOptions = {
    format,
    includeVariables: true,
    includeMeta: false,
    includeAnimation: false,
    includeNoise: false,
    includeMasks: false,
    ...opts,
  };

  const exporter = EXPORTERS[format];
  if (!exporter) {
    return `/* Unsupported format: ${format} */`;
  }

  return exporter(config, options);
}

/** Get available export formats. */
export function getExportFormats(): GradientExportFormat[] {
  return Object.keys(EXPORTERS) as GradientExportFormat[];
}
