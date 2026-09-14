/**
 * Guards for endpoints that fetch a URL on the server's behalf.
 *
 * Any such endpoint is a server-side request forgery surface: the caller
 * chooses the address, and the request leaves from inside the hosting network,
 * where things are reachable that are not reachable from the internet — the
 * cloud metadata service on 169.254.169.254 above all.
 *
 * This lived inside app/api/image-proxy as a local helper. It is shared now
 * because the stream proxy needs the same guard, and a second copy is how the
 * two drift apart.
 *
 * ── What the original got wrong ─────────────────────────────────────────────
 *
 * Its comment promised that "hostnames that resolve to loopback / link-local /
 * private ranges" were rejected, but it only inspected the hostname as written.
 * `http://localtest.me/` resolves to 127.0.0.1 and passed; so does any name an
 * attacker points at an internal address. `assertPublicHost` actually resolves.
 *
 * ── What it still cannot do ─────────────────────────────────────────────────
 *
 * Between the lookup here and the connection `fetch` makes, a hostile DNS
 * server can answer differently — classic rebinding. Closing that needs a
 * custom agent that pins the checked address, which the platform's fetch does
 * not expose. The remaining guards (no redirects, content-type allowlist, size
 * cap, short timeout) are what keeps the window small, and they are not
 * optional extras.
 */

import { lookup } from 'node:dns/promises';

export class BlockedUrlError extends Error {
  /** HTTP status the caller should answer with. */
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'BlockedUrlError';
    this.status = status;
  }
}

/** True for addresses that must never be reachable through a proxy. */
export function isPrivateAddress(address: string): boolean {
  const host = address.toLowerCase().replace(/^\[|\]$/g, '');

  /* IPv6. ::ffff:a.b.c.d embeds an IPv4 address and has to be unwrapped, or
     ::ffff:127.0.0.1 walks straight past the IPv4 branch below. */
  if (host.includes(':')) {
    const mapped = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(host);
    if (mapped) return isPrivateAddress(mapped[1]);

    if (host === '::' || host === '::1') return true;
    if (host.startsWith('fe80:') || host.startsWith('fec0:')) return true; // link-local, site-local
    if (/^f[cd][0-9a-f]{2}:/.test(host)) return true; // unique-local fc00::/7
    if (host.startsWith('ff')) return true; // multicast
    return false;
  }

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!ipv4) return false;

  const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
  if (ipv4.slice(1).some((part) => Number(part) > 255)) return true; // not an address at all

  return (
    a === 0 || // "this network"
    a === 127 || // loopback
    a === 10 || // private
    (a === 172 && b >= 16 && b <= 31) || // private
    (a === 192 && b === 168) || // private
    (a === 169 && b === 254) || // link-local — cloud metadata lives here
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 192 && b === 0) || // IETF protocol assignments
    a === 198 || // benchmarking (198.18/15) and TEST-NET-2
    a >= 224 // multicast and reserved
  );
}

/** Hostnames that never point anywhere public, whatever DNS says. */
function isBlockedName(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.home.arpa') ||
    host === 'metadata.google.internal'
  );
}

/**
 * Parses and vets a user-supplied URL.
 *
 * @throws {BlockedUrlError} with a message meant to be shown to the user.
 */
export function parsePublicUrl(input: string): URL {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new BlockedUrlError('That does not look like a valid URL.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new BlockedUrlError('Only http and https URLs are supported.');
  }
  if (url.username || url.password) {
    throw new BlockedUrlError('URLs with embedded credentials are not allowed.');
  }
  if (isBlockedName(url.hostname) || isPrivateAddress(url.hostname)) {
    throw new BlockedUrlError('That host is not reachable through the proxy.');
  }

  return url;
}

/**
 * Resolves the hostname and rejects it if any address is private.
 *
 * Every address, not just the first: a name with one public and one private
 * A record would otherwise pass here and connect to whichever the resolver
 * hands `fetch`.
 */
export async function assertPublicHost(url: URL): Promise<void> {
  /* A literal address needs no lookup, and parsePublicUrl has already vetted
     it — asking DNS about it would only add a failure mode. */
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname) || url.hostname.includes(':')) {
    return;
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(url.hostname, { all: true });
  } catch {
    throw new BlockedUrlError('That hostname could not be resolved.', 502);
  }

  if (addresses.length === 0) {
    throw new BlockedUrlError('That hostname could not be resolved.', 502);
  }
  if (addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new BlockedUrlError('That host is not reachable through the proxy.');
  }
}

/**
 * Fetches a URL, following redirects only to addresses that pass the same
 * checks as the original.
 *
 * `redirect: 'error'` is the safe default and was what both proxies used, but
 * it refuses a great many legitimate links: CDNs redirect to a regional edge,
 * shorteners redirect by definition, and `download.samplelib.com` redirects
 * before serving a file. Refusing those is a real cost paid for a real danger
 * — a vetted public URL answering `302 Location: http://169.254.169.254/` is
 * the textbook SSRF bypass.
 *
 * Following the chain by hand gets both: every hop is parsed and resolved
 * again before it is followed, so a redirect into a private range is rejected
 * exactly as the original URL would have been.
 */
export async function fetchFollowingSafeRedirects(
  url: URL,
  init: RequestInit,
  maxHops = 4,
): Promise<{ response: Response; finalUrl: URL }> {
  let current = url;

  for (let hop = 0; hop <= maxHops; hop++) {
    const response = await fetch(current.toString(), { ...init, redirect: 'manual' });

    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect) return { response, finalUrl: current };

    const location = response.headers.get('location');
    if (!location) return { response, finalUrl: current };

    /* Relative Locations are legal and common. */
    let next: URL;
    try {
      next = new URL(location, current);
    } catch {
      throw new BlockedUrlError('That host redirected somewhere unreadable.', 502);
    }

    next = parsePublicUrl(next.toString());
    await assertPublicHost(next);
    current = next;
  }

  throw new BlockedUrlError('That URL redirects too many times.', 502);
}
