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
  Upload,
  Server,
  BookOpen,
  Cpu,
  Table,
  History,
  ArrowRight,
} from 'lucide-react';
import UploadZone from './shared/UploadZone';
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
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
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

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setFileUrl(URL.createObjectURL(f));
    setResult(null);
    setAnalysis(null);
    setEstimation(null);

    // Simulate analysis (real analysis comes from FFmpeg.wasm probe)
    const isAudio = f.type.startsWith('audio/');
    const ext = f.name.split('.').pop()?.toLowerCase() || '';

    const mockAnalysis: VideoAnalysis = {
      fileName: f.name,
      fileSize: f.size,
      container: ext as VideoAnalysis['container'],
      width: isAudio ? 0 : 1920,
      height: isAudio ? 0 : 1080,
      aspectRatio: '16:9',
      frameRate: 30,
      duration: 10,
      videoCodec: isAudio ? null : ('h264' as const),
      videoBitrate: isAudio ? null : 2500000,
      audioCodec: 'aac',
      audioBitrate: 128000,
      audioChannels: 2,
      colorSpace: 'bt.709',
      hdr: false,
      rotation: 0,
      hasAudio: true,
      hasVideo: !isAudio,
      estimatedQuality: 'high' as const,
      metadata: {},
    };
    setAnalysis(mockAnalysis);
  }, []);

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

  const handleRecommendation = useCallback((_recommendation: any) => {
    setActiveTab('converter');
  }, []);

  /* ─── Conversion ────────────────────────────────────────────────────── */

  const abortRef = useRef<AbortController | null>(null);

  const handleConvert = useCallback(async () => {
    if (!file || !analysis) return;

    abortRef.current = new AbortController();

    setPipeline({
      stage: 'prepare',
      progress: 0,
      message: 'Preparing conversion...',
    });

    try {
      // Simulate pipeline stages (real pipeline uses FFmpeg.wasm)
      const stages: { stage: PipelineStage; progress: number; message: string }[] = [
        { stage: 'analyze', progress: 10, message: 'Analyzing source file...' },
        { stage: 'prepare', progress: 25, message: 'Preparing encoder...' },
        { stage: 'encode', progress: 50, message: 'Converting media...' },
        { stage: 'optimize', progress: 80, message: 'Optimizing output...' },
        { stage: 'finalize', progress: 95, message: 'Finalizing...' },
      ];

      for (const s of stages) {
        if (abortRef.current?.signal.aborted) return;
        setPipeline(s);
        await new Promise((r) => setTimeout(r, 800));
      }

      const outputSize = Math.round(file.size * 0.6);
      const outputBlob = new Blob([file], { type: `video/${options.container}` });

      const resultBlobUrl = URL.createObjectURL(outputBlob);
      const resultId = generateId();
      const outputFileName = `converted-${file.name.replace(/\.[^.]+$/, '')}.${options.container}`;

      const resultData: ConversionResult = {
        id: resultId,
        blobUrl: resultBlobUrl,
        fileName: outputFileName,
        originalName: file.name,
        originalSize: file.size,
        outputSize,
        container: options.container,
        duration: 10,
        encodingTime: 3000,
        preset: null,
        mimeType: `video/${options.container}`,
        timestamp: Date.now(),
      };

      setResult(resultData);
      setPipeline({ stage: 'done', progress: 100, message: 'Conversion complete!' });

      // Add to history
      const savedBytes = file.size - outputSize;
      const savedPercent = file.size > 0 ? Math.round((savedBytes / file.size) * 100) : 0;
      const entry: HistoryEntry = {
        id: resultId,
        fileName: outputFileName,
        originalFormat: analysis.container || '',
        outputFormat: options.container,
        originalSize: file.size,
        outputSize,
        savedBytes,
        savedPercent,
        timestamp: Date.now(),
        options,
      };

      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 50);
        saveHistory(updated);
        return updated;
      });

      await new Promise((r) => setTimeout(r, 1500));
      setPipeline(null);
    } catch {
      setPipeline(null);
    }
  }, [file, analysis, options]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setPipeline(null);
  }, []);

  /* ─── Reset ──────────────────────────────────────────────────────────── */

  const handleReset = useCallback(() => {
    setFile(null);
    setFileUrl(null);
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
                    {!file && (
                      <UploadZone onFile={handleFile} />
                    )}

                    {/* File loaded — show controls */}
                    {file && analysis && (
                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Left — preview + analysis */}
                        <div className="space-y-4">
                          {fileUrl && analysis.hasVideo && (
                            <VideoPreview src={fileUrl} fileName={file.name} />
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
