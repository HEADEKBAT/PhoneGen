import { describe, it, expect } from 'vitest';
import { parseProbeOutput, parseEncoders, parseTimestamp, aspectRatio, toAnalysis } from './probeParse';

/* Real ffmpeg output, trimmed. The shapes below are the ones that actually
   turn up: a plain mp4, a rotated phone clip, an audio-only file, a 5.1 mix. */

const MP4 = `ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'input.mp4':
  Metadata:
    major_brand     : isom
    encoder         : Lavf58.76.100
  Duration: 00:01:02.53, start: 0.000000, bitrate: 1234 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709), 1920x1080 [SAR 1:1 DAR 16:9], 1100 kb/s, 29.97 fps, 29.97 tbr, 30k tbn (default)
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s (default)
At least one output file must be specified`;

describe('parseProbeOutput', () => {
  it('reads container, duration and overall bitrate', () => {
    const probe = parseProbeOutput(MP4);

    expect(probe.container).toBe('mov');
    expect(probe.durationSeconds).toBeCloseTo(62.53);
    expect(probe.overallBitrate).toBe(1_234_000);
  });

  it('reads the video stream', () => {
    const { video } = parseProbeOutput(MP4);

    expect(video).not.toBeNull();
    expect(video!.codec).toBe('h264');
    expect(video!.width).toBe(1920);
    expect(video!.height).toBe(1080);
    expect(video!.frameRate).toBeCloseTo(29.97);
    expect(video!.bitrate).toBe(1_100_000);
    expect(video!.pixelFormat).toBe('yuv420p');
    expect(video!.colorSpace).toBe('bt709');
    expect(video!.rotation).toBe(0);
  });

  it('reads the audio stream', () => {
    const { audio } = parseProbeOutput(MP4);

    expect(audio!.codec).toBe('aac');
    expect(audio!.sampleRate).toBe(48000);
    expect(audio!.channels).toBe(2);
    expect(audio!.bitrate).toBe(128_000);
  });

  it('picks up rotation from the side-data block, which sits on its own line', () => {
    const rotated = `Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'clip.mov':
  Duration: 00:00:08.00, start: 0.000000, bitrate: 17 Mb/s
  Stream #0:0(und): Video: h264 (High), yuv420p, 1080x1920, 17000 kb/s, 30 fps
    Side data:
      displaymatrix: rotation of -90.00 degrees
  Stream #0:1(und): Audio: aac (LC), 44100 Hz, mono, fltp, 64 kb/s`;

    const probe = parseProbeOutput(rotated);

    expect(probe.video!.rotation).toBe(270);
    expect(probe.video!.width).toBe(1080);
    expect(probe.audio!.channels).toBe(1);
    expect(probe.overallBitrate).toBe(17_000_000);
  });

  it('handles an audio-only file without inventing a video stream', () => {
    const audioOnly = `Input #0, mp3, from 'song.mp3':
  Duration: 00:03:45.12, start: 0.025057, bitrate: 320 kb/s
  Stream #0:0: Audio: mp3, 44100 Hz, stereo, fltp, 320 kb/s`;

    const probe = parseProbeOutput(audioOnly);

    expect(probe.video).toBeNull();
    expect(probe.audio!.codec).toBe('mp3');
    expect(probe.durationSeconds).toBeCloseTo(225.12);
  });

  it('counts 5.1 as six channels rather than five', () => {
    const surround = `Input #0, matroska,webm, from 'film.mkv':
  Duration: 01:52:03.00, start: 0.000000, bitrate: 8000 kb/s
  Stream #0:0: Video: hevc (Main 10), yuv420p10le(tv, bt2020nc), 3840x2160, 23.98 fps
  Stream #0:1: Audio: flac, 48000 Hz, 5.1, s32 (24 bit)`;

    const probe = parseProbeOutput(surround);

    expect(probe.audio!.channels).toBe(6);
    expect(probe.video!.codec).toBe('h265');
    expect(probe.video!.colorSpace).toBe('bt2020nc');
    expect(probe.durationSeconds).toBeCloseTo(6723);
  });

  it('returns nulls rather than throwing on output it cannot read', () => {
    const probe = parseProbeOutput('ffmpeg: could not find codec parameters');

    expect(probe.video).toBeNull();
    expect(probe.audio).toBeNull();
    expect(probe.durationSeconds).toBeNull();
  });
});

describe('toAnalysis', () => {
  it('fills the studio shape and keeps the real file name and size', () => {
    const analysis = toAnalysis(parseProbeOutput(MP4), 'holiday.mp4', 9_400_000);

    expect(analysis.fileName).toBe('holiday.mp4');
    expect(analysis.fileSize).toBe(9_400_000);
    expect(analysis.aspectRatio).toBe('16:9');
    expect(analysis.hasVideo).toBe(true);
    expect(analysis.hasAudio).toBe(true);
    expect(analysis.duration).toBeCloseTo(62.53);
  });

  it('marks bt2020 as HDR', () => {
    const hdr = parseProbeOutput(`Input #0, matroska,webm, from 'a.mkv':
  Duration: 00:00:10.00, start: 0.000000, bitrate: 50000 kb/s
  Stream #0:0: Video: hevc (Main 10), yuv420p10le(tv, bt2020nc), 3840x2160, 24 fps`);

    expect(toAnalysis(hdr, 'a.mkv', 1).hdr).toBe(true);
    expect(toAnalysis(parseProbeOutput(MP4), 'b.mp4', 1).hdr).toBe(false);
  });

  it('grades quality from bits per pixel, and says unknown when it cannot', () => {
    expect(toAnalysis(parseProbeOutput(MP4), 'a.mp4', 1).estimatedQuality).toBe('low');
    expect(toAnalysis(parseProbeOutput('nothing here'), 'a.mp4', 1).estimatedQuality).toBe('unknown');
  });
});

describe('parseEncoders', () => {
  it('takes the names out of the flag table and ignores the header', () => {
    const output = `Encoders:
 V..... = Video
 A..... = Audio
 ------
 V....D libx264              libx264 H.264 / AVC / MPEG-4 AVC
 V....D libvpx-vp9           libvpx VP9
 A....D aac                  AAC (Advanced Audio Coding)
 A....D libmp3lame           libmp3lame MP3`;

    const encoders = parseEncoders(output);

    expect(encoders.has('libx264')).toBe(true);
    expect(encoders.has('libvpx-vp9')).toBe(true);
    expect(encoders.has('aac')).toBe(true);
    expect(encoders.has('libmp3lame')).toBe(true);
    expect(encoders.has('Video')).toBe(false);
    expect(encoders.size).toBe(4);
  });
});

describe('small parsers', () => {
  it('parses timestamps and rejects nonsense', () => {
    expect(parseTimestamp('00:01:02.53')).toBeCloseTo(62.53);
    expect(parseTimestamp('01:00:00')).toBe(3600);
    expect(parseTimestamp('nope')).toBeNull();
  });

  it('reduces aspect ratios', () => {
    expect(aspectRatio(1920, 1080)).toBe('16:9');
    expect(aspectRatio(1080, 1920)).toBe('9:16');
    expect(aspectRatio(640, 480)).toBe('4:3');
    expect(aspectRatio(0, 0)).toBe('');
  });
});
