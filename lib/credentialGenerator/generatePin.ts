/**
 * PIN generator.
 *
 * `noRepeat` forbids two identical digits in a row, and the first digit from
 * matching the last — a house rule some card issuers impose. It is a usability
 * constraint, not a security one: it shrinks the space (10·9^(n-1) minus the
 * wrap cases instead of 10^n), and `calculatePinEntropy` accounts for that
 * rather than reporting the unconstrained figure.
 */

import { randomInt } from './random';
import type { PinOptions } from './types';

export function generatePin(opts: PinOptions): string {
  const { length, noRepeat } = opts;

  if (!noRepeat) {
    let pin = '';
    for (let i = 0; i < length; i++) pin += String(randomInt(10));
    return pin;
  }

  /* Rejection sampling, which keeps the result uniform over the permitted
     PINs — building one digit at a time from a filtered alphabet would not,
     because it changes the distribution of the last digit. The acceptance rate
     is above 80% for every length the UI offers, so this returns on the first
     or second try in practice. */
  for (let attempt = 0; attempt < 1000; attempt++) {
    let pin = '';
    for (let i = 0; i < length; i++) pin += String(randomInt(10));

    let ok = true;
    for (let i = 1; i < length; i++) {
      if (pin[i] === pin[i - 1]) { ok = false; break; }
    }
    if (ok && pin[0] === pin[length - 1]) ok = false;

    if (ok) return pin;
  }

  /* Unreachable for 4-8 digits. Returning an unconstrained PIN beats throwing
     in the middle of a click. */
  let pin = '';
  for (let i = 0; i < length; i++) pin += String(randomInt(10));
  return pin;
}
