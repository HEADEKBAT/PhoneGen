'use client';

import type { ConversionOptions, VideoCodec, AudioCodec, MediaContainer } from '@/lib/media';

interface SettingsPanelProps {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

export default function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  const update = (partial: Partial<ConversionOptions>) => {
    onChange({ ...options, ...partial });
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Advanced Settings</h3>

      {/* Container */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Container</label>
        <select
          value={options.container}
          onChange={(e) => update({ container: e.target.value as MediaContainer })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {['mp4', 'mov', 'avi', 'mkv', 'webm', 'gif', 'mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].map((c) => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Video Codec */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Video Codec</label>
        <select
          value={options.videoCodec}
          onChange={(e) => update({ videoCodec: e.target.value as VideoCodec })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {['h264', 'h265', 'av1', 'vp9', 'mpeg4'].map((c) => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Audio Codec */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Audio Codec</label>
        <select
          value={options.audioCodec}
          onChange={(e) => update({ audioCodec: e.target.value as AudioCodec })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {['aac', 'mp3', 'opus', 'flac', 'vorbis'].map((c) => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Resolution */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Width</label>
          <input
            type="number"
            value={options.width || ''}
            onChange={(e) => update({ width: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="Auto"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Height</label>
          <input
            type="number"
            value={options.height || ''}
            onChange={(e) => update({ height: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="Auto"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>

      {/* Frame Rate */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Frame Rate (fps)</label>
        <select
          value={options.frameRate || ''}
          onChange={(e) => update({ frameRate: e.target.value ? parseInt(e.target.value) : undefined })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Same as source</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="30">30</option>
          <option value="60">60</option>
        </select>
      </div>

      {/* Video Bitrate */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Video Bitrate</label>
        <select
          value={options.videoBitrate || ''}
          onChange={(e) => update({ videoBitrate: e.target.value || undefined })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Auto</option>
          <option value="500K">500 Kbps</option>
          <option value="1M">1 Mbps</option>
          <option value="2M">2 Mbps</option>
          <option value="4M">4 Mbps</option>
          <option value="8M">8 Mbps</option>
          <option value="16M">16 Mbps</option>
          <option value="32M">32 Mbps</option>
        </select>
      </div>

      {/* Audio Bitrate */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Audio Bitrate</label>
        <select
          value={options.audioBitrate || ''}
          onChange={(e) => update({ audioBitrate: e.target.value || undefined })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="">Auto</option>
          <option value="64k">64 kbps</option>
          <option value="96k">96 kbps</option>
          <option value="128k">128 kbps</option>
          <option value="192k">192 kbps</option>
          <option value="256k">256 kbps</option>
          <option value="320k">320 kbps</option>
        </select>
      </div>

      {/* CRF */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          CRF (Quality) — {options.crf || 23}
        </label>
        <input
          type="range"
          min="0"
          max="51"
          value={options.crf ?? 23}
          onChange={(e) => update({ crf: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Lossless (0)</span>
          <span>Good (23)</span>
          <span>Worst (51)</span>
        </div>
      </div>

      {/* Preset */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Encoding Preset</label>
        <select
          value={options.preset || 'medium'}
          onChange={(e) => update({ preset: e.target.value as ConversionOptions['preset'] })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="ultrafast">Ultra Fast</option>
          <option value="fast">Fast</option>
          <option value="medium">Medium</option>
          <option value="slow">Slow</option>
          <option value="veryslow">Very Slow</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={options.fastStart ?? true}
            onChange={(e) => update({ fastStart: e.target.checked })}
            className="rounded border-border"
          />
          Fast Start (streaming optimization)
        </label>
      </div>
    </div>
  );
}
