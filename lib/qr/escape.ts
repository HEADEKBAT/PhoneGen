/**
 * Escaping for the payload formats that need it.
 *
 * ── Why this file exists ────────────────────────────────────────────────────
 *
 * The encoders interpolated user input straight into formats that are
 * delimiter-separated, so any network called `Cafe;Free` produced
 * `WIFI:T:WPA;S:Cafe;Free;P:…` — a payload no scanner can read back as one
 * SSID. A surname with a semicolon did the same to the `N:` field of a vCard.
 * The code scanned fine; the phone then joined the wrong network, or saved a
 * contact with a mangled name, which is worse than a code that plainly fails.
 */

/**
 * WIFI: and MECARD field value (ZXing's Barcode Contents).
 *
 * ZXing is the de-facto specification here — it is what Android's scanner and
 * most libraries implement — and it requires `\ ; , :` and `"` to be
 * backslash-escaped inside a value. Its worked example takes the SSID
 * `"foo;bar\baz"` to `\"foo\;bar\\baz\"`.
 *
 * The Wi-Fi Alliance's DPP specification percent-encodes the same characters
 * instead, and the two are not compatible. Android backslash-escapes and fails
 * to decode percent-encoding, Windows emits the backslash form, and the
 * backslash form is what the field has settled on; that is the one written
 * here. A value containing any of these characters is worth telling the user
 * about, which `needsWifiEscaping` is for.
 */
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

/** True when a value contains a character whose escaping scanners disagree on. */
export function needsWifiEscaping(value: string): boolean {
  return /[\\;,:"]/.test(value);
}

/**
 * vCard 3.0 text value (RFC 2426 §5).
 *
 * `\`, `;`, `,` and a newline are the four that carry structure. Semicolons
 * separate the five components of `N:` and `ADR:`, commas separate repeated
 * values, so a street address written the way people write addresses — with a
 * comma in it — silently becomes two values without this.
 *
 * vCard 3.0 and not 4.0 deliberately: iOS's camera mis-renders non-ASCII
 * characters in 4.0 payloads, which is the whole reason the field still emits
 * the older version.
 */
export function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}
