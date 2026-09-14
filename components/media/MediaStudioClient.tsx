'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  MediaContainer,
  VideoAnalysis,
  ConversionOptions,
  ConversionResult,
  PipelineStage,
  PresetDefinition,
  HistoryEntry,
  SizeEstimation,
} from '@/lib/media';
import {
  estimateOutput,
  getPreset,
} from '@/lib/media';
import {
  AlertCircle,
  Upload,
  Server,
  BookOpen,
  Cpu,
  Table,
  History,
  ArrowRight,
} from 'lucide-react';
import SourcePanel, { type LoadedSource } from './shared/SourcePanel';
import FormatSelector from './shared/FormatSelector';
import PresetSelector from './shared/PresetSelector';
import SettingsPanel from './shared/SettingsPanel';
import PipelineProgress from './shared/PipelineProgress';
import AnalysisCards from './shared/AnalysisCards';
import ResultPanel from './shared/ResultPanel';
import EstimationBadge from './shared/EstimationBadge';
import FormatGuideCard from './shared/FormatGuideCard';
import CodecExplorerCard from './shared/CodecExplorerCard';
import FormatComparisonTable from './shared/FormatComparisonTable';
import FormatAdvisor from './shared/FormatAdvisor';
import HistoryPanel from './shared/HistoryPanel';
import VideoPreview from './shared/VideoPreview';
import { ALL_FORMATS, ALL_VIDEO_CODECS, ALL_AUDIO_CODECS } from '@/lib/media';
import { loadEngine, probe, convert, lastError } from '@/lib/media/engine';

/* ─── Tab Definitions ─────────────────────────────────────────────────────── */

type TabId = 'converter' | 'formats' | 'codecs' | 'guide' | 'history';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'converter', label: 'Converter', icon: <Upload className="h-4 w-4" /> },
  { id: 'formats', label: 'Format Guide', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'codecs', label: 'Codec Explorer', icon: <Cpu className="h-4 w-4" /> },
  { id: 'guide', label: 'Compare & Advice', icon: <Table className="h-4 w-4" /> },
  { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> },
];

/* ─── Default Options ─────────────────────────────────────────────────────── */

const DEFAULT_OPTIONS: ConversionOptions = {
  container: 'mp4',
  videoCodec: 'h264',
  audioCodec: 'aac',
  fastStart: true,
  crf: 23,
  preset: 'medium',
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('media-studio-history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem('media-studio-history', JSON.stringify(entries.slice(-50)));
  } catch {
    // storage full — ignore
  }
}

/** "1:02:03" or "2:07" — no leading hour when there is none. */
function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * The type to stamp on the output blob.
 *
 * It decides whether the browser plays the preview inline or offers a
 * download, so `video/${container}` — which was the old guess — is wrong for
 * every container whose name is not its subtype.
 */
function mimeFor(container: string): string {
  const types: Record<string, string> = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    aac: 'audio/aac',
    m4a: 'audio/mp4',
    flac: 'audio/flac',
  };
  return types[container] ?? 'application/octet-stream';
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ─── Props ────────────────────────────────────────────────────────────────── */

interface MediaStudioClientProps {
  standalone?: boolean;
  initialTab?: string;
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function MediaStudioClient({ standalone = true, initialTab }: MediaStudioClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>(
    (initialTab as TabId) || 'converter'
  );
  /* The bytes, not a File: a stream assembled from HLS segments never was a
     File, and the converter needs the same shape for both. */
  const [source, setSource] = useState<LoadedSource | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [estimation, setEstimation] = useState<SizeEstimation | null>(null);
  const [pipeline, setPipeline] = useState<{
    stage: PipelineStage;
    progress: number;
    message: string;
  } | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  /* ─── File handling ─────────────────────────────────────────────────── */

  const handleSource = useCallback(async (loaded: LoadedSource) => {
    setSource(loaded);
    setResult(null);
    setAnalysis(null);
    setEstimation(null);
    setError(null);

    const blob = new Blob([loaded.data as unknown as BlobPart]);
    setFileUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(blob);
    });

    /* The engine is ~32MB and arrives on first use. Saying so beats a page
       that looks frozen for half a minute. */
    setPipeline({ stage: 'analyze', progress: 0, message: 'Starting the video engine…' });

    try {
      await loadEngine(({ ratio, message }) =>
        setPipeline({ stage: 'analyze', progress: Math.round((ratio ?? 0) * 40), message }),
      );

      setPipeline({ stage: 'analyze', progress: 60, message: 'Reading the file…' });
      const probed = await probe(loaded.data, loaded.fileName);

      setAnalysis(probed);
      setEstimation(estimateOutput(probed, options));
      setPipeline(null);
    } catch (err) {
      setPipeline(null);
      setError(err instanceof Error ? err.message : 'Could not read that file.');
    }
  }, [options]);

  /* ─── Options change ─────────────────────────────────────────────────── */

  const handleOptionsChange = useCallback((newOptions: ConversionOptions) => {
    setOptions(newOptions);
    if (analysis) {
      setEstimation(estimateOutput(analysis, newOptions));
    }
  }, [analysis]);

  /* ─── Preset selection ──────────────────────────────────────────────── */

  const handlePreset = useCallback((preset: PresetDefinition) => {
    setOptions((prev) => ({
      ...prev,
      container: preset.container as MediaContainer,
      videoCodec: preset.videoCodec,
      audioCodec: preset.audioCodec,
      width: preset.width,
      height: preset.height,
      videoBitrate: preset.videoBitrate,
      crf: preset.crf,
    }));
  }, []);

  /* ─── Recommendation handler ────────────────────────────────────────── */

  const handleRecommendation = useCallback((_recommendation: unknown) => {
    setActiveTab('converter');
  }, []);

  /* ─── Conversion ────────────────────────────────────────────────────── */

  const abortRef = useRef<AbortController | null>(null);

  const handleConvert = useCallback(async () => {
    if (!source || !analysis) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setPipeline({ stage: 'prepare', progress: 0, message: 'Preparing…' });

    try {
      const outcome = await convert({
        data: source.data,
        fileName: source.fileName,
        options,
        analysis,
        signal: controller.signal,
        onProgress: ({ ratio, seconds }) =>
          setPipeline({
            stage: 'encode',
            progress: Math.round(ratio * 100),
            message: analysis.duration
              ? `Converting — ${formatClock(seconds)} of ${formatClock(analysis.duration)}`
              : 'Converting…',
          }),
      });

      const outputBlob = new Blob([outcome.data as unknown as BlobPart], {
        type: mimeFor(options.container),
      });
      const resultId = generateId();
      const outputFileName = `${source.fileName.replace(/\.[^.]+$/, '')}.${options.container}`;

      setResult({
        id: resultId,
        blobUrl: URL.createObjectURL(outputBlob),
        fileName: outputFileName,
        originalName: source.fileName,
        originalSize: source.data.byteLength,
        outputSize: outcome.data.byteLength,
        container: options.container,
        duration: analysis.duration,
        encodingTime: outcome.elapsedMs,
        preset: null,
        mimeType: mimeFor(options.container),
        timestamp: Date.now(),
      });

      const savedBytes = source.data.byteLength - outcome.data.byteLength;
      const entry: HistoryEntry = {
        id: resultId,
        fileName: outputFileName,
        originalFormat: analysis.container || '',
        outputFormat: options.container,
        originalSize: source.data.byteLength,
        outputSize: outcome.data.byteLength,
        savedBytes,
        savedPercent: source.data.byteLength > 0
          ? Math.round((savedBytes / source.data.byteLength) * 100)
          : 0,
        timestamp: Date.now(),
        options,
      };

      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 50);
        saveHistory(updated);
        return updated;
      });

      setPipeline(null);
    } catch (err) {
      setPipeline(null);
      if (err instanceof DOMException && err.name === 'AbortError') return;
      /* ffmpeg's own last words are more useful than "conversion failed". */
      const message = err instanceof Error ? err.message : String(err);
      setError(lastError(message) ?? message);
    }
  }, [source, analysis, options]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setPipeline(null);
  }, []);

  /* ─── Reset ──────────────────────────────────────────────────────────── */

  const handleReset = useCallback(() => {
    setSource(null);
    setFileUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setError(null);
    setAnalysis(null);
    setResult(null);
    setEstimation(null);
    setPipeline(null);
    setOptions(DEFAULT_OPTIONS);
  }, []);

  /* ─── Next action ────────────────────────────────────────────────────── */

  const handleNextAction = useCallback((_action: string) => {
    setResult(null);
    setEstimation(null);
  }, []);

  /* ─── History actions ───────────────────────────────────────────────── */

  const handleHistoryClear = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const handleHistoryReuse = useCallback((entry: HistoryEntry) => {
    setOptions(entry.options);
    setActiveTab('converter');
  }, []);

  const handleHistoryDownload = useCallback((_entry: HistoryEntry) => {
    // Blob URLs are session-only — re-download not available from history
  }, []);

  /* ─── Cleanup file URLs ─────────────────────────────────────────────── */

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  /* ─── Content ───────────────────────────────────────────────────────── */

  const content = (
    <>
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl border border-border bg-background p-4 shadow-sm">
        {/* ── Converter Tab ────────────────────────────────────────── */}
        {activeTab === 'converter' && (
          <div className="space-y-6">
            {/* Pipeline Progress */}
            {pipeline && (
              <PipelineProgress
                currentStage={pipeline.stage}
                progress={pipeline.progress}
                message={pipeline.message}
              />
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {!pipeline && (
              <>
                {/* Result (after conversion) */}
                {result && analysis ? (
                  <ResultPanel
                    result={result}
                    onReset={handleReset}
                    onNextAction={handleNextAction}
                  />
                ) : (
                  <>
                    {/* Upload Zone */}
                    {!source && <SourcePanel onSource={handleSource} />}

                    {/* File loaded — show controls */}
                    {source && analysis && (
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Left — preview + analysis */}
                        <div className="space-y-4">
                          {fileUrl && analysis.hasVideo && (
                            <VideoPreview src={fileUrl} fileName={source.fileName} />
                          )}
                          <AnalysisCards analysis={analysis} />

                          {/* Format Advisor */}
                          <FormatAdvisor
                            analysis={analysis}
                            onSelect={handleRecommendation}
                          />
                        </div>

                        {/* Right — controls */}
                        <div className="space-y-4">
                          {/* Format Selector */}
                          <div>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Output Format
                            </h3>
                            <FormatSelector
                              selected={options.container}
                              onChange={(fmt) =>
                                handleOptionsChange({ ...options, container: fmt })
                              }
                            />
                          </div>

                          {/* Presets */}
                          <div>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                              Device Presets
                            </h3>
                            <PresetSelector
                              onSelect={handlePreset}
                              currentOptions={options}
                            />
                          </div>

                          {/* Estimation */}
                          {estimation && (
                            <EstimationBadge estimation={estimation} />
                          )}

                          {/* Settings */}
                          <SettingsPanel
                            options={options}
                            onChange={handleOptionsChange}
                          />

                          {/* Convert button */}
                          <button
                            onClick={handleConvert}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Convert <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Cancel button during pipeline */}
            {pipeline && pipeline.stage !== 'done' && (
              <button
                onClick={handleCancel}
                className="w-full rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {/* ── Format Guide Tab ──────────────────────────────────────────── */}
        {activeTab === 'formats' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground mb-4">
              Learn about each format — when to use it, pros and cons.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_FORMATS.map((fmt) => (
                <FormatGuideCard key={fmt.id} format={fmt} />
              ))}
            </div>
          </div>
        )}

        {/* ── Codec Explorer Tab ───────────────────────────────────────── */}
        {activeTab === 'codecs' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground mb-4">
              Explore video and audio codecs — how they work and when to choose each.
            </p>

            <h3 className="text-sm font-semibold text-foreground">Video Codecs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_VIDEO_CODECS.map((codec) => (
                <CodecExplorerCard key={codec.id} codec={codec} />
              ))}
            </div>

            <h3 className="text-sm font-semibold text-foreground mt-6">Audio Codecs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_AUDIO_CODECS.map((codec) => (
                <CodecExplorerCard key={codec.id} codec={codec} />
              ))}
            </div>
          </div>
        )}

        {/* ── Compare & Advice Tab ─────────────────────────────────────── */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Format Comparison</h3>
              <FormatComparisonTable />
            </div>
          </div>
        )}

        {/* ── History Tab ──────────────────────────────────────────────── */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onClear={handleHistoryClear}
            onReuse={handleHistoryReuse}
            onDownload={handleHistoryDownload}
          />
        )}
      </div>
    </>
  );

  if (standalone) {
    return <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6">{content}</div>;
  }

  return content;
}
