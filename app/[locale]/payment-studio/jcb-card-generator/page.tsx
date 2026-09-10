import { createStudioSEOPage } from '@/core';
import { getStudioSEOPage } from '@/lib/config/studioSEOPages';

const { generateMetadata, Page } = createStudioSEOPage(getStudioSEOPage('payment-studio/jcb-card-generator'));
export { generateMetadata };
export default Page;
