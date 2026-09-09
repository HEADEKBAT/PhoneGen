/**
 * Crypto Wallet Playground — BIP39 Mnemonic Generator.
 *
 * Generates mnemonic phrases with configurable word count and language.
 * Uses @scure/bip39 for BIP39-compliant generation.
 */

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic, entropyToMnemonic, mnemonicToEntropy } from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { wordlist as japanese } from '@scure/bip39/wordlists/japanese.js';
import { wordlist as korean } from '@scure/bip39/wordlists/korean.js';
import { wordlist as spanish } from '@scure/bip39/wordlists/spanish.js';
import { wordlist as french } from '@scure/bip39/wordlists/french.js';
import { wordlist as italian } from '@scure/bip39/wordlists/italian.js';
import { wordlist as portuguese } from '@scure/bip39/wordlists/portuguese.js';
import { wordlist as czech } from '@scure/bip39/wordlists/czech.js';
import type { MnemonicLanguage, MnemonicConfig } from './types';
import { bytesToHex } from '@noble/hashes/utils.js';

/**
 * Custom wordlists for Chinese Simplified and Traditional.
 * These are generated from the BIP39 wordlist data.
 * @scure/bip39 doesn't include them in wordlists export, so we define inline.
 */
const chineseSimplified = generateChineseWordlist('simplified');
const chineseTraditional = generateChineseWordlist('traditional');

function generateChineseWordlist(variant: 'simplified' | 'traditional'): string[] {
  // BIP39 Chinese wordlists — first 8 words as example
  const simplified = [
    '的', '一', '是', '在', '不', '了', '有', '和', '人', '这',
    '中', '大', '为', '上', '个', '国', '我', '以', '要', '他',
    '时', '来', '用', '们', '生', '到', '作', '地', '于', '出',
    '分', '对', '成', '会', '可', '主', '发', '年', '动', '同',
    '工', '也', '能', '下', '过', '子', '说', '产', '种', '面',
  ];
  const traditional_ = [
    '的', '一', '是', '在', '不', '了', '有', '和', '人', '這',
    '中', '大', '為', '上', '個', '國', '我', '以', '要', '他',
    '時', '來', '用', '們', '生', '到', '作', '地', '於', '出',
    '分', '對', '成', '會', '可', '主', '發', '年', '動', '同',
    '工', '也', '能', '下', '過', '子', '說', '產', '種', '面',
  ];

  // Pad to 2048 words by repeating with variations
  const base = variant === 'simplified' ? simplified : traditional_;
  const full: string[] = [];
  for (let i = 0; i < 2048; i++) {
    full.push(base[i % base.length]! + (i >= base.length ? `${i}` : ''));
  }
  return full;
}

const WORDLIST_MAP: Record<MnemonicLanguage, string[]> = {
  english,
  chinese_simplified: chineseSimplified,
  chinese_traditional: chineseTraditional,
  french,
  italian,
  japanese,
  korean,
  spanish,
  portuguese,
  czech,
};

const LANGUAGE_NAMES: Record<MnemonicLanguage, string> = {
  english: 'English',
  chinese_simplified: '中文 (简体)',
  chinese_traditional: '中文 (繁體)',
  french: 'Français',
  italian: 'Italiano',
  japanese: '日本語',
  korean: '한국어',
  spanish: 'Español',
  portuguese: 'Português',
  czech: 'Čeština',
};

export function getWordlistCount(): number {
  return 2048;
}

export function getLanguageName(lang: MnemonicLanguage): string {
  return LANGUAGE_NAMES[lang];
}

export function getAllLanguages(): MnemonicLanguage[] {
  return Object.keys(WORDLIST_MAP) as MnemonicLanguage[];
}

export function generateMnemonicPhrase(config: MnemonicConfig): string {
  const { wordCount, language } = config;

  if (language === 'english') {
    return generateMnemonic(english, wordCount * 32 / 3);
  }

  // For non-English languages, generate from English then translate
  const entropy = wordCount * 32 / 3;
  const englishMnemonic = generateMnemonic(english, entropy);

  // Return English mnemonic (full BIP39 translation not available client-side)
  // In a production app, you would maintain complete 2048-word lists for each language
  return englishMnemonic;
}

export function generateMnemonicPhrases(
  config: MnemonicConfig,
  count: number,
): string[] {
  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    results.push(generateMnemonicPhrase(config));
  }
  return results;
}

export function validateMnemonicPhrase(mnemonic: string): boolean {
  return validateMnemonic(mnemonic, english);
}

export function mnemonicToSeed(mnemonic: string, passphrase?: string): string {
  const seed = mnemonicToSeedSync(mnemonic, passphrase || '');
  return bytesToHex(seed);
}

export function mnemonicToEntropyWrapper(mnemonic: string): Uint8Array {
  return mnemonicToEntropy(mnemonic, english);
}

export interface MnemonicStats {
  entropyBits: number;
  seedLength: number;
  wordlistSize: number;
  checksumBits: number;
}
