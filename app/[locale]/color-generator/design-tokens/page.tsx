import { createToolPage } from '@/core';
import { designTokens } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(designTokens);
export { generateMetadata };
export default Page;
