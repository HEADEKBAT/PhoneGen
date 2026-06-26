/**
 * Company Generator — standalone engine.
 *
 * Generates locale-aware company data using Faker
 * with supplementary dictionaries for richer variety.
 */

import { getFakerForCountry, COUNTRY_NAMES } from './country';

/* ── Types ──────────────────────────────────────────────────────────────── */

export interface CompanyResult {
  name: string;
  industry: string;
  department: string;
  jobTitle: string;
  website: string;
  emailDomain: string;
  slogan: string;
  size: string;
  type: string;
  country: string;
  countryCode: string;
}

export interface CompanyOptions {
  country?: string;
}

export interface BulkCompanyOptions extends CompanyOptions {
  quantity: number;
}

/* ── Supplementary dictionaries ─────────────────────────────────────────── */

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
  'Retail', 'Energy', 'Transportation', 'Media', 'Agriculture',
  'Real Estate', 'Entertainment', 'Telecommunications', 'Biotechnology',
  'Aerospace', 'Cybersecurity', 'Artificial Intelligence', 'E-commerce',
  'Consulting', 'Hospitality', 'Insurance', 'Logistics', 'Pharmaceuticals',
  'Renewable Energy', 'Robotics', 'SaaS', 'Blockchain', 'Gaming',
  'EdTech', 'FinTech', 'HealthTech', 'CleanTech', 'LegalTech',
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Human Resources', 'Finance', 'Operations', 'Research', 'Customer Support',
  'Data Science', 'Security', 'Legal', 'Business Development', 'QA',
  'DevOps', 'Infrastructure', 'Analytics', 'Communications', 'Strategy',
];

const COMPANY_TYPES = [
  'Startup', 'SME', 'Enterprise', 'Corporation', 'Public Company',
  'Non-Profit', 'Agency', 'Freelance', 'B2B', 'B2C',
  'Platform', 'Marketplace', 'SaaS', 'Agency', 'Consultancy',
];

const SIZE_RANGES = [
  '1-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5000+',
];

const SLOGAN_TEMPLATES = [
  'Empowering {industry} through innovation',
  'Next-generation {industry} solutions',
  'Transforming {industry} for tomorrow',
  'Building the future of {industry}',
  'Revolutionizing {industry} worldwide',
  'Your trusted partner in {industry}',
  'Leading the way in {industry}',
  'Smart {industry} for modern businesses',
];

/* ── TLDs ───────────────────────────────────────────────────────────────── */

const TLDS = ['.com', '.io', '.app', '.dev', '.tech', '.co', '.net', '.org', '.ai'];

/* ── Generator ──────────────────────────────────────────────────────────── */

/**
 * Generate a single company.
 */
export function generateCompany(options: CompanyOptions = {}): CompanyResult {
  const countryCode = options.country ?? 'US';
  const faker = getFakerForCountry(countryCode);
  const country = COUNTRY_NAMES[countryCode] ?? countryCode;

  const name = faker.company.name();

  const industry = INDUSTRIES[Math.floor(Math.random() * INDUSTRIES.length)];
  const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
  const jobTitle = faker.person.jobTitle();
  const type = COMPANY_TYPES[Math.floor(Math.random() * COMPANY_TYPES.length)];
  const size = SIZE_RANGES[Math.floor(Math.random() * SIZE_RANGES.length)];

  /* Website from company name */
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 15);
  const tld = TLDS[Math.floor(Math.random() * TLDS.length)];
  const website = `${slug}${tld}`;

  /* Email domain */
  const emailDomain = website;

  /* Slogan */
  const sloganTemplate = SLOGAN_TEMPLATES[Math.floor(Math.random() * SLOGAN_TEMPLATES.length)];
  const slogan = sloganTemplate.replace('{industry}', industry.toLowerCase());

  return { name, industry, department, jobTitle, website, emailDomain, slogan, size, type, country, countryCode };
}

/**
 * Generate multiple companies.
 */
export function generateCompanies(options: BulkCompanyOptions): CompanyResult[] {
  const results: CompanyResult[] = [];
  for (let i = 0; i < options.quantity; i++) {
    results.push(generateCompany(options));
  }
  return results;
}
