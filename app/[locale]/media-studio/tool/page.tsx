import { createStudioToolPage } from '@/core';
import { getStudioToolPage } from '@/lib/config/studioToolPages';

const { generateMetadata, Page } = createStudioToolPage(getStudioToolPage('media-studio'));
export { generateMetadata };
export default Page;
