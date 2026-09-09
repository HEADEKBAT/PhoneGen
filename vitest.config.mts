/**
 * Vitest configuration.
 *
 * Deliberately a plain object rather than `defineConfig` from 'vitest/config':
 * that import would make `tsc --noEmit` fail for anyone who has not installed
 * dev dependencies yet, and the config is small enough not to need the types.
 *
 * Only pure logic is under test so far — no DOM, no canvas — so the node
 * environment is enough and the suite stays fast.
 */

import { fileURLToPath } from 'node:url';

export default {
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'core/**/*.test.ts'],
    // Studios that need a browser are not covered yet; excluding node_modules
    // and the build output keeps the glob from wandering.
    exclude: ['node_modules/**', '.next/**'],
    reporters: ['default'],
  },
};
