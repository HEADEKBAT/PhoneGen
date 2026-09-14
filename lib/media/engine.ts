'use client';

/**
 * The ffmpeg.wasm engine behind Media Studio.
 *
 * Until now there was no engine. `MediaStudioClient` invented an analysis for
 * every file (1920×1080, 30 fps, ten seconds, h264/aac, whatever you actually
 * opened), waited four seconds through five fake progress stages, and handed
 * back the input bytes with the output extension on the name. A MOV converted
 * to MP4 was a MOV called .mp4. Meanwhile `@ffmpeg/ffmpeg` sat in the
 * dependency list, imported by nothing.
 *
 * ── How the core arrives ────────────────────────────────────────────────────
 *
 * `@ffmpeg/core` is not a dependency: it is ~32 MB of WebAssembly that belongs
 * in a CDN rather than in the repository and the deployment. It is fetched on
 * first use, with progress, because a silent 32 MB download on a slow line
 * looks exactly like a hung page.
 *
 * The single-threaded core is deliberate. The multi-threaded one is faster but
 * needs SharedArrayBuffer, which needs COOP/COEP headers on every response,
 * which would break every third-party embed on the site. A studio that encodes
 * at half speed beats a site whose analytics and fonts stop loading.
 */

import type { FFmpeg } from '@ffmpeg/ffmpeg';
import type { ConversionOptions, VideoAnalysis } from './types';
import { parseProbeOutput, parseEncoders, toAnalysis } from './probeParse';
import { buildConvertArgs, buildGifArgs, supportedCodecs, canRemux, isAudioOnly } from './args';

/** Pinned: the core and the wrapper are released as a matched pair. */
const CORE_VERSION = '0.12.10';
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

export interface EngineLoadProgress {
  /** 0–1 across the whole core download, or null before the size is known. */
  ratio: number | null;
  message: string;
}

let engine: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let encoderCache: Set<string> | null = null;
let logBuffer: string[] = [];

/** Everything ffmpeg printed during the last `run`. */
function takeLog(): string {
  const text = logBuffer.join('\n');
  logBuffer = [];
  return text;
}

/**
 * Loads the core, once.
 *
 * Concurrent callers share one promise: two components asking at the same
 * moment must not start two 32 MB downloads.
 */
export async function loadEngine(onProgress?: (p: EngineLoadProgress) => void): Promise<FFmpeg> {
  if (engine) return engine;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    /* Imported here rather than at the top of the module. `@ffmpeg/ffmpeg`
       spawns its worker through `new Worker(new URL('./worker.js',
       import.meta.url))`, which the bundler has to resolve statically; pulling
       it in at module scope drags that resolution into the studio's first
       chunk, and the studio then fails to mount at all rather than failing
       when someone actually converts something. It also keeps ~100KB out of
       the bundle of everyone who opens the page and reads the format guide. */
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util'),
    ]);

    const instance = new FFmpeg();

    instance.on('log', ({ message }) => {
      logBuffer.push(message);
      /* ffmpeg is chatty; without a bound a long encode grows this forever. */
      if (logBuffer.length > 4000) logBuffer.splice(0, 2000);
    });

    onProgress?.({ ratio: null, message: 'Downloading the video engine…' });

    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
      toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm', true, (event) => {
        const ratio = event.total > 0 ? event.received / event.total : null;
        onProgress?.({
          ratio,
          message: ratio === null
            ? 'Downloading the video engine…'
            : `Downloading the video engine — ${Math.round(ratio * 100)}%`,
        });
      }),
    ]);

    onProgress?.({ ratio: 1, message: 'Starting the video engine…' });
    await instance.load({ coreURL, wasmURL });

    engine = instance;
    return instance;
  })();

  try {
    return await loadPromise;
  } catch (error) {
    /* Let the next attempt start clean rather than resolving a rejected
       promise forever. */
    loadPromise = null;
    throw error;
  }
}

export function isEngineLoaded(): boolean {
  return engine !== null;
}

/**
 * Which codecs this build can actually produce.
 *
 * Asked once, from `ffmpeg -encoders`, rather than assumed: the default core
 * has libx264 and libvpx-vp9 but no libx265 and no AV1 encoder, and offering
 * H.265 that cannot be produced turns into a failure several minutes into an
 * encode. The UI narrows its options to whatever comes back here.
 */
export async function availableEncoders(): Promise<Set<string>> {
  if (encoderCache) return encoderCache;

  const ffmpeg = await loadEngine();
  takeLog();
  await ffmpeg.exec(['-hide_banner', '-encoders']);
  encoderCache = parseEncoders(takeLog());

  return encoderCache;
}

export async function availableCodecs() {
  return supportedCodecs(await availableEncoders());
}

/* ── Probing ────────────────────────────────────────────────────────────── */

/**
 * Reads a file's real shape.
 *
 * `ffmpeg -i` with no output exits non-zero — "At least one output file must
 * be specified" — after printing everything we want, so the exit code is
 * ignored on purpose and the log is what matters.
 */
export async function probe(data: Uint8Array, fileName: string): Promise<VideoAnalysis> {
  const ffmpeg = await loadEngine();
  const input = `probe_${safeName(fileName)}`;

  /* `writeFile` posts the buffer to the worker as a transferable, which
     detaches it here: after the call `data.byteLength` is 0 and the caller's
     copy is unusable. The file size was reported as "0 B" for exactly this
     reason, and a second conversion of the same source would have had nothing
     to read. The slice is the price of keeping the source alive. */
  const size = data.byteLength;
  await ffmpeg.writeFile(input, data.slice());
  takeLog();

  try {
    await ffmpeg.exec(['-hide_banner', '-i', input]);
  } catch {
    /* Expected: there is no output file. */
  }

  const log = takeLog();
  if (process.env.NODE_ENV !== 'production') {
    /* What ffmpeg actually said, for when the parser and a real file disagree. */
    console.debug('[media] probe output for %s:\n%s', fileName, log);
  }

  const parsed = parseProbeOutput(log);
  await ffmpeg.deleteFile(input).catch(() => {});

  if (!parsed.video && !parsed.audio) {
    throw new Error('ffmpeg could not read that file — it may be corrupt or not a media file.');
  }

  return toAnalysis(parsed, fileName, size);
}

/* ── Converting ─────────────────────────────────────────────────────────── */

export interface ConvertProgress {
  /** 0–1 through the encode, as ffmpeg reports it. */
  ratio: number;
  /** Position in the output, in seconds. */
  seconds: number;
}

export interface ConvertRequest {
  data: Uint8Array;
  fileName: string;
  options: ConversionOptions;
  analysis: VideoAnalysis;
  onProgress?: (p: ConvertProgress) => void;
  signal?: AbortSignal;
}

export interface ConvertOutcome {
  data: Uint8Array;
  /** True when the streams were copied rather than re-encoded. */
  remuxed: boolean;
  /** Milliseconds spent inside ffmpeg. */
  elapsedMs: number;
  /** ffmpeg's own output, kept for the error message when something fails. */
  log: string;
}

/** ffmpeg's virtual filesystem is happier without spaces and quotes. */
function safeName(name: string): string {
  return name.replace(/[^\w.-]+/g, '_').slice(-80) || 'input';
}

export async function convert(request: ConvertRequest): Promise<ConvertOutcome> {
  const { data, fileName, options, analysis, onProgress, signal } = request;

  const ffmpeg = await loadEngine();
  const available = await availableEncoders();

  const input = `in_${safeName(fileName)}`;
  const output = `out.${options.container}`;
  const remuxed = canRemux(analysis, options);

  const onTick = ({ progress, time }: { progress: number; time: number }) => {
    onProgress?.({
      /* ffmpeg reports > 1 near the end often enough to matter visually. */
      ratio: Math.min(Math.max(progress, 0), 1),
      seconds: time / 1_000_000,
    });
  };
  ffmpeg.on('progress', onTick);

  const started = Date.now();

  try {
    /* Copied for the same reason as in `probe`: the worker takes ownership of
       whatever it is given, and the source has to survive for a second pass
       with different settings. */
    await ffmpeg.writeFile(input, data.slice());
    takeLog();

    if (options.container === 'gif') {
      /* Two passes: count the colours, then map to them. */
      const { palette, render } = buildGifArgs(input, output, options);
      await ffmpeg.exec(palette, undefined, { signal });
      await ffmpeg.exec(render, undefined, { signal });
    } else {
      const args = buildConvertArgs({
        inputName: input,
        outputName: output,
        options,
        available,
        analysis,
        preferRemux: true,
      });
      await ffmpeg.exec(args, undefined, { signal });
    }

    const log = takeLog();
    const result = await ffmpeg.readFile(output);

    if (typeof result === 'string' || result.byteLength === 0) {
      throw new Error(lastError(log) ?? 'ffmpeg produced an empty file.');
    }

    return { data: result, remuxed, elapsedMs: Date.now() - started, log };
  } finally {
    ffmpeg.off('progress', onTick);
    await ffmpeg.deleteFile(input).catch(() => {});
    await ffmpeg.deleteFile(output).catch(() => {});
    if (options.container === 'gif') await ffmpeg.deleteFile('palette.png').catch(() => {});
  }
}

/**
 * The most useful line of an ffmpeg failure.
 *
 * Its last lines are usually the reason ("Unknown encoder", "Invalid data
 * found"); showing the whole log instead would bury it under a hundred lines
 * of stream configuration.
 */
export function lastError(log: string): string | null {
  const lines = log
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^(frame|size)=/.test(l));

  const meaningful = lines
    .reverse()
    .find((l) => /error|invalid|unknown|unable|failed|no such|not supported/i.test(l));

  return meaningful ?? lines[0] ?? null;
}

export { isAudioOnly };
