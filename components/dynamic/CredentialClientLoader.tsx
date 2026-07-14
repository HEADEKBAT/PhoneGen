'use client';

import dynamic from 'next/dynamic';
import CredentialSkeleton from '@/components/skeleton/CredentialSkeleton';

/**
 * Dynamic loader for CredentialGeneratorClient.
 *
 * Defer loading of the credential generator (which pulls in @faker-js/faker).
 * Shows a credential-specific skeleton while the chunk loads.
 */
const CredentialClientLoader = dynamic(
  () => import(/* webpackChunkName: "credential-client" */ '@/app/[locale]/credential-generator/client'),
  {
    loading: () => <CredentialSkeleton />,
    ssr: false,
  },
);

export default CredentialClientLoader;
