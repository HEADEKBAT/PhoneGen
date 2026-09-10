import { createStudioToolPage } from '@/core';
import { getStudioToolPage } from '@/lib/config/studioToolPages';

const { generateMetadata, Page } = createStudioToolPage(getStudioToolPage('email-generator'));
export { generateMetadata };
export default Page;
