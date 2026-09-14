import { describe, it, expect } from 'vitest';
import { isPrivateAddress, parsePublicUrl, BlockedUrlError } from './ssrf';

describe('isPrivateAddress', () => {
  it('blocks every IPv4 range that is not the public internet', () => {
    for (const address of [
      '127.0.0.1', '127.1.2.3',       // loopback
      '10.0.0.1', '172.16.0.1', '172.31.255.255', '192.168.1.1', // RFC 1918
      '169.254.169.254',              // cloud metadata — the one that matters
      '0.0.0.0',
      '100.64.0.1',                   // carrier-grade NAT
      '224.0.0.1', '255.255.255.255', // multicast, broadcast
    ]) {
      expect(isPrivateAddress(address), address).toBe(true);
    }
  });

  it('allows ordinary public addresses', () => {
    for (const address of ['8.8.8.8', '1.1.1.1', '93.184.216.34', '172.32.0.1', '192.169.0.1']) {
      expect(isPrivateAddress(address), address).toBe(false);
    }
  });

  it('unwraps IPv4-mapped IPv6, which is how ::ffff:127.0.0.1 sneaks past a naive check', () => {
    expect(isPrivateAddress('::ffff:127.0.0.1')).toBe(true);
    expect(isPrivateAddress('::ffff:169.254.169.254')).toBe(true);
    expect(isPrivateAddress('::ffff:8.8.8.8')).toBe(false);
  });

  it('blocks IPv6 loopback, link-local, unique-local and multicast', () => {
    for (const address of ['::1', '::', 'fe80::1', 'fd00::1', 'fc00::1', 'ff02::1', '[::1]']) {
      expect(isPrivateAddress(address), address).toBe(true);
    }
    expect(isPrivateAddress('2606:4700:4700::1111')).toBe(false);
  });

  it('rejects octets above 255 rather than treating the string as a hostname', () => {
    expect(isPrivateAddress('999.1.1.1')).toBe(true);
  });
});

describe('parsePublicUrl', () => {
  it('accepts an ordinary https URL', () => {
    expect(parsePublicUrl('https://cdn.example.com/a/index.m3u8').hostname).toBe('cdn.example.com');
  });

  it('refuses schemes other than http and https', () => {
    for (const url of ['file:///etc/passwd', 'gopher://x.test/', 'data:text/plain,hi', 'ftp://x.test/']) {
      expect(() => parsePublicUrl(url), url).toThrow(BlockedUrlError);
    }
  });

  it('refuses credentials in the URL', () => {
    expect(() => parsePublicUrl('https://user:pass@example.com/x')).toThrow(/credentials/i);
  });

  it('refuses names that never point outside the host', () => {
    for (const url of [
      'http://localhost/x',
      'http://foo.localhost/x',
      'http://printer.local/x',
      'http://db.internal/x',
      'http://metadata.google.internal/computeMetadata/v1/',
    ]) {
      expect(() => parsePublicUrl(url), url).toThrow(/not reachable/i);
    }
  });

  it('refuses a literal private address without needing DNS', () => {
    expect(() => parsePublicUrl('http://169.254.169.254/latest/meta-data/')).toThrow(/not reachable/i);
    expect(() => parsePublicUrl('http://[::1]:8080/x')).toThrow(/not reachable/i);
  });

  it('carries a status the route can answer with', () => {
    try {
      parsePublicUrl('file:///etc/passwd');
      expect.unreachable();
    } catch (error) {
      expect((error as BlockedUrlError).status).toBe(400);
    }
  });
});
