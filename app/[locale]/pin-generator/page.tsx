import { createCredentialDeepLinkPage } from '@/core';
import { getCredentialDeepLink } from '@/lib/config/credentialDeepLinks';

const { generateMetadata, Page } = createCredentialDeepLinkPage(
  getCredentialDeepLink('pin-generator'),
);
export { generateMetadata };
export default Page;
