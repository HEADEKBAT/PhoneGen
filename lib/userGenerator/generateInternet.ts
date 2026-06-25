/**
 * UserGen — internet profile generator.
 *
 * Produces IP address, MAC address, UUID, username, and display name
 * using the locale-aware Faker instance.
 */

import type { Faker } from '@faker-js/faker';

export interface InternetResult {
  username: string;
  displayName: string;
  ipAddress: string;
  macAddress: string;
  uuid: string;
}

/**
 * Generate internet profile data for a user.
 *
 * @param faker     Locale-aware Faker instance
 * @param fullName  The user's full name (for display name)
 * @param firstName The user's first name (for username fallback)
 */
export function generateInternet(
  faker: Faker,
  fullName: string,
  firstName: string,
): InternetResult {
  const username = faker.internet.username({ firstName, lastName: '' }).toLowerCase();
  const displayName = fullName;
  const ipAddress = faker.internet.ipv4();
  const macAddress = faker.internet.mac();
  const uuid = faker.string.uuid();

  return { username, displayName, ipAddress, macAddress, uuid };
}
