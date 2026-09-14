import { describe, it, expect } from 'vitest';
import {
  parseHlsPlaylist,
  parseAttributes,
  describeVariant,
  looksLikePlaylist,
  HlsParseError,
  type HlsMasterPlaylist,
  type HlsMediaPlaylist,
} from './hls';

const BASE = 'https://cdn.example.com/video/index.m3u8';

describe('parseAttributes', () => {
  it('keeps a quoted value containing commas in one piece', () => {
    /* The bug this guards: splitting on every comma turns one CODECS
       attribute into two and loses the audio codec. */
    const attrs = parseAttributes('BANDWIDTH=5000000,CODECS="avc1.64001f,mp4a.40.2",RESOLUTION=1920x1080');

    expect(attrs.CODECS).toBe('avc1.64001f,mp4a.40.2');
    expect(attrs.BANDWIDTH).toBe('5000000');
    expect(attrs.RESOLUTION).toBe('1920x1080');
  });

  it('upper-cases names and tolerates spaces around values', () => {
    expect(parseAttributes('bandwidth= 1200 ,method=AES-128')).toEqual({
      BANDWIDTH: '1200',
      METHOD: 'AES-128',
    });
  });

  it('survives an unterminated quote instead of looping', () => {
    expect(parseAttributes('URI="key.bin')).toEqual({ URI: 'key.bin' });
  });
});

describe('parseHlsPlaylist — master', () => {
  const MASTER = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360,CODECS="avc1.42c01e,mp4a.40.2"
360/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,AVERAGE-BANDWIDTH=4500000,RESOLUTION=1920x1080,FRAME-RATE=29.97
1080/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2400000,RESOLUTION=1280x720
https://other.example.net/720/index.m3u8`;

  it('lists every variant, highest quality first', () => {
    const playlist = parseHlsPlaylist(MASTER, BASE) as HlsMasterPlaylist;

    expect(playlist.kind).toBe('master');
    expect(playlist.variants.map((v) => v.height)).toEqual([1080, 720, 360]);
  });

  it('resolves relative variant URIs against the playlist URL and leaves absolute ones alone', () => {
    const playlist = parseHlsPlaylist(MASTER, BASE) as HlsMasterPlaylist;

    expect(playlist.variants[0].uri).toBe('https://cdn.example.com/video/1080/index.m3u8');
    expect(playlist.variants[1].uri).toBe('https://other.example.net/720/index.m3u8');
  });

  it('reads the optional attributes when present and null when not', () => {
    const [best, , worst] = (parseHlsPlaylist(MASTER, BASE) as HlsMasterPlaylist).variants;

    expect(best.averageBandwidth).toBe(4500000);
    expect(best.frameRate).toBeCloseTo(29.97);
    expect(best.codecs).toBeNull();
    expect(worst.codecs).toBe('avc1.42c01e,mp4a.40.2');
  });
});

describe('parseHlsPlaylist — media', () => {
  const VOD = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:9.009,
seg0.ts
#EXTINF:9.009,segment title
seg1.ts
#EXTINF:3.003,
../shared/seg2.ts
#EXT-X-ENDLIST`;

  it('collects segments with durations and absolute URIs', () => {
    const playlist = parseHlsPlaylist(VOD, BASE) as HlsMediaPlaylist;

    expect(playlist.kind).toBe('media');
    expect(playlist.segments).toHaveLength(3);
    expect(playlist.segments[0].uri).toBe('https://cdn.example.com/video/seg0.ts');
    expect(playlist.segments[2].uri).toBe('https://cdn.example.com/shared/seg2.ts');
    expect(playlist.totalDuration).toBeCloseTo(21.021);
  });

  it('ignores the title after the comma in EXTINF', () => {
    const playlist = parseHlsPlaylist(VOD, BASE) as HlsMediaPlaylist;
    expect(playlist.segments[1].duration).toBeCloseTo(9.009);
  });

  it('numbers segments from EXT-X-MEDIA-SEQUENCE, which the AES-128 IV derives from', () => {
    const shifted = VOD.replace('#EXT-X-MEDIA-SEQUENCE:0', '#EXT-X-MEDIA-SEQUENCE:17');
    const playlist = parseHlsPlaylist(shifted, BASE) as HlsMediaPlaylist;

    expect(playlist.segments.map((s) => s.sequence)).toEqual([17, 18, 19]);
  });

  it('treats a missing EXT-X-ENDLIST as a live stream', () => {
    const live = VOD.replace('\n#EXT-X-ENDLIST', '');

    expect((parseHlsPlaylist(VOD, BASE) as HlsMediaPlaylist).live).toBe(false);
    expect((parseHlsPlaylist(live, BASE) as HlsMediaPlaylist).live).toBe(true);
  });

  it('carries the fMP4 initialisation segment onto every segment that follows it', () => {
    const fmp4 = `#EXTM3U
#EXT-X-TARGETDURATION:4
#EXT-X-MAP:URI="init.mp4"
#EXTINF:4.0,
seg0.m4s
#EXTINF:4.0,
seg1.m4s
#EXT-X-ENDLIST`;

    const playlist = parseHlsPlaylist(fmp4, BASE) as HlsMediaPlaylist;
    const init = 'https://cdn.example.com/video/init.mp4';

    expect(playlist.segments.map((s) => s.initUri)).toEqual([init, init]);
  });

  it('continues a byte range from the previous one when no offset is given', () => {
    const ranged = `#EXTM3U
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
#EXT-X-BYTERANGE:75232@0
all.ts
#EXTINF:10.0,
#EXT-X-BYTERANGE:82112
all.ts
#EXT-X-ENDLIST`;

    const playlist = parseHlsPlaylist(ranged, BASE) as HlsMediaPlaylist;

    expect(playlist.segments[0].byteRange).toEqual({ offset: 0, length: 75232 });
    expect(playlist.segments[1].byteRange).toEqual({ offset: 75232, length: 82112 });
  });
});

describe('parseHlsPlaylist — encryption', () => {
  const withKey = (method: string, extra = '') => `#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-KEY:METHOD=${method}${extra}
#EXTINF:10.0,
seg0.ts
#EXT-X-ENDLIST`;

  it('reports AES-128 as decryptable and resolves the key URI', () => {
    const playlist = parseHlsPlaylist(
      withKey('AES-128', ',URI="../keys/k.bin",IV=0x0123456789ABCDEF0123456789ABCDEF'),
      BASE,
    ) as HlsMediaPlaylist;

    expect(playlist.encryption).toBe('aes-128');
    expect(playlist.segments[0].key?.uri).toBe('https://cdn.example.com/keys/k.bin');
    expect(playlist.segments[0].key?.iv).toBe('0123456789abcdef0123456789abcdef');
  });

  it('reports SAMPLE-AES as unsupported and keeps the method for the message', () => {
    const playlist = parseHlsPlaylist(withKey('SAMPLE-AES'), BASE) as HlsMediaPlaylist;

    expect(playlist.encryption).toBe('unsupported');
    expect(playlist.unsupportedMethod).toBe('SAMPLE-AES');
  });

  it('treats METHOD=NONE as unencrypted', () => {
    const playlist = parseHlsPlaylist(withKey('NONE'), BASE) as HlsMediaPlaylist;

    expect(playlist.encryption).toBe('none');
    expect(playlist.segments[0].key).toBeNull();
  });

  it('stops applying a key after METHOD=NONE turns it off mid-playlist', () => {
    const mixed = `#EXTM3U
#EXT-X-TARGETDURATION:10
#EXT-X-KEY:METHOD=AES-128,URI="k.bin"
#EXTINF:10.0,
a.ts
#EXT-X-KEY:METHOD=NONE
#EXTINF:10.0,
b.ts
#EXT-X-ENDLIST`;

    const playlist = parseHlsPlaylist(mixed, BASE) as HlsMediaPlaylist;

    expect(playlist.segments[0].key?.method).toBe('AES-128');
    expect(playlist.segments[1].key).toBeNull();
  });
});

describe('parseHlsPlaylist — rejection', () => {
  it('refuses a document that is not a playlist', () => {
    expect(() => parseHlsPlaylist('<html><body>404</body></html>', BASE)).toThrow(HlsParseError);
  });

  it('refuses a media playlist with no segments', () => {
    expect(() => parseHlsPlaylist('#EXTM3U\n#EXT-X-TARGETDURATION:10\n#EXT-X-ENDLIST', BASE)).toThrow(
      /no segments/i,
    );
  });

  it('refuses a master playlist whose variants have no URI', () => {
    expect(() =>
      parseHlsPlaylist('#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1\n#EXT-X-STREAM-INF:BANDWIDTH=2', BASE),
    ).toThrow(/no playable variants/i);
  });
});

describe('describeVariant', () => {
  it('prefers average bandwidth and switches unit below a megabit', () => {
    const base = { uri: 'u', averageBandwidth: null, width: null, codecs: null, frameRate: null };

    expect(describeVariant({ ...base, bandwidth: 5_200_000, height: 1080 })).toBe('1080p · 5.2 Mbps');
    expect(describeVariant({ ...base, bandwidth: 800_000, height: 360 })).toBe('360p · 800 kbps');
    expect(describeVariant({ ...base, bandwidth: 9_000_000, averageBandwidth: 4_000_000, height: 720 }))
      .toBe('720p · 4.0 Mbps');
  });

  it('says so rather than rendering an empty string', () => {
    expect(
      describeVariant({ uri: 'u', bandwidth: 0, averageBandwidth: null, width: null, height: null, codecs: null, frameRate: null }),
    ).toBe('unknown quality');
  });
});

describe('looksLikePlaylist', () => {
  it('matches .m3u8 and .m3u, with or without a query string', () => {
    expect(looksLikePlaylist('https://x.test/a/index.m3u8')).toBe(true);
    expect(looksLikePlaylist('https://x.test/a/index.m3u?token=abc')).toBe(true);
    expect(looksLikePlaylist('https://x.test/a/video.mp4')).toBe(false);
    expect(looksLikePlaylist('not a url')).toBe(false);
  });
});
