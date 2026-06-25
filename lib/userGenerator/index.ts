/**
 * UserGen — public API.
 *
 * Everything a consumer (page, component, store) needs to know
 * is exported here.
 */

export { generateUser, generateUsers } from './generateUser';
export { getFakerForCountry, SUPPORTED_COUNTRY_CODES, COUNTRY_NAMES } from './countryLocaleMap';
export { generatePhone } from './generatePhone';
export { generateAvatar } from './generateAvatar';

export type { GeneratedUser, GenerateOptions, FilterOptions } from './types';
