/**
 * Rebuilds `lib/credentialGenerator/wordlist.ts` — the passphrase word list.
 *
 * ── Why the list has exactly 4096 words ─────────────────────────────────────
 *
 * A passphrase's entropy is `wordCount × log2(listSize)`. At 4096 words that
 * is exactly 12 bits per word, so the figure the strength meter prints is
 * arithmetic a reader can check in their head: four words is 48 bits, six is
 * 72. The previous list held 2090 words — 11.03 bits each — while its own
 * docstring called it "an EFF-style wordlist". EFF's long list has 7776 words
 * at 12.92 bits; the claim was off by a factor of nearly four, on the one
 * number this tool exists to report.
 *
 * ── Where the words come from ───────────────────────────────────────────────
 *
 * `wordlist.source.txt` beside this script — the 2090-word list this project
 * curated by hand — plus the English adjective, noun, verb and adverb banks
 * from `@faker-js/faker`, which the project already depends on. Both are
 * ordinary English words. EFF's own list would be the better source and is not
 * reachable from here: this machine has no route to the open internet, and
 * vendoring a word list through a chat transcript is not a thing to do.
 *
 * The seed file is the input and `wordlist.ts` is the output — the build never
 * reads its own result, so the provenance stays checkable.
 *
 * ── Selection ───────────────────────────────────────────────────────────────
 *
 * 1. Lowercase, deduplicated, `^[a-z]{3,9}$` — no spaces, hyphens, accents or
 *    capitals, so a passphrase can be typed from a phone keyboard and read
 *    aloud over a phone call without spelling rules — minus the BLOCKED list
 *    below.
 * 2. Of the candidates that survive, the 4096 shortest are kept — ties broken
 *    alphabetically. Shorter words, shorter passphrase to type.
 * 3. Sorted, so the file diffs cleanly and the build is reproducible.
 *
 * Usage:
 *   node scripts/credential/wordlist.build.mjs          rewrite the file
 *   node scripts/credential/wordlist.build.mjs --check  fail if it is stale
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { faker } from '@faker-js/faker';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const TARGET = join(ROOT, 'lib', 'credentialGenerator', 'wordlist.ts');
const SEED = join(HERE, 'wordlist.source.txt');

/** 2^12. Changing this changes every entropy figure the tool prints. */
const LIST_SIZE = 4096;
const SHAPE = /^[a-z]{3,9}$/;

/**
 * Words kept out of the list.
 *
 * A passphrase is read aloud, pasted into a ticket, and — on the landing page
 * — shown to a stranger as the example of what this tool produces. Four words
 * drawn at random will occasionally land on a sentence nobody wants to read;
 * `deadly-scary-rude-salad` came out of the first build. Diceware lists are
 * curated for the same reason.
 *
 * This is a judgement call, not a rule: death, violence, illness, insults and
 * the handful of words that are unpleasant in any combination. It costs about
 * 1% of the pool and no entropy at all, since the list is trimmed to 4096
 * either way.
 */
const BLOCKED = new Set([
  'abuse', 'abusive', 'aching', 'afraid', 'aggressive', 'agonizing', 'angry',
  'anxious', 'ashamed', 'assault', 'awful', 'bitter', 'bleak', 'blood',
  'bloody', 'bomb', 'brutal', 'burial', 'cancer', 'corpse', 'crazy', 'creepy',
  'cruel', 'crying', 'damn', 'danger', 'dead', 'deadly', 'death', 'defeated',
  'depressed', 'despair', 'die', 'disease', 'disgusted', 'disgusting', 'drunk',
  'dying', 'evil', 'fatal', 'fear', 'fearful', 'filthy', 'foolish', 'frantic',
  'frightened', 'funeral', 'grave', 'grief', 'grim', 'guilty', 'gun', 'hate',
  'hateful', 'horrible', 'horror', 'hostile', 'hurt', 'idiot', 'ill', 'illness',
  'injury', 'insane', 'jealous', 'kill', 'killer', 'lonely', 'loser', 'miserable',
  'morbid', 'murder', 'nasty', 'obese', 'obnoxious', 'pain', 'painful', 'panic',
  'pathetic', 'poison', 'poor', 'rage', 'rotten', 'rude', 'sad', 'savage',
  'scary', 'scream', 'selfish', 'shame', 'sick', 'sickness', 'slaughter',
  'stupid', 'suffer', 'terrible', 'terror', 'threat', 'tragic', 'trauma',
  'ugly', 'vicious', 'victim', 'violent', 'vomit', 'war', 'weapon', 'wicked',
  'worthless', 'wound', 'wretched',
]);

function build() {
  const defs = faker.rawDefinitions ?? faker.definitions;
  const banks = ['adjective', 'noun', 'verb', 'adverb'];

  const usable = (w) => SHAPE.test(w) && !BLOCKED.has(w);

  const pool = new Set();
  for (const word of readFileSync(SEED, 'utf8').split('\n')) {
    const w = word.trim().toLowerCase();
    if (usable(w)) pool.add(w);
  }
  for (const bank of banks) {
    for (const word of defs.word?.[bank] ?? []) {
      const w = String(word).toLowerCase();
      if (usable(w)) pool.add(w);
    }
  }

  const candidates = [...pool].sort();
  if (candidates.length < LIST_SIZE) {
    throw new Error(`only ${candidates.length} candidates, need ${LIST_SIZE}`);
  }

  /* Shortest first, alphabetical within a length; then back to alphabetical
     for the file itself. */
  const kept = candidates
    .slice()
    .sort((a, b) => a.length - b.length || a.localeCompare(b))
    .slice(0, LIST_SIZE)
    .sort();

  return kept;
}

function render(words) {
  const lines = [];
  for (let i = 0; i < words.length; i += 8) {
    lines.push('  ' + words.slice(i, i + 8).map((w) => `'${w}',`).join(' '));
  }

  return `/**
 * Passphrase word list — ${words.length} words, exactly ${Math.log2(words.length)} bits each.
 *
 * GENERATED by scripts/credential/wordlist.build.mjs. Do not edit by hand:
 * that script documents where the words come from and why the list is a power
 * of two, and \`npm run check:wordlist\` fails if this file drifts from it.
 *
 * ${words.length} = 2^${Math.log2(words.length)}, so a passphrase's entropy is
 * \`wordCount × ${Math.log2(words.length)}\` bits with nothing rounded away.
 */

export const WORDS: readonly string[] = [
${lines.join('\n')}
] as const;

/** Exactly ${Math.log2(words.length)}. Read it from here rather than recomputing a log. */
export const BITS_PER_WORD = Math.log2(WORDS.length);
`;
}

const words = build();
const output = render(words);

if (process.argv.includes('--check')) {
  const existing = readFileSync(TARGET, 'utf8');
  if (existing !== output) {
    console.error(
      '✗ lib/credentialGenerator/wordlist.ts is stale — run `npm run build:wordlist`',
    );
    process.exit(1);
  }
  console.log(`✓ passphrase word list matches its source — ${words.length} words, ${Math.log2(words.length)} bits each`);
} else {
  writeFileSync(TARGET, output, 'utf8');
  console.log(`✓ wrote lib/credentialGenerator/wordlist.ts — ${words.length} words, ${Math.log2(words.length)} bits each`);
}
