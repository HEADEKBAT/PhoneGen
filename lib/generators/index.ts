/**
 * GenCore Generator Engines — barrel export.
 *
 * Re-exports all standalone generator functions.
 * Each module is a pure-function engine with no UI dependencies.
 */

/* Country / locale */
export { getFakerForCountry, SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from './country';

/* Shared utilities */
export { pick, shuffle, clamp } from './utils';

/* Address */
export { generateAddress, generateAddresses } from './address';
export type { AddressResult, AddressOptions, BulkAddressOptions } from './address';

/* Email */
export { generateEmail, generateEmails } from './email';
export type { EmailResult, EmailMode, EmailOptions, BulkEmailOptions } from './email';

/* Username */
export { generateUsername, generateUsernames } from './username';
export type { UsernameResult, UsernameStyle, UsernameOptions, BulkUsernameOptions } from './username';

/* Company */
export { generateCompany, generateCompanies } from './company';
export type { CompanyResult, CompanyOptions, BulkCompanyOptions } from './company';
