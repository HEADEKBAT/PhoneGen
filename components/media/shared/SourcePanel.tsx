'use client';

import { useState, useCallback, useRef } from 'react';
import { Link2, HardDrive, Loader2, AlertCircle, ShieldAlert, Radio } from 'lucide-react';
import UploadZone from './UploadZone';
import {
  fetchPlaylist,
  resolveToMedia,
  downloadSegments,
  StreamFetchError,
  type FetchRoute,
} from '@/lib/media/hlsFetch';
import { describeVariant, looksLikePlaylist, HlsParseError, type HlsVariant } from '@/lib/media/hls';

/** Bytes plus how they got here — the route decides what the privacy note says. */
export interface LoadedSource {
  data: Uint8Array;
  fileName: string;
  route: 'local' | 'direct' | 'proxy';
  /** Number of segments, when it came from a playlist. */
  segments?: number;
}

interface SourcePanelProps {
  onSource: (source: LoadedSource) => void;
  busy?: boolean;
}

type Mode = 'file' | 'link';

type Stage =
  | { kind: 'idle' }
  | { kind: 'playlist' }
  | { kind: 'variants'; variants: HlsVariant[]; url: string; route: FetchRoute }
  | { kind: 'segments'; done: number; total: number; bytes: number; route: FetchRoute }
  | { kind: 'file'; bytes: number; route: FetchRoute };

/**
 * Where the media comes from: a local file, or a URL.
 *
 * The URL half is the reason this component exists. A converter that only
 * takes files cannot touch HLS at all — an .m3u8 is a text index, and the
 * video is in the hundreds of segments it points at.
 */
export default function SourcePanel({ onSource, busy = false }: SourcePanelProps) {
  const [mode, setMode] = useState<Mode>('file');
  const [url, setUrl] = useState('');
  const [stage, setStage] = useState<Stage>({ kind: 'idle' });
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const data = new Uint8Array(await file.arrayBuffer());
      onSource({ data, fileName: file.name, route: 'local' });
    },
    [onSource],
  );

  const fail = useCallback((err: unknown) => {
    setStage({ kind: 'idle' });
    if (err instanceof DOMException && err.name === 'AbortError') return;
    if (err instanceof StreamFetchError || err instanceof HlsParseError) setError(err.message);
    else setError(err instanceof Error ? err.message : 'Could not load that URL.');
  }, []);

  /** Downloads every segment of a media playlist and hands the bytes up. */
  const pullSegments = useCallback(
    async (playlistUrl: string, variantIndex: number, route: FetchRoute, signal: AbortSignal) => {
      const fetched = await fetchPlaylist(playlistUrl, route, signal);
      const { media, route: mediaRoute } = await resolveToMedia(fetched, variantIndex, signal);

      if (media.live) {
        setError(
          'That is a live stream: the playlist has no end, so there is no finite recording to convert. ' +
            'Use a VOD or archive link.',
        );
        setStage({ kind: 'idle' });
        return;
      }

      const result = await downloadSegments(media, {
        route: mediaRoute,
        signal,
        onProgress: (p) => setStage({ kind: 'segments', ...p }),
      });

      const name = (new URL(playlistUrl).pathname.split('/').filter(Boolean).pop() ?? 'stream')
        .replace(/\.m3u8?$/i, '') || 'stream';

      onSource({
        data: result.data,
        fileName: `${name}.${result.extension}`,
        route: result.route,
        segments: media.segments.length,
      });
      setStage({ kind: 'idle' });
    },
    [onSource],
  );

  const load = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      if (!looksLikePlaylist(trimmed)) {
        /* A direct media URL: one request, same direct-then-proxy path. */
        setStage({ kind: 'playlist' });
        const fetched = await fetch(trimmed, { signal: controller.signal }).catch(() => null);

        const response = fetched?.ok
          ? fetched
          : await fetch('/api/stream-proxy?url=' + encodeURIComponent(trimmed), {
              signal: controller.signal,
            });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new StreamFetchError(body.error ?? `The host answered ${response.status}.`);
        }

        const data = new Uint8Array(await response.arrayBuffer());
        const name = new URL(trimmed).pathname.split('/').filter(Boolean).pop() ?? 'download';

        onSource({ data, fileName: name, route: fetched?.ok ? 'direct' : 'proxy' });
        setStage({ kind: 'idle' });
        return;
      }

      setStage({ kind: 'playlist' });
      const fetched = await fetchPlaylist(trimmed, null, controller.signal);

      if (fetched.playlist.kind === 'master') {
        /* More than one rendition: ask rather than guess. Picking silently is
           how people end up converting a two-hour film at 240p. */
        setStage({
          kind: 'variants',
          variants: fetched.playlist.variants,
          url: trimmed,
          route: fetched.route,
        });
        return;
      }

      await pullSegments(trimmed, 0, fetched.route, controller.signal);
    } catch (err) {
      fail(err);
    }
  }, [url, onSource, pullSegments, fail]);

  const chooseVariant = useCallback(
    async (index: number) => {
      if (stage.kind !== 'variants') return;
      const { url: playlistUrl, route } = stage;

      const controller = new AbortController();
      abortRef.current = controller;
      setStage({ kind: 'playlist' });

      try {
        await pullSegments(playlistUrl, index, route, controller.signal);
      } catch (err) {
        fail(err);
      }
    },
    [stage, pullSegments, fail],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStage({ kind: 'idle' });
  }, []);

  const working = stage.kind !== 'idle' && stage.kind !== 'variants';

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {([
          { id: 'file' as const, label: 'File', icon: HardDrive },
          { id: 'link' as const, label: 'Link', icon: Link2 },
        ]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setMode(id); setError(null); }}
            disabled={busy || working}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === id
                ? 'bg-action text-white'
                : 'text-muted-foreground hover:text-foreground disabled:opacity-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === 'file' ? (
        <UploadZone onFile={handleFile} disabled={busy} />
      ) : (
        <div className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') load(); }}
              placeholder="https://example.com/stream/index.m3u8"
              disabled={busy || working}
              spellCheck={false}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-action focus:outline-none disabled:opacity-50"
            />
            <button
              type="button"
              onClick={working ? cancel : load}
              disabled={busy || (!working && !url.trim())}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-action px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {working ? 'Cancel' : 'Load'}
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            An .m3u8 playlist, or a direct link to a video or audio file. HLS playlists are
            downloaded segment by segment and joined here, in this tab.
          </p>

          {stage.kind === 'playlist' && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Reading the playlist…
            </p>
          )}

          {stage.kind === 'segments' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Segment {stage.done} of {stage.total}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {(stage.bytes / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-action transition-[width] duration-200"
                  style={{ width: `${Math.round((stage.done / stage.total) * 100)}%` }}
                />
              </div>
              {stage.route === 'proxy' && (
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  This host does not allow browsers to read its files directly, so the segments are
                  passing through our server. They are not stored there.
                </p>
              )}
            </div>
          )}

          {stage.kind === 'variants' && (
            <div className="space-y-2 rounded-lg border border-border bg-card p-3">
              <p className="text-sm font-medium text-foreground">Choose a quality</p>
              <div className="flex flex-wrap gap-2">
                {stage.variants.map((variant, index) => (
                  <button
                    key={variant.uri}
                    type="button"
                    onClick={() => chooseVariant(index)}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-action hover:text-foreground"
                  >
                    {describeVariant(variant)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {/live stream/i.test(error) ? (
                <Radio className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
