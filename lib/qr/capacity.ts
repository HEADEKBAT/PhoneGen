/**
 * Byte-mode data capacity, in bytes, for every version and level.
 *
 * GENERATED from `qrcode`'s own tables by scripts/qr/capacity.build.mjs, which
 * reads ISO/IEC 18004 Table 7 as that library encodes it. Checked by
 * `npm run check:qr-capacity`.
 *
 * ── Why this table exists ───────────────────────────────────────────────────
 *
 * The studio carried a capacity table already — three verbatim copies of it,
 * in `generator.ts` and twice in `scanTest.ts` — and all three were *numeric*
 * mode, labelled as such in a comment, while the encoder has always been set
 * to Byte. Byte mode holds about a third as much, so every version the studio
 * reported was far too low and every "fits comfortably" far too generous.
 *
 * Rows are versions 1–40; columns are L, M, Q, H.
 */

export const BYTE_CAPACITY: readonly (readonly number[])[] = [
  [  17,   14,   11,    7],
  [  32,   26,   20,   14],
  [  53,   42,   32,   24],
  [  78,   62,   46,   34],
  [ 106,   84,   60,   44],
  [ 134,  106,   74,   58],
  [ 154,  122,   86,   64],
  [ 192,  152,  108,   84],
  [ 230,  180,  130,   98],
  [ 271,  213,  151,  119],
  [ 321,  251,  177,  137],
  [ 367,  287,  203,  155],
  [ 425,  331,  241,  177],
  [ 458,  362,  258,  194],
  [ 520,  412,  292,  220],
  [ 586,  450,  322,  250],
  [ 644,  504,  364,  280],
  [ 718,  560,  394,  310],
  [ 792,  624,  442,  338],
  [ 858,  666,  482,  382],
  [ 929,  711,  509,  403],
  [1003,  779,  565,  439],
  [1091,  857,  611,  461],
  [1171,  911,  661,  511],
  [1273,  997,  715,  535],
  [1367, 1059,  751,  593],
  [1465, 1125,  805,  625],
  [1528, 1190,  868,  658],
  [1628, 1264,  908,  698],
  [1732, 1370,  982,  742],
  [1840, 1452, 1030,  790],
  [1952, 1538, 1112,  842],
  [2068, 1628, 1168,  898],
  [2188, 1722, 1228,  958],
  [2303, 1809, 1283,  983],
  [2431, 1911, 1351, 1051],
  [2563, 1989, 1423, 1093],
  [2699, 2099, 1499, 1139],
  [2809, 2213, 1579, 1219],
  [2953, 2331, 1663, 1273],
] as const;

/** Bytes that fit at this version and level. */
export function byteCapacity(version: number, ec: 'L' | 'M' | 'Q' | 'H'): number {
  const row = BYTE_CAPACITY[version - 1];
  if (!row) return 0;
  return row[{ L: 0, M: 1, Q: 2, H: 3 }[ec]];
}
