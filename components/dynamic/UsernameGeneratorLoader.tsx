'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for UsernameGeneratorPage (faker-based username generator).
 */
const UsernameGeneratorLoader = dynamic(
  () => import(/* webpackChunkName: "username-gen" */ '@/features/username-generator/UsernameGenerator'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default UsernameGeneratorLoader;
