/**
 * Crypto Wallet Playground — Test Wallet Profiles.
 *
 * Known test addresses for public testnets (Sepolia, Holesky, etc.).
 * These are publicly documented test addresses — never use for real funds.
 */

import type { NetworkId } from './types';

export interface TestWallet {
  network: NetworkId;
  name: string;
  address: string;
  privateKey?: string;
  mnemonic?: string;
  networkType: 'mainnet' | 'testnet';
  explorerUrl: string;
  faucetUrl?: string;
  notes: string;
}

export const TEST_WALLETS: TestWallet[] = [
  {
    network: 'ethereum',
    name: 'Ethereum Sepolia Test Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    networkType: 'testnet',
    explorerUrl: 'https://sepolia.etherscan.io',
    faucetUrl: 'https://sepoliafaucet.com',
    notes: 'Public test address for Sepolia testnet. Do not send mainnet ETH.',
  },
  {
    network: 'ethereum',
    name: 'Ethereum Holesky Test Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    networkType: 'testnet',
    explorerUrl: 'https://holesky.etherscan.io',
    faucetUrl: 'https://holesky-faucet.pk910.de',
    notes: 'Public test address for Holesky testnet.',
  },
  {
    network: 'polygon',
    name: 'Polygon Amoy Test Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    networkType: 'testnet',
    explorerUrl: 'https://amoy.polygonscan.com',
    faucetUrl: 'https://faucet.polygon.technology',
    notes: 'Public test address for Polygon Amoy testnet.',
  },
  {
    network: 'bnb-chain',
    name: 'BNB Chain Testnet Wallet',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    networkType: 'testnet',
    explorerUrl: 'https://testnet.bscscan.com',
    faucetUrl: 'https://testnet.bnbchain.org/faucet-smart',
    notes: 'Public test address for BNB Smart Chain testnet.',
  },
  {
    network: 'bitcoin',
    name: 'Bitcoin Testnet Wallet',
    address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
    networkType: 'testnet',
    explorerUrl: 'https://blockstream.info/testnet',
    faucetUrl: 'https://bitcoinfaucet.uo1.net',
    notes: 'Public testnet SegWit address. Do not send mainnet BTC.',
  },
  {
    network: 'bitcoin',
    name: 'Bitcoin Testnet Legacy',
    address: 'n4VQ5YdHf7hLQ2gWQYYZxru3U2tWbRNE1H',
    networkType: 'testnet',
    explorerUrl: 'https://blockstream.info/testnet',
    faucetUrl: 'https://testnet-faucet.mempool.co',
    notes: 'Public testnet Legacy (P2PKH) address.',
  },
  {
    network: 'solana',
    name: 'Solana Testnet Wallet',
    address: '6SB8VsVY3pNFMysCqFCPKF5ETkzkPYKgmVuWKBypzKiF',
    networkType: 'testnet',
    explorerUrl: 'https://explorer.solana.com/?cluster=testnet',
    faucetUrl: 'https://faucet.solana.com',
    notes: 'Public test address for Solana testnet/devnet.',
  },
];

export function getTestWalletsByNetwork(network: NetworkId): TestWallet[] {
  return TEST_WALLETS.filter((w) => w.network === network);
}

export function getTestWalletsByType(networkType: 'mainnet' | 'testnet'): TestWallet[] {
  return TEST_WALLETS.filter((w) => w.networkType === networkType);
}

export function getAllTestWallets(): TestWallet[] {
  return TEST_WALLETS;
}
