import { createToolPage } from '@/core';
import { themeBuilder } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(themeBuilder);
export { generateMetadata };
export default Page;
