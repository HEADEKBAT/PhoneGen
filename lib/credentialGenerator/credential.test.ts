import { describe, expect, it } from 'vitest';
import { randomInt, distinctIndices, shuffled } from './random';
import { generateRandomPassword, resolveCharsets } from './generatePassword';
import { generatePassphrase } from './generatePassphrase';
import { generatePin } from './generatePin';
import { generateUUID, generateUUIDv7, generateRandomToken, generateJWTSecret } from './generateSecrets';
import {
  calculatePassphraseEntropy,
  calculateRandomPasswordEntropy,
  calculatePinEntropy,
  getCharsetSize,
  scorePassword,
} from './entropy';
import { WORDS } from './wordlist';

describe('randomInt', () => {
  it('stays in range', () => {
    for (let i = 0; i < 5000; i++) {
      const v = randomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });

  it('is close to uniform over a non-power-of-two range', () => {
    /* The bias this guards against is about one part in 69 million, far too
       small for a chi-square test to see. What the test can catch is a
       regression to something crudely skewed — a `% max` on a byte, say. */
    const n = 60_000;
    const max = 62;
    const counts = new Array(max).fill(0);
    for (let i = 0; i < n; i++) counts[randomInt(max)]++;
    const expected = n / max;
    const chi2 = counts.reduce((sum, c) => sum + (c - expected) ** 2 / expected, 0);
    expect(chi2).toBeLessThan(120); // 61 df; ~90 is p=0.005
  });

  it('rejects a non-positive range', () => {
    expect(() => randomInt(0)).toThrow();
  });
});

describe('distinctIndices', () => {
  it('returns distinct in-range values', () => {
    for (let i = 0; i < 2000; i++) {
      const picked = distinctIndices(10, 6);
      expect(new Set(picked).size).toBe(6);
      expect(picked.every((v) => v >= 0 && v < 10)).toBe(true);
    }
  });

  it('refuses to draw more than it has', () => {
    expect(() => distinctIndices(3, 4)).toThrow();
  });
});

describe('shuffled', () => {
  it('keeps every element', () => {
    const source = [...'abcdefgh'];
    for (let i = 0; i < 500; i++) {
      expect(shuffled(source).sort().join('')).toBe('abcdefgh');
    }
  });
});

describe('generateRandomPassword', () => {
  const allClasses = {
    length: 8,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  };

  it('always contains every requested character class', () => {
    /* The regression this pins: one character per class used to be written to
       an independently drawn position, so two classes could collide and the
       second overwrote the first. 16.9% of eight-character passwords came out
       missing a class they had been asked for. */
    for (let i = 0; i < 20_000; i++) {
      const password = generateRandomPassword(allClasses);
      expect(password).toMatch(/[A-Z]/);
      expect(password).toMatch(/[a-z]/);
      expect(password).toMatch(/[0-9]/);
      expect(password).toMatch(/[^A-Za-z0-9]/);
    }
  });

  it('honours the requested length', () => {
    for (const length of [1, 4, 8, 16, 64, 128]) {
      expect(generateRandomPassword({ ...allClasses, length })).toHaveLength(length);
    }
  });

  it('never emits an excluded character', () => {
    const excludeChars = 'aeiou0123456789';
    for (let i = 0; i < 2000; i++) {
      const password = generateRandomPassword({
        ...allClasses,
        length: 24,
        excludeChars,
      });
      for (const char of excludeChars) expect(password).not.toContain(char);
    }
  });

  it('drops the look-alike glyphs when asked', () => {
    for (let i = 0; i < 2000; i++) {
      const password = generateRandomPassword({ ...allClasses, length: 32, avoidAmbiguous: true });
      expect(password).not.toMatch(/[lIO01]/);
    }
  });

  it('falls back rather than throwing when every character is excluded', () => {
    const password = generateRandomPassword({
      length: 10,
      uppercase: false,
      lowercase: true,
      numbers: false,
      symbols: false,
      excludeChars: 'abcdefghijklmnopqrstuvwxyz',
    });
    expect(password).toHaveLength(10);
  });
});

describe('entropy agrees with the generator', () => {
  it('counts the alphabet the generator actually draws from', () => {
    const opts = {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    };
    const alphabet = new Set(resolveCharsets(opts).join(''));
    expect(getCharsetSize(opts)).toBe(alphabet.size);
    expect(calculateRandomPasswordEntropy(opts)).toBeCloseTo(16 * Math.log2(alphabet.size), 6);
  });

  it('shrinks when characters are excluded', () => {
    const base = {
      length: 16,
      uppercase: false,
      lowercase: true,
      numbers: false,
      symbols: false,
    };
    /* The old `getCharsetSize` ignored `excludeChars` outright, so removing
       half the alphabet changed the reported figure by nothing. */
    expect(getCharsetSize({ ...base, excludeChars: 'abcdefghijklm' })).toBe(13);
    expect(calculateRandomPasswordEntropy({ ...base, excludeChars: 'abcdefghijklm' }))
      .toBeLessThan(calculateRandomPasswordEntropy(base));
  });

  it('prices a passphrase word at 12 bits', () => {
    expect(WORDS.length).toBe(4096);
    expect(calculatePassphraseEntropy(1)).toBeCloseTo(12, 9);
    /* Drawn without replacement, so six words is a hair under 72. */
    expect(calculatePassphraseEntropy(6)).toBeLessThan(72);
    expect(calculatePassphraseEntropy(6)).toBeGreaterThan(71.99);
  });

  it('accounts for the no-repeat PIN constraint', () => {
    expect(calculatePinEntropy(4, false)).toBeCloseTo(4 * Math.log2(10), 9);
    expect(calculatePinEntropy(4, true)).toBeLessThan(calculatePinEntropy(4, false));
  });
});

describe('generatePassphrase', () => {
  it('never repeats a word', () => {
    for (let i = 0; i < 2000; i++) {
      const words = generatePassphrase({
        wordCount: 6,
        separator: '-',
        capitalize: false,
        includeNumber: false,
      }).split('-');
      expect(words).toHaveLength(6);
      expect(new Set(words).size).toBe(6);
    }
  });
});

describe('generatePin', () => {
  it('honours no-consecutive-repeats, ends included', () => {
    for (const length of [4, 6, 8] as const) {
      for (let i = 0; i < 3000; i++) {
        const pin = generatePin({ length, noRepeat: true });
        expect(pin).toHaveLength(length);
        expect(pin).toMatch(/^\d+$/);
        expect(/(\d)\1/.test(pin)).toBe(false);
        expect(pin[0]).not.toBe(pin[length - 1]);
      }
    }
  });
});

describe('UUIDs', () => {
  const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  it('v4 carries the right version and variant', () => {
    for (let i = 0; i < 1000; i++) {
      const uuid = generateUUID();
      expect(uuid).toMatch(UUID_SHAPE);
      expect(uuid[14]).toBe('4');
      expect('89ab').toContain(uuid[19]);
    }
  });

  it('v7 encodes the real millisecond timestamp', () => {
    /* `now >> 40` used to be `now >> 8`: `>>` is a 32-bit operator and the
       shift count wraps at 32, so the top 16 bits of the timestamp were lost
       and the rest came out transposed. */
    const before = Date.now();
    const uuid = generateUUIDv7();
    const after = Date.now();

    expect(uuid).toMatch(UUID_SHAPE);
    expect(uuid[14]).toBe('7');
    expect('89ab').toContain(uuid[19]);

    const encoded = parseInt(uuid.replace(/-/g, '').slice(0, 12), 16);
    expect(encoded).toBeGreaterThanOrEqual(before);
    expect(encoded).toBeLessThanOrEqual(after);
  });

  it('v7 sorts by creation time, including inside one millisecond', () => {
    /* Time-ordering is the only reason to pick v7 over v4, and a batch of them
       is generated well inside a single tick — so the counter in `rand_a` is
       what makes the batch sortable at all. */
    const batch = Array.from({ length: 500 }, () => generateUUIDv7());
    expect(batch).toStrictEqual([...batch].sort());
    expect(new Set(batch).size).toBe(batch.length);
  });
});

describe('tokens', () => {
  it('uses the standard alphabet for base64 and the URL alphabet for base64url', () => {
    /* "base64" used to be built as base64url + '+/' — a 66-character mixture
       that is valid under neither RFC 4648 §4 nor §5. */
    expect(generateRandomToken(64, 'base64')).toMatch(/^[A-Za-z0-9+/]{64}$/);
    expect(generateRandomToken(64, 'base64url')).toMatch(/^[A-Za-z0-9_-]{64}$/);
    expect(generateRandomToken(64, 'hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('encodes a JWT secret as unpadded base64url', () => {
    const secret = generateJWTSecret(64);
    expect(secret).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(secret).toHaveLength(Math.ceil((64 * 4) / 3));
  });
});

describe('scorePassword', () => {
  it('discounts a password that is on the leak lists', () => {
    const scored = scorePassword('password', 40);
    expect(scored.isCommon).toBe(true);
    expect(scored.bits).toBeLessThanOrEqual(12);
    expect(scored.band).toBe('veryWeak');
  });

  it('puts the top of the scale out of reach of a fast hash', () => {
    expect(scorePassword('x'.repeat(20), 60).band).toBe('moderate');
    expect(scorePassword('x'.repeat(20), 128).score).toBe(100);
  });

  it('reports every attack scenario', () => {
    const scenarios = scorePassword('x'.repeat(20), 80).estimates.map((e) => e.scenario);
    expect(scenarios).toStrictEqual(['online', 'fastHash', 'slowHash']);
  });
});
