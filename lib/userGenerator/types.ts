/**
 * UserGen — core types for generated user profiles.
 *
 * Every field maps to a user-generator sub-generator.
 * The GeneratedUser interface is the single source of truth.
 */

/** @inline */
export interface GeneratedUser {
  /** Unique identifier (nanoid/uuid) */
  id: string;
  /** DiceBear avatar URL (deterministic via seed) */
  avatar: string;

  /* ── Identity ────────────────────────────────────────────────────── */
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female';

  /* ── Demographics ────────────────────────────────────────────────── */
  /** ISO 8601 birth date */
  birthDate: string;
  /** Computed age (integer) */
  age: number;

  /* ── Contact ─────────────────────────────────────────────────────── */
  email: string;
  alternativeEmail: string;
  /** International format phone number (from PhoneGen) */
  phone: string;

  /* ── Online ──────────────────────────────────────────────────────── */
  username: string;
  displayName: string;
  password: string;

  /* ── Address ─────────────────────────────────────────────────────── */
  /** Full country name (e.g. "United States") */
  country: string;
  /** ISO 3166-1 alpha-2 code (e.g. "US") */
  countryCode: string;
  city: string;
  street: string;
  postalCode: string;
  /** Composed address: street, city, postalCode, country */
  fullAddress: string;

  /* ── Business ────────────────────────────────────────────────────── */
  company: string;
  department: string;
  jobTitle: string;
  website: string;

  /* ── Internet ────────────────────────────────────────────────────── */
  ipAddress: string;
  macAddress: string;
  uuid: string;
}

/** @inline */
export interface GenerateOptions {
  /** ISO 3166-1 alpha-2 country code (e.g. "US") */
  country: string;
  /** Number of users to generate (1 | 5 | 10 | 25 | 50 | 100) */
  quantity: number;
  /** Gender filter (default 'any') */
  gender?: 'male' | 'female' | 'any';
  /** Minimum age (18–99, default 18) */
  ageMin?: number;
  /** Maximum age (18–99, default 65) */
  ageMax?: number;
  /** Deterministic seed for reproducible generation */
  seed?: string;
}

/** @inline */
export interface FilterOptions {
  /** Free-text search query (matches name, email, phone, company, username) */
  query: string;
  /** ISO country code filter */
  country?: string;
  /** Gender filter */
  gender?: 'male' | 'female' | 'any';
  /** Minimum age */
  ageMin?: number;
  /** Maximum age */
  ageMax?: number;
}
