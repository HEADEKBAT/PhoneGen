'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Generic dynamic loader for faker-based generator tool pages.
 *
 * Defer loading of generators that pull in @faker-js/faker (user, address,
 * company, email, username generators). Shows a tool skeleton while loading.
 *
 * @example
 * ```tsx
 * import GeneratorToolLoader from '@/components/dynamic/GeneratorToolLoader';
 * const Loader = GeneratorToolLoader(() => import('../client'));
 * ```
 */

// Factory that returns a dynamic component for a given import path.
// Each tool page passes its own loader function.
export function createGeneratorLoader<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
) {
  return dynamic(importFn, {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  });
}

export default GeneratorToolSkeleton;
