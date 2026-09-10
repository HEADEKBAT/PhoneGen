import { createStudioSEOPage } from '@/core';
import { getStudioSEOPage } from '@/lib/config/studioSEOPages';

const { generateMetadata, Page } = createStudioSEOPage(getStudioSEOPage('payment-studio/amex-card-generator'));
export { generateMetadata };
export default Page;
