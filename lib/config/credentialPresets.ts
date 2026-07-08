/**
 * Credential Generator — Preset Definitions.
 *
 * Each preset configures the generator for a specific service.
 * Presets are pure data — add one entry per service, no code changes.
 */

import type { ActiveTab, PasswordMode, SecretMode } from '@/lib/credentialGenerator/types';

export interface PresetConfig {
  activeTab: ActiveTab;
  passwordMode?: PasswordMode;
  secretMode?: SecretMode;
  length?: number;
  prefix?: string;
  wordCount?: number;
  separator?: '-' | '_' | '.' | ' ';
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  avoidAmbiguous?: boolean;
}

export interface Preset {
  id: string;
  label: string;
  service: string;
  icon: string;
  category: 'wifi' | 'cloud' | 'database' | 'devops' | 'auth' | 'bot' | 'service';
  config: PresetConfig;
}

export const PRESETS: Record<string, Preset> = {
  wifi: {
    id: 'wifi',
    label: 'Wi-Fi',
    service: 'Wi-Fi Password',
    icon: 'Wifi',
    category: 'service',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 63,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      avoidAmbiguous: true,
    },
  },
  github: {
    id: 'github',
    label: 'GitHub',
    service: 'GitHub Token',
    icon: 'Github',
    category: 'cloud',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'api-key',
      length: 40,
      prefix: 'ghp_',
    },
  },
  google: {
    id: 'google',
    label: 'Google',
    service: 'Google Account',
    icon: 'Lock',
    category: 'cloud',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 20,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  },
  aws: {
    id: 'aws',
    label: 'AWS',
    service: 'AWS Secret',
    icon: 'Lock',
    category: 'cloud',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'jwt',
      length: 64,
    },
  },
  azure: {
    id: 'azure',
    label: 'Azure',
    service: 'Azure Secret',
    icon: 'Lock',
    category: 'cloud',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'hex',
      length: 32,
    },
  },
  firebase: {
    id: 'firebase',
    label: 'Firebase',
    service: 'Firebase Key',
    icon: 'Lock',
    category: 'cloud',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'api-key',
      prefix: 'AIza',
    },
  },
  supabase: {
    id: 'supabase',
    label: 'Supabase',
    service: 'Supabase Secret',
    icon: 'Lock',
    category: 'cloud',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'jwt',
      length: 64,
    },
  },
  mongodb: {
    id: 'mongodb',
    label: 'MongoDB',
    service: 'MongoDB Password',
    icon: 'Database',
    category: 'database',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  },
  postgresql: {
    id: 'postgresql',
    label: 'PostgreSQL',
    service: 'PostgreSQL Password',
    icon: 'Database',
    category: 'database',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
      avoidAmbiguous: true,
    },
  },
  mysql: {
    id: 'mysql',
    label: 'MySQL',
    service: 'MySQL Password',
    icon: 'Database',
    category: 'database',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 20,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  },
  redis: {
    id: 'redis',
    label: 'Redis',
    service: 'Redis Password',
    icon: 'Lock',
    category: 'database',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  },
  docker: {
    id: 'docker',
    label: 'Docker',
    service: 'Docker Secret',
    icon: 'Container',
    category: 'devops',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'hex',
      length: 32,
    },
  },
  ssh: {
    id: 'ssh',
    label: 'SSH',
    service: 'SSH Password',
    icon: 'Lock',
    category: 'devops',
    config: {
      activeTab: 'passwords',
      passwordMode: 'random',
      length: 32,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  },
  jwt: {
    id: 'jwt',
    label: 'JWT',
    service: 'JWT Secret',
    icon: 'Lock',
    category: 'auth',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'jwt',
    },
  },
  oauth: {
    id: 'oauth',
    label: 'OAuth',
    service: 'OAuth Secret',
    icon: 'ShieldCheck',
    category: 'auth',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'jwt',
      length: 32,
    },
  },
  'discord-bot': {
    id: 'discord-bot',
    label: 'Discord Bot',
    service: 'Discord Bot Token',
    icon: 'Lock',
    category: 'bot',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'api-key',
      length: 24,
      prefix: '',
    },
  },
  'telegram-bot': {
    id: 'telegram-bot',
    label: 'Telegram Bot',
    service: 'Telegram Bot Token',
    icon: 'Lock',
    category: 'bot',
    config: {
      activeTab: 'pins-secrets',
      secretMode: 'api-key',
      prefix: '',
    },
  },
};

/** All presets as an array. */
export const ALL_PRESETS = Object.values(PRESETS);

/** Get a single preset by ID. */
export function getPreset(id: string): Preset | undefined {
  return PRESETS[id];
}

/** Get presets by category. */
export function getPresetsByCategory(category: Preset['category']): Preset[] {
  return ALL_PRESETS.filter((p) => p.category === category);
}
