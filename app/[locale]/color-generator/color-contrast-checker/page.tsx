import { createToolPage } from '@/core';
import { colorContrastChecker } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(colorContrastChecker);
export { generateMetadata };
export default Page;
