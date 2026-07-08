/**
 * Credential Generator — SEO Landing Pages Config.
 *
 * Defines metadata, hero content, and FAQ for each SEO landing page.
 * Each page is a thin server component that reads its config from here.
 */

export interface SEOFaq {
  q: string;
  a: string;
}

export interface SEOPageConfig {
  id: string;
  slug: string;
  mode: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel?: string;
  faqs: SEOFaq[];
}

const CREDENTIAL_FAQS: SEOFaq[] = [
  { q: 'How secure are generated passwords?', a: 'All passwords are generated using crypto.getRandomValues(), the Web Crypto API\'s cryptographically secure pseudorandom number generator. This is the same standard used by browsers for security-sensitive operations.' },
  { q: 'Are passwords generated locally?', a: 'Yes. All generation happens entirely in your browser. No data is sent to any server, and no credentials ever leave your device.' },
  { q: 'What password length should I use?', a: 'For most purposes, 16 characters provides excellent security. For master passwords or admin accounts, use 20-32 characters.' },
];

const PASSKEY_FAQS: SEOFaq[] = [
  { q: 'What is a passphrase?', a: 'A passphrase is a sequence of random words (e.g., "correct-horse-battery-staple"). Passphrases are easier to remember than random character passwords while providing comparable or better security.' },
  { q: 'How many words should a passphrase have?', a: 'A 4-word passphrase from a 7776-word list provides ~51 bits of entropy. For high security, use 5-6 words (~65-78 bits).' },
  { q: 'Is a passphrase more secure than a password?', a: 'A well-chosen passphrase can be both more secure and more memorable than a traditional password. The key is using sufficient word count and random selection.' },
];

const PIN_FAQS: SEOFaq[] = [
  { q: 'What is a PIN?', a: 'A PIN (Personal Identification Number) is a numeric code used for authentication. PINs are commonly used for ATM cards, mobile devices, and door access systems.' },
  { q: 'How long should a PIN be?', a: 'For most purposes, a 6-digit PIN provides a good balance of security and usability. For high-security applications, use 8 digits.' },
  { q: 'Are PINs secure?', a: 'PINs provide limited security due to their small keyspace. Use them only where the system includes rate limiting or lockout after failed attempts.' },
];

const UUID_FAQS: SEOFaq[] = [
  { q: 'What is UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit label used for unique identification in computer systems. UUID v4 is randomly generated.' },
  { q: 'Are UUIDs guaranteed to be unique?', a: 'While collisions are theoretically possible, the probability is extremely low (~1 in 2^122 for v4). They are safe for practical use in distributed systems.' },
  { q: 'What is UUID used for?', a: 'UUIDs are commonly used as database primary keys, API identifiers, session identifiers, and distributed system identifiers.' },
];

const UUID_V7_FAQS: SEOFaq[] = [
  { q: 'What is UUID v7?', a: 'UUID v7 is a time-ordered UUID format (RFC 9562) that encodes a Unix timestamp in the first 48 bits, making UUIDs sortable by creation time.' },
  { q: 'UUID v4 vs v7 — which to use?', a: 'Use UUID v7 when you need time-ordered sorting (e.g., database indexes). Use UUID v4 when you need purely random identifiers with no time information.' },
  { q: 'Is UUID v7 a standard?', a: 'Yes, UUID v7 is defined in RFC 9562 (2024). It is the recommended UUID version for new applications due to its time-sorting capability.' },
];

const JWT_FAQS: SEOFaq[] = [
  { q: 'What is a JWT Secret?', a: 'A JWT secret is a cryptographic key used to sign JSON Web Tokens (JWTs) via HMAC algorithms like HS256. It should be a high-entropy random string.' },
  { q: 'How long should a JWT secret be?', a: 'For HS256, use at least 32 bytes (256 bits) of random data. The generator produces 64 bytes by default, which exceeds security recommendations.' },
  { q: 'Can I use a passphrase as a JWT secret?', a: 'No. JWT secrets must be raw random bytes, not human-readable passphrases. Use a dedicated high-entropy random generator.' },
];

const API_KEY_FAQS: SEOFaq[] = [
  { q: 'What is an API Key?', a: 'An API key is a unique identifier used to authenticate API requests. They typically include a prefix (like sk_test_ for Stripe) to identify the key type.' },
  { q: 'How long should an API key be?', a: 'API keys should be at least 24 characters of random data. Most services use keys between 24-64 characters with a recognizable prefix.' },
  { q: 'Are generated API keys real?', a: 'No. All generated API keys are fake and formatted as realistic test keys. They are intended for development and testing purposes only.' },
];

const TOKEN_FAQS: SEOFaq[] = [
  { q: 'What is a random token?', a: 'A random token is a cryptographically random string used for authentication, authorization, or as a one-time code. Tokens can be hex, base64, or base64url encoded.' },
  { q: 'What token format should I use?', a: 'Use hex for compact string representation, base64 for shorter tokens (more bits per character), and base64url for tokens that appear in URLs.' },
  { q: 'How long should a token be?', a: 'For security tokens, use at least 32 hex characters (128 bits). For API tokens, 32-64 characters provides strong security.' },
];

const WEBHOOK_FAQS: SEOFaq[] = [
  { q: 'What is a Webhook Secret?', a: 'A webhook secret is a shared secret used to sign webhook payloads. It ensures that incoming webhooks are genuinely from the expected sender.' },
  { q: 'How is a webhook secret used?', a: 'The sender signs the webhook payload with the secret, and the receiver verifies the signature. This prevents tampering and forgery.' },
  { q: 'How long should a webhook secret be?', a: 'A webhook secret should be at least 32 bytes of random data. The whsec_ prefix identifies it as a webhook signing secret.' },
];

const SESSION_FAQS: SEOFaq[] = [
  { q: 'What is a Session Secret?', a: 'A session secret is used to sign and encrypt session cookies in web applications. It prevents tampering with session data.' },
  { q: 'How long should a session secret be?', a: '32 bytes (256 bits) is the recommended minimum. Session secrets should be raw random data encoded as Base64URL.' },
  { q: 'Can I rotate session secrets?', a: 'Yes. For production applications, rotate session secrets periodically and support multiple valid secrets during transition periods.' },
];

const STRENGTH_FAQS: SEOFaq[] = [
  { q: 'What is password strength?', a: 'Password strength measures how resistant a password is to guessing and brute-force attacks. It depends on length, character variety, and randomness.' },
  { q: 'What is password entropy?', a: 'Entropy measures unpredictability in bits. Each bit doubles the required guesses. 80+ bits is considered very strong for offline attacks.' },
  { q: 'How is crack time estimated?', a: 'Crack time is estimated based on the password\'s entropy and assumed attacker capabilities (offline: billions of guesses/sec, online: ~1000 guesses/sec).' },
  { q: 'What makes a password weak?', a: 'Short length, common patterns, dictionary words, personal information, and character repetition all reduce password strength significantly.' },
];

/* ── SEO Pages Registry ──────────────────────────────────────────────────── */

export const SEO_PAGES: Record<string, SEOPageConfig> = {
  'password-generator': {
    id: 'password-generator',
    slug: 'password-generator',
    mode: 'random',
    title: 'Password Generator — Create Strong Random Passwords',
    description: 'Generate strong, secure random passwords with configurable length, character types, and complexity. Free client-side password generator.',
    heroTitle: 'Password Generator',
    heroSubtitle: 'Create strong, secure passwords with full control over length and character types. All generation happens locally in your browser.',
    faqs: CREDENTIAL_FAQS,
  },
  'passphrase-generator': {
    id: 'passphrase-generator',
    slug: 'passphrase-generator',
    mode: 'passphrase',
    title: 'Passphrase Generator — Memorable XKCD-Style Passphrases',
    description: 'Generate memorable passphrases using random word lists. More secure than traditional passwords and easier to remember. Free passphrase generator.',
    heroTitle: 'Passphrase Generator',
    heroSubtitle: 'Create memorable XKCD-style passphrases that are both secure and easy to remember. Choose word count, separator, and style.',
    faqs: PASSKEY_FAQS,
  },
  'random-pin-generator': {
    id: 'random-pin-generator',
    slug: 'random-pin-generator',
    mode: 'pin',
    title: 'Random PIN Generator — Create Secure Numeric Codes',
    description: 'Generate random numeric PIN codes with configurable length (4-8 digits). Free client-side PIN generator for ATM, mobile, and access codes.',
    heroTitle: 'Random PIN Generator',
    heroSubtitle: 'Generate secure numeric PIN codes for ATM cards, mobile devices, door access, and more. Choose from 4, 6, or 8 digit lengths.',
    faqs: PIN_FAQS,
  },
  'api-key-generator': {
    id: 'api-key-generator',
    slug: 'api-key-generator',
    mode: 'api-key',
    title: 'API Key Generator — Create Test API Keys',
    description: 'Generate realistic API keys for testing. Supports Stripe-style, GitHub-style prefixes, and more. Free client-side API key generator.',
    heroTitle: 'API Key Generator',
    heroSubtitle: 'Generate realistic test API keys with recognizable prefixes for Stripe, GitHub, and custom formats. Perfect for development and testing.',
    faqs: API_KEY_FAQS,
  },
  'jwt-secret-generator': {
    id: 'jwt-secret-generator',
    slug: 'jwt-secret-generator',
    mode: 'jwt',
    title: 'JWT Secret Generator — Create HMAC Signing Secrets',
    description: 'Generate cryptographically strong JWT secrets for HS256 and other HMAC algorithms. Free client-side JWT secret generator.',
    heroTitle: 'JWT Secret Generator',
    heroSubtitle: 'Generate secure Base64URL-encoded HMAC secrets for signing JSON Web Tokens. 64 bytes of cryptographic randomness by default.',
    faqs: JWT_FAQS,
  },
  'random-token-generator': {
    id: 'random-token-generator',
    slug: 'random-token-generator',
    mode: 'token',
    title: 'Random Token Generator — Create Auth Tokens & One-Time Codes',
    description: 'Generate cryptographically random tokens in hex, base64, and base64url formats. Free client-side token generator.',
    heroTitle: 'Random Token Generator',
    heroSubtitle: 'Generate cryptographically random tokens for authentication, one-time codes, and API authorization in hex, base64, or base64url format.',
    faqs: TOKEN_FAQS,
  },
  'uuid-generator': {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    mode: 'uuid',
    title: 'UUID Generator — Create Unique Identifiers Online',
    description: 'Generate UUID v4 (random) identifiers. Free client-side UUID generator for database keys, API identifiers, and distributed systems.',
    heroTitle: 'UUID Generator',
    heroSubtitle: 'Generate random UUID v4 identifiers for use as database primary keys, API identifiers, and distributed system identifiers.',
    faqs: UUID_FAQS,
  },
  'uuid-v7-generator': {
    id: 'uuid-v7-generator',
    slug: 'uuid-v7-generator',
    mode: 'uuid-v7',
    title: 'UUID v7 Generator — Time-Ordered UUIDs (RFC 9562)',
    description: 'Generate time-ordered UUID v7 identifiers per RFC 9562. Sortable by creation time. Free client-side UUID v7 generator.',
    heroTitle: 'UUID v7 Generator',
    heroSubtitle: 'Generate time-ordered UUID v7 identifiers (RFC 9562) that are sortable by creation time — ideal for database indexes and distributed systems.',
    faqs: UUID_V7_FAQS,
  },
  'webhook-secret-generator': {
    id: 'webhook-secret-generator',
    slug: 'webhook-secret-generator',
    mode: 'webhook',
    title: 'Webhook Secret Generator — Create Signing Secrets',
    description: 'Generate secure webhook signing secrets with whsec_ prefix. Free client-side webhook secret generator.',
    heroTitle: 'Webhook Secret Generator',
    heroSubtitle: 'Generate cryptographically secure webhook signing secrets for verifying incoming webhook payloads.',
    faqs: WEBHOOK_FAQS,
  },
  'session-secret-generator': {
    id: 'session-secret-generator',
    slug: 'session-secret-generator',
    mode: 'session',
    title: 'Session Secret Generator — Create Secure Session Keys',
    description: 'Generate secure session signing secrets for web application cookies. Free client-side session secret generator.',
    heroTitle: 'Session Secret Generator',
    heroSubtitle: 'Generate secure Base64URL-encoded session secrets for signing and encrypting session cookies in web applications.',
    faqs: SESSION_FAQS,
  },
  'password-strength-checker': {
    id: 'password-strength-checker',
    slug: 'password-strength-checker',
    mode: 'strength',
    title: 'Password Strength Checker — Analyze Password Security',
    description: 'Check password strength, calculate entropy, estimate crack time. Free client-side password analyzer.',
    heroTitle: 'Password Strength Checker',
    heroSubtitle: 'Analyze password strength with entropy calculation, crack time estimation, and detailed weakness detection.',
    faqs: STRENGTH_FAQS,
  },
};

export const ALL_SEO_PAGES = Object.values(SEO_PAGES);
