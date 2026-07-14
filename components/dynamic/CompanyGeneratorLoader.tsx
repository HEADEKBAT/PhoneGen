'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for CompanyGeneratorPage (faker-based company generator).
 */
const CompanyGeneratorLoader = dynamic(
  () => import(/* webpackChunkName: "company-gen" */ '@/features/company-generator/CompanyGenerator'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default CompanyGeneratorLoader;
