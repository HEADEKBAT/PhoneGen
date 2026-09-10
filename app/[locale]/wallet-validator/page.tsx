import { createStudioSEOPage } from '@/core';
import { getStudioSEOPage } from '@/lib/config/studioSEOPages';

const { generateMetadata, Page } = createStudioSEOPage(getStudioSEOPage('wallet-validator'));
export { generateMetadata };
export default Page;
