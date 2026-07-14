'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for EmailGeneratorPage (faker-based email generator).
 */
const EmailGeneratorLoader = dynamic(
  () => import(/* webpackChunkName: "email-gen" */ '@/features/email-generator/EmailGenerator'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default EmailGeneratorLoader;
