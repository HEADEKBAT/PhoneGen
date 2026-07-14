'use client';

import dynamic from 'next/dynamic';
import GeneratorToolSkeleton from '@/components/skeleton/GeneratorToolSkeleton';

/**
 * Dynamic loader for PhoneGeneratorClient.
 *
 * Defers loading of the phone generator (which pulls in libphonenumber-js
 * metadata). Shows a generic generator skeleton while the chunk loads.
 *
 * Only renders on the client (ssr: false) — phone number generation is
 * entirely browser-based and doesn't benefit from SSR.
 */
const PhoneGeneratorLoader = dynamic(
  () => import(/* webpackChunkName: "phone-generator" */ '@/app/[locale]/phone-generator/client'),
  {
    loading: () => <GeneratorToolSkeleton />,
    ssr: false,
  },
);

export default PhoneGeneratorLoader;
