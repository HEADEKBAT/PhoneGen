/**
 * UserGen — company / business generator.
 *
 * Produces realistic employer data: company name, department,
 * job title, and a plausible website.
 */

import type { Faker } from '@faker-js/faker';

export interface CompanyResult {
  company: string;
  department: string;
  jobTitle: string;
  website: string;
}

/**
 * Generate business data for a user.
 *
 * @param faker  Locale-aware Faker instance
 * @param firstName Used to personalise the website (optional)
 */
export function generateCompany(faker: Faker, firstName?: string): CompanyResult {
  const company = faker.company.name();

  /* Buzz-phrase style department — feels more real than "Engineering" alone */
  const department = faker.company.buzzPhrase();

  const jobTitle = faker.person.jobTitle();

  /* Derive a plausible website from the company name */
  const slug = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 15);
  const tlds = ['.io', '.com', '.app', '.dev', '.tech', '.co'];
  const tld = tlds[Math.floor(Math.random() * tlds.length)];
  const website = `${slug}${tld}`;

  return { company, department, jobTitle, website };
}
