import { createToolPage } from '@/core';
import { colorNames } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(colorNames);
export { generateMetadata };
export default Page;
