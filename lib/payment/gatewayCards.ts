/**
 * Payment Gateway Reference Test Cards.
 *
 * These are the OFFICIAL test card numbers from each payment gateway's
 * documentation. They are not real card numbers and are published by
 * each gateway exclusively for testing purposes.
 *
 * Sources:
 *   - Stripe:  https://docs.stripe.com/testing
 *   - PayPal:  https://developer.paypal.com/docs/api-basics/test/credit-card-numbers/
 *   - Adyen:   https://docs.adyen.com/development-resources/testing/test-card-numbers
 *   - Braintree: https://developer.paypal.com/braintree/docs/reference/general/testing/
 *   - Worldpay: https://developer.worldpay.com/docs/wpg/testcardnumbers
 *   - Checkout.com: https://docs.checkout.com/testing/test-card-numbers
 */

import type { GatewayCard } from './types';

export const GATEWAY_CARDS: GatewayCard[] = [
  /* ── Stripe ──────────────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4242424242424242', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'visa',       number: '4000056655665556', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success (debit)' },
  { brand: 'mastercard', number: '5555555555554444', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'mastercard', number: '2223003122003222', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success (2-series)' },
  { brand: 'amex',       number: '378282246310005',  cvc: '1234', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'amex',       number: '371449635398431',  cvc: '1234', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'discover',   number: '6011111111111117', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'discover',   number: '6011000990139424', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'diners',     number: '30569309025904',   cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'jcb',        number: '3566002020360505', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  { brand: 'unionpay',   number: '6200000000000005', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Success' },
  // Stripe — declined / error cards
  { brand: 'visa',       number: '4000000000000002', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Declined' },
  { brand: 'visa',       number: '4000000000000069', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Declined (expired)' },
  { brand: 'visa',       number: '4000000000000127', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Declined (incorrect CVC)' },
  { brand: 'visa',       number: '4000000000000119', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Requires authentication' },
  { brand: 'visa',       number: '4000002500003155', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Requires 3DS' },
  { brand: 'visa',       number: '4000002760003184', cvc: '123', exp: '12/28', gateway: 'stripe', description: 'Requires 3DS v2' },

  /* ── PayPal ────────────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4009348888881881', cvc: '123', exp: '12/28', gateway: 'paypal', description: 'Success' },
  { brand: 'mastercard', number: '5425230000004415', cvc: '123', exp: '12/28', gateway: 'paypal', description: 'Success' },
  { brand: 'discover',   number: '6011000990995501', cvc: '123', exp: '12/28', gateway: 'paypal', description: 'Success' },
  { brand: 'amex',       number: '371449635392376',  cvc: '1234', exp: '12/28', gateway: 'paypal', description: 'Success' },

  /* ── Adyen ──────────────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4111111111111111', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'mastercard', number: '5500000000000004', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'amex',       number: '370000000000002',  cvc: '1234', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'discover',   number: '6011601160116611', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'diners',     number: '36000000000008',   cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'jcb',        number: '3566002020360505', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  { brand: 'unionpay',   number: '6244111111111112', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Success' },
  // Adyen — declined
  { brand: 'visa',       number: '4111111111111129', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Declined' },
  { brand: 'mastercard', number: '5111111111111118', cvc: '123', exp: '12/28', gateway: 'adyen', description: 'Declined' },

  /* ── Braintree ──────────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4111111111111111', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Success' },
  { brand: 'mastercard', number: '5555555555554444', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Success' },
  { brand: 'amex',       number: '378282246310005',  cvc: '1234', exp: '12/28', gateway: 'braintree', description: 'Success' },
  { brand: 'discover',   number: '6011111111111117', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Success' },
  { brand: 'jcb',        number: '3530111333300000', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Success' },
  { brand: 'diners',     number: '30000000000000004', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Success' },
  // Braintree — processor declined
  { brand: 'visa',       number: '4000111111111115', cvc: '123', exp: '12/28', gateway: 'braintree', description: 'Processor declined' },

  /* ── Worldpay ───────────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4444333322221111', cvc: '123', exp: '12/28', gateway: 'worldpay', description: 'Success' },
  { brand: 'mastercard', number: '5454545454545454', cvc: '123', exp: '12/28', gateway: 'worldpay', description: 'Success' },
  { brand: 'amex',       number: '343434343434343',  cvc: '1234', exp: '12/28', gateway: 'worldpay', description: 'Success' },

  /* ── Checkout.com ───────────────────────────────────────────────────── */
  { brand: 'visa',       number: '4242424242424242', cvc: '100', exp: '12/28', gateway: 'checkout', description: 'Success' },
  { brand: 'mastercard', number: '5355535353535353', cvc: '100', exp: '12/28', gateway: 'checkout', description: 'Success' },
  { brand: 'amex',       number: '345678901234564',  cvc: '1234', exp: '12/28', gateway: 'checkout', description: 'Success' },
];

/* ── Gateway lookup helpers ──────────────────────────────────────────────────── */

export const GATEWAY_NAMES: Record<string, string> = {
  stripe: 'Stripe',
  paypal: 'PayPal',
  adyen: 'Adyen',
  braintree: 'Braintree',
  worldpay: 'Worldpay',
  checkout: 'Checkout.com',
};

/** Get all gateways */
export function getGateways(): string[] {
  return [...new Set(GATEWAY_CARDS.map((c) => c.gateway))];
}

/** Get cards for a specific gateway */
export function getGatewayCards(gateway: string): GatewayCard[] {
  return GATEWAY_CARDS.filter((c) => c.gateway === gateway);
}

/** Get all unique gateway cards (deduplicated by number) */
export function getUniqueGatewayCards(): GatewayCard[] {
  const seen = new Set<string>();
  return GATEWAY_CARDS.filter((c) => {
    if (seen.has(c.number)) return false;
    seen.add(c.number);
    return true;
  });
}
