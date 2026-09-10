import { createCredentialDeepLinkPage } from '@/core';
import { getCredentialDeepLink } from '@/lib/config/credentialDeepLinks';

const { generateMetadata, Page } = createCredentialDeepLinkPage(
  getCredentialDeepLink('human-password-generator'),
);
export { generateMetadata };
export default Page;
