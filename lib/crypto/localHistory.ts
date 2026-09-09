/**
 * Crypto Wallet Playground — Local History Storage.
 *
 * Stores generated wallets, validations, and conversions in localStorage.
 * User-controlled — can be disabled or cleared at any time.
 */

import type { HistoryEntry } from './types';

const STORAGE_KEY = 'crypto-wallet-playground-history';
const MAX_ENTRIES = 100;

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): HistoryEntry {
  const history = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  history.unshift(newEntry);

  // Keep only last MAX_ENTRIES
  const trimmed = history.slice(0, MAX_ENTRIES);
  saveHistory(trimmed);

  return newEntry;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage not available
  }
}

export function removeHistoryEntry(id: string): void {
  const history = getHistory();
  const filtered = history.filter((e) => e.id !== id);
  saveHistory(filtered);
}

export function isHistoryEnabled(): boolean {
  try {
    localStorage.getItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage not available or full
  }
}
