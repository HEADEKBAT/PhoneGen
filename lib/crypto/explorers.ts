/**
 * Crypto Wallet Playground — Blockchain Explorer Links.
 *
 * URLs for blockchain explorers per network and address type.
 */

import type { NetworkId } from './types';
import { getNetwork } from './networks';

export interface ExplorerLink {
  label: string;
  url: string;
  type: 'address' | 'transaction' | 'block' | 'token' | 'network';
}

export function getExplorerUrl(
  network: NetworkId,
  address: string,
  type: 'address' | 'transaction' = 'address',
): string {
  const net = getNetwork(network);
  const base = net.explorerUrl;

  switch (type) {
    case 'address':
      return `${base}/address/${address}`;
    case 'transaction':
      return `${base}/tx/${address}`;
    default:
      return base;
  }
}

export function getTestnetExplorerUrl(
  network: NetworkId,
  address: string,
  type: 'address' | 'transaction' = 'address',
): string | null {
  const net = getNetwork(network);
  if (!net.testnetExplorerUrl) return null;

  switch (type) {
    case 'address':
      return `${net.testnetExplorerUrl}/address/${address}`;
    case 'transaction':
      return `${net.testnetExplorerUrl}/tx/${address}`;
    default:
      return net.testnetExplorerUrl;
  }
}

export function getAllExplorerLinks(
  network: NetworkId,
  address: string,
): ExplorerLink[] {
  const links: ExplorerLink[] = [];
  const net = getNetwork(network);

  links.push({
    label: `${net.name} Address Explorer`,
    url: getExplorerUrl(network, address, 'address'),
    type: 'address',
  });

  if (net.testnetExplorerUrl) {
    links.push({
      label: `${net.name} Testnet Explorer`,
      url: getTestnetExplorerUrl(network, address, 'address')!,
      type: 'address',
    });
  }

  links.push({
    label: `${net.name} Network Info`,
    url: net.explorerUrl,
    type: 'network',
  });

  return links;
}
