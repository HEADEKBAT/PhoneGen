'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for AddressGeneratorPage (faker-based address generator).
 */
const AddressGeneratorLoader = dynamic(
  () => import(/* webpackChunkName: "address-gen" */ '@/features/address-generator/AddressGenerator'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default AddressGeneratorLoader;
