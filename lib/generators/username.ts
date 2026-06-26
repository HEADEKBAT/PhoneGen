/**
 * Username Generator — standalone engine.
 *
 * Seven generation styles: classic, modern, developer, gaming,
 * professional, corporate, random.
 */

import { getFakerForCountry } from './country';

/* ── Types ──────────────────────────────────────────────────────────────── */

export type UsernameStyle =
  | 'classic'
  | 'modern'
  | 'developer'
  | 'gaming'
  | 'professional'
  | 'corporate'
  | 'random';

export interface UsernameResult {
  username: string;
  style: UsernameStyle;
}

export interface UsernameOptions {
  style?: UsernameStyle;
  country?: string;
  firstName?: string;
  lastName?: string;
}

export interface BulkUsernameOptions extends UsernameOptions {
  quantity: number;
}

/* ── Word banks ─────────────────────────────────────────────────────────── */

const ANIMALS = [
  'panda', 'tiger', 'eagle', 'wolf', 'hawk', 'fox', 'owl', 'bear',
  'lion', 'deer', 'duck', 'frog', 'hare', 'koala', 'lynx', 'mole',
  'orca', 'seal', 'swan', 'crow', 'raven', 'otter', 'bison', 'crane',
  'dove', 'elk', 'gecko', 'heron', 'ibis', 'jaguar', 'kiwi', 'cobra',
];

const COLORS = [
  'red', 'blue', 'green', 'gold', 'silver', 'coral', 'azure', 'amber',
  'bronze', 'crimson', 'emerald', 'indigo', 'jade', 'lime', 'mauve',
  'navy', 'olive', 'plum', 'ruby', 'teal', 'violet', 'aqua', 'beige',
  'charcoal', 'denim', 'frost', 'grape', 'honey', 'ivory', 'lilac',
];

const ADJECTIVES = [
  'swift', 'brave', 'calm', 'bold', 'quick', 'sharp', 'bright', 'cool',
  'dark', 'epic', 'fast', 'grand', 'happy', 'keen', 'lucky', 'neat',
  'prime', 'rare', 'safe', 'slim', 'tiny', 'vivid', 'wild', 'agile',
  'brisk', 'chill', 'dandy', 'elite', 'fancy', 'gleam', 'hyper',
];

/* ── Separator styles ───────────────────────────────────────────────────── */

type Sep = '' | '_' | '.' | '-' | '';

function randSep(): Sep {
  const seps: Sep[] = ['_', '.', '-', ''];
  return seps[Math.floor(Math.random() * seps.length)];
}

/* ── Generator ──────────────────────────────────────────────────────────── */

/**
 * Generate a single username in the given style.
 */
export function generateUsername(options: UsernameOptions = {}): UsernameResult {
  const style = options.style ?? 'random';
  const faker = getFakerForCountry(options.country ?? 'US');

  const firstName = (options.firstName ?? faker.person.firstName()).toLowerCase();
  const lastName = (options.lastName ?? faker.person.lastName()).toLowerCase();
  const num = Math.floor(Math.random() * 999);
  const bigNum = Math.floor(Math.random() * 9999);

  let username: string;

  switch (style) {
    case 'classic':
      username = `${firstName}${lastName}${num > 100 ? num : ''}`;
      break;

    case 'modern': {
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      username = `${color}${animal}`;
      break;
    }

    case 'developer': {
      const roles = ['dev', 'coder', 'js', 'ts', 'rust', 'web', 'fullstack', 'backend', 'frontend'];
      const role = roles[Math.floor(Math.random() * roles.length)];
      username = `${firstName[0]}${lastName}_${role}${num > 500 ? num : ''}`;
      break;
    }

    case 'gaming': {
      const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const prefix = adj.charAt(0).toUpperCase() + adj.slice(1);
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const animCap = animal.charAt(0).toUpperCase() + animal.slice(1);
      username = `${prefix}${animCap}${bigNum}`;
      break;
    }

    case 'professional': {
      const sep = '.' as Sep;
      username = `${firstName}${sep}${lastName}`;
      break;
    }

    case 'corporate': {
      const sep = randSep();
      const patterns = [
        () => `${firstName[0]}${lastName}`,
        () => `${firstName}${lastName[0]}`,
        () => `${firstName}${sep}${lastName}`,
        () => `${lastName}${firstName[0]}`,
      ];
      username = patterns[Math.floor(Math.random() * patterns.length)]();
      break;
    }

    case 'random':
    default: {
      const styles: UsernameStyle[] = ['classic', 'modern', 'developer', 'gaming', 'professional', 'corporate'];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      return generateUsername({ ...options, style: randomStyle });
    }
  }

  return { username, style };
}

/**
 * Generate multiple usernames.
 */
export function generateUsernames(options: BulkUsernameOptions): UsernameResult[] {
  const results: UsernameResult[] = [];
  for (let i = 0; i < options.quantity; i++) {
    results.push(generateUsername(options));
  }
  return results;
}
