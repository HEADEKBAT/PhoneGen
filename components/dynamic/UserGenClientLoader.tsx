'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for UserGenClient (faker-based user generator).
 */
const UserGenClientLoader = dynamic(
  () => import(/* webpackChunkName: "user-gen" */ '@/app/[locale]/user-generator/client'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default UserGenClientLoader;
