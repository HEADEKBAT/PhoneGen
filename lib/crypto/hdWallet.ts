/**
 * Crypto Wallet Playground — HD Wallet Explorer.
 *
 * BIP32/BIP44 derivation tree explorer.
 * Interactive visualization of wallet key derivation paths.
 */

import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import type { HDNode, NetworkId } from './types';
import { getNetwork } from './networks';

export interface DerivationOptions {
  mnemonic: string;
  passphrase?: string;
  network: NetworkId;
  accountIndex?: number;
  maxDepth?: number;
}

export function buildDerivationTree(options: DerivationOptions): HDNode {
  const {
    mnemonic,
    passphrase = '',
    network,
    accountIndex = 0,
    maxDepth = 2,
  } = options;

  const seed = mnemonicToSeedSync(mnemonic, passphrase);
  const masterKey = HDKey.fromMasterSeed(seed);
  const net = getNetwork(network);

  const root: HDNode = {
    path: 'm',
    depth: 0,
    index: 0,
    hardened: false,
    children: [],
  };

  if (maxDepth < 1) return root;

  // Purpose level (BIP44)
  const purposeNode: HDNode = {
    path: "m/44'",
    depth: 1,
    index: 44,
    hardened: true,
    children: [],
  };
  root.children.push(purposeNode);

  if (maxDepth < 2) return root;

  // Coin type level
  const coinTypeNode: HDNode = {
    path: `m/44'/${net.coinType}'`,
    depth: 2,
    index: net.coinType,
    hardened: true,
    children: [],
  };
  purposeNode.children.push(coinTypeNode);

  if (maxDepth < 3) return root;

  // Account level
  const accountNode: HDNode = {
    path: `m/44'/${net.coinType}'/${accountIndex}'`,
    depth: 3,
    index: accountIndex,
    hardened: true,
    children: [],
  };
  coinTypeNode.children.push(accountNode);

  if (maxDepth < 4) return root;

  // Change level (0 = external, 1 = change/internal)
  for (const change of [0, 1]) {
    const changeNode: HDNode = {
      path: `m/44'/${net.coinType}'/${accountIndex}'/${change}`,
      depth: 4,
      index: change,
      hardened: false,
      children: [],
    };
    accountNode.children.push(changeNode);

    if (maxDepth < 5) continue;

    // Address index level
    for (let addrIdx = 0; addrIdx < 3; addrIdx++) {
      const fullPath = `m/44'/${net.coinType}'/${accountIndex}'/${change}/${addrIdx}`;
      const derived = masterKey.derive(fullPath);

      let address: string | undefined;
      try {
        const pubKey = derived.publicKey;
        if (pubKey) {
          if (network === 'ethereum') {
            const hash = keccak_256(pubKey.slice(1));
            const addrBytes = hash.slice(-20);
            address = '0x' + bytesToHex(addrBytes);
          } else {
            address = `[${network} address from path]`;
          }
        }
      } catch {
        // Address generation not available for this network
      }

      const addrNode: HDNode = {
        path: fullPath,
        depth: 5,
        index: addrIdx,
        hardened: false,
        address,
        children: [],
      };
      changeNode.children.push(addrNode);
    }
  }

  return root;
}

export function getDerivationPathParts(
  path: string,
): { purpose: number; coinType: number; account: number; change: number; addressIndex: number } | null {
  const parts = path.split('/');
  if (parts.length < 6) return null;

  try {
    return {
      purpose: parseInt(parts[1]!.replace("'", '')),
      coinType: parseInt(parts[2]!.replace("'", '')),
      account: parseInt(parts[3]!.replace("'", '')),
      change: parseInt(parts[4]!),
      addressIndex: parseInt(parts[5]!),
    };
  } catch {
    return null;
  }
}

export function getHumanReadablePath(path: string, network: NetworkId): string {
  const parts = getDerivationPathParts(path);
  if (!parts) return path;

  const net = getNetwork(network);

  return [
    `Purpose: 44' (BIP44)`,
    `Coin: ${net.coinType}' (${net.symbol})`,
    `Account: ${parts.account}'`,
    `Chain: ${parts.change === 0 ? 'External (Receiving)' : 'Internal (Change)'}`,
    `Index: ${parts.addressIndex}`,
  ].join(' → ');
}
