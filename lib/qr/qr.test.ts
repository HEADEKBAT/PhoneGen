import { describe, expect, it } from 'vitest';
import { QR_CONTENT_TYPES } from './contentTypes';
import { escapeVCard, escapeWifi } from './escape';
import { byteCapacity } from './capacity';
import { buildMatrix, coveredModules, maxLogoSide, MAX_LOGO_COVERAGE } from './matrix';
import { analyseReadiness, effectiveErrorCorrection } from './readiness';
import { buildEPS, buildPDF } from './vector';
import type { QROptions } from './types';

const BASE: QROptions = {
  content: 'https://www.gencore.space',
  moduleStyle: 'square',
  eyeStyle: 'classic',
  colors: { pattern: '#000000', eye: '#000000', background: '#ffffff' },
  background: { type: 'solid', value: '#ffffff' },
  quietZone: 4,
  errorCorrection: 'M',
};

const ids = (options: QROptions, context?: Parameters<typeof analyseReadiness>[1]) =>
  analyseReadiness(options, context).issues.map((issue) => issue.id);

describe('Wi-Fi payloads', () => {
  const wifi = QR_CONTENT_TYPES.wifi;

  it('carries the password when the encryption select was never touched', () => {
    /* The select renders `value={data.encryption || 'WPA'}` — a display
       default — so `encryption` stays undefined until the user changes it.
       The encoder used to fall back to 'nopass', which drops the `P:` field
       entirely: the UI showed WPA2-PSK, the user typed a password, and the
       code told the phone to join an open network. */
    expect(wifi.encode({ ssid: 'MyNet', password: 's3cret' })).toBe(
      'WIFI:T:WPA;S:MyNet;P:s3cret;H:false;;',
    );
  });

  it('still encodes an open network when there is no password', () => {
    expect(wifi.encode({ ssid: 'Guest' })).toBe('WIFI:T:nopass;S:Guest;H:false;;');
  });

  it('escapes the delimiters', () => {
    expect(wifi.encode({ ssid: 'Cafe;Free', password: 'a,b', encryption: 'WPA' })).toBe(
      'WIFI:T:WPA;S:Cafe\\;Free;P:a\\,b;H:false;;',
    );
  });

  it('refuses a secured network with no password', () => {
    expect(wifi.validate!({ ssid: 'X', encryption: 'WPA' }).valid).toBe(false);
  });

  it('offers only encryption values it can encode', () => {
    /* `defaultValue` was 'WPA2', which is in none of the four options; the
       generic form emits `defaultValue` verbatim, so it wrote `T:WPA2`. */
    const field = wifi.fields.find((item: { id: string }) => item.id === 'encryption')!;
    const values = field.options!.map((option: { value: string }) => option.value);
    expect(values).toContain(field.defaultValue);
  });
});

describe('escaping', () => {
  it('backslash-escapes the ZXing set', () => {
    expect(escapeWifi('a;b,c:d"e\\f')).toBe('a\\;b\\,c\\:d\\"e\\\\f');
  });

  it('escapes vCard structure characters', () => {
    expect(escapeVCard('Doe;Jr, MD')).toBe('Doe\\;Jr\\, MD');
  });
});

describe('vCard', () => {
  const vcard = QR_CONTENT_TYPES.vcard;

  it('keeps a semicolon inside one name component', () => {
    const out = vcard.encode({ firstName: 'Anna', lastName: 'Ko;va' });
    expect(out).toContain('N:Ko\\;va;Anna;;;');
  });

  it('keeps a comma inside one address component', () => {
    const out = vcard.encode({ firstName: 'A', address: 'Mira street, 5' });
    expect(out).toContain('ADR;TYPE=WORK:;;Mira street\\, 5;;;;');
  });

  it('uses CRLF and version 3.0', () => {
    const out = vcard.encode({ firstName: 'A' });
    expect(out.startsWith('BEGIN:VCARD\r\nVERSION:3.0')).toBe(true);
  });
});

describe('capacity', () => {
  it('matches ISO/IEC 18004 Table 7 in Byte mode', () => {
    /* The studio's three copies of this table were numeric-mode, which holds
       roughly three times as much: v1/L is 17 bytes but 41 digits. */
    expect(byteCapacity(1, 'L')).toBe(17);
    expect(byteCapacity(1, 'H')).toBe(7);
    expect(byteCapacity(40, 'L')).toBe(2953);
  });
});

describe('the encoded symbol', () => {
  it('reports the version the encoder actually chose', () => {
    const readiness = analyseReadiness(BASE);
    expect(readiness.version).toBe(2);
    expect(readiness.modules).toBe(25);
    expect(readiness.modules).toBe(readiness.version * 4 + 17);
  });

  it('grows a version when the payload does', () => {
    const small = analyseReadiness({ ...BASE, content: 'x'.repeat(20) }).version;
    const large = analyseReadiness({ ...BASE, content: 'x'.repeat(200) }).version;
    expect(large).toBeGreaterThan(small);
  });

  it('reports a payload no version can hold', () => {
    expect(ids({ ...BASE, content: 'x'.repeat(4000) })).toContain('overCapacity');
  });
});

describe('readiness', () => {
  it('passes a plain black-on-white code at a sensible size', () => {
    expect(analyseReadiness(BASE).verdict).toBe('ready');
  });

  it('catches inverted colours that a contrast ratio calls perfect', () => {
    const inverted = analyseReadiness({
      ...BASE,
      colors: { pattern: '#ffffff', eye: '#ffffff', background: '#000000' },
      background: { type: 'solid', value: '#000000' },
    });
    /* 21:1 — the best score the WCAG formula can give, and unreadable. */
    expect(inverted.contrast.ratio).toBe(21);
    expect(inverted.contrast.inverted).toBe(true);
    expect(inverted.verdict).toBe('broken');
  });

  it('catches a missing quiet zone', () => {
    expect(ids({ ...BASE, quietZone: 0 })).toContain('quietZoneMissing');
    expect(ids({ ...BASE, quietZone: 2 })).toContain('quietZoneShort');
  });

  it('catches finder patterns that match the background', () => {
    expect(ids({ ...BASE, colors: { ...BASE.colors, eye: '#fefefe' } })).toContain('eyeInvisible');
  });

  it('survives a half-typed colour instead of reporting NaN', () => {
    const partial = analyseReadiness({ ...BASE, colors: { ...BASE.colors, pattern: '#a' } });
    expect(Number.isNaN(partial.contrast.ratio)).toBe(false);
  });

  it('raises the level to H for a logo and says so', () => {
    const withLogo = analyseReadiness({ ...BASE, logo: { dataUrl: 'x', size: 30 } });
    expect(withLogo.errorCorrection).toBe('H');
    expect(withLogo.ecRaisedForLogo).toBe(true);
    expect(withLogo.issues.map((i) => i.id)).toContain('logoOnLowEc');
  });

  it('rejects a logo past the level’s coverage budget', () => {
    /* 50% of the width is 25% of the area; H allows 20%. */
    const tooBig = analyseReadiness({ ...BASE, errorCorrection: 'H', logo: { dataUrl: 'x', size: 50 } });
    expect(tooBig.logo!.withinBudget).toBe(false);
    expect(tooBig.verdict).toBe('broken');
  });

  it('accepts a logo inside the budget', () => {
    const fine = analyseReadiness({ ...BASE, errorCorrection: 'H', logo: { dataUrl: 'x', size: 40 } });
    expect(fine.logo!.withinBudget).toBe(true);
    expect(fine.issues.map((i) => i.id)).not.toContain('logoOverBudget');
  });

  it('counts the modules a logo actually covers', () => {
    const matrix = buildMatrix(BASE.content, 'H')!;
    const side = 0.4;
    const covered = coveredModules(matrix, side);
    expect(covered).toBe(Math.ceil(side * matrix.size) ** 2);
  });

  it('derives the maximum logo side from the area allowance', () => {
    expect(maxLogoSide('H')).toBeCloseTo(Math.sqrt(MAX_LOGO_COVERAGE.H), 9);
  });

  it('refuses to raise a level the user already set high enough', () => {
    expect(effectiveErrorCorrection({ ...BASE, errorCorrection: 'H', logo: { dataUrl: 'x', size: 10 } })).toBe('H');
    expect(effectiveErrorCorrection({ ...BASE, errorCorrection: 'Q' })).toBe('Q');
  });
});

describe('print planning', () => {
  it('warns when the modules fall under what a press can hold', () => {
    expect(ids(BASE, { widthMm: 8 })).toContain('printTooSmall');
    expect(ids(BASE, { widthMm: 40 })).not.toContain('printTooSmall');
  });

  it('lowers the minimum width as the printer resolution rises', () => {
    const at300 = analyseReadiness(BASE, { widthMm: 30, dpi: 300 }).print.minWidthMm;
    const at1200 = analyseReadiness(BASE, { widthMm: 30, dpi: 1200 }).print.minWidthMm;
    expect(at1200).toBeLessThan(at300);
  });

  it('measures the module against the printed width', () => {
    const plan = analyseReadiness(BASE, { widthMm: 33 }).print;
    expect(plan.totalModules).toBe(25 + 8);
    expect(plan.moduleMm).toBeCloseTo(1, 6);
  });
});

describe('vector export', () => {
  const matrix = buildMatrix(BASE.content, 'M')!;
  const options = { widthMm: 30, quietZone: 4, foreground: '#000000', background: '#ffffff' };

  it('writes an EPS whose rectangles rebuild the matrix exactly', () => {
    /* The strongest check available without a decoder: read the geometry back
       out of the file and compare it module by module with what was encoded. */
    const eps = buildEPS(matrix, options);
    const sidePt = (options.widthMm / 25.4) * 72;
    const total = matrix.size + options.quietZone * 2;
    const modulePt = sidePt / total;
    const originPt = options.quietZone * modulePt;

    const grid = Array.from({ length: matrix.size }, () => new Uint8Array(matrix.size));
    for (const line of eps.split('\n')) {
      const parsed = /^([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+) rectfill$/.exec(line);
      if (!parsed) continue;
      const [, xs, ys, ws] = parsed;
      const width = Number(ws);
      if (width >= sidePt - 0.01) continue; // the background fill
      const x = Math.round((Number(xs) - originPt) / modulePt);
      const y = Math.round((sidePt - originPt - Number(ys)) / modulePt) - 1;
      for (let i = 0; i < Math.round(width / modulePt); i++) grid[y][x + i] = 1;
    }

    let mismatches = 0;
    for (let y = 0; y < matrix.size; y++) {
      for (let x = 0; x < matrix.size; x++) {
        if ((matrix.isDark(x, y) ? 1 : 0) !== grid[y][x]) mismatches++;
      }
    }
    expect(mismatches).toBe(0);
  });

  it('writes a PDF whose cross-reference offsets point at their objects', () => {
    /* A viewer seeks by these numbers; if they are wrong the file opens
       blank, which is exactly the failure a hand-written PDF invites. */
    const text = Buffer.from(buildPDF(matrix, options)).toString('latin1');

    expect(text.startsWith('%PDF-1.4')).toBe(true);
    const startxref = Number(/startxref\n(\d+)/.exec(text)![1]);
    expect(text.slice(startxref, startxref + 4)).toBe('xref');

    const offsets = [...text.matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
    expect(offsets).toHaveLength(4);
    offsets.forEach((offset, index) => {
      expect(text.slice(offset).startsWith(`${index + 1} 0 obj`)).toBe(true);
    });
  });

  it('sizes the page in real millimetres', () => {
    const text = Buffer.from(buildPDF(matrix, { ...options, widthMm: 25.4 })).toString('latin1');
    /* One inch is 72 points, exactly. */
    expect(text).toContain('/MediaBox [0 0 72 72]');
  });

  it('leaves the page unpainted when the background is transparent', () => {
    const eps = buildEPS(matrix, { ...options, background: null });
    const fills = eps.match(/rectfill/g)!.length;
    const withBackground = buildEPS(matrix, options).match(/rectfill/g)!.length;
    expect(fills).toBe(withBackground - 1);
  });
});
