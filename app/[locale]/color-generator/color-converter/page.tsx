import { createToolPage } from '@/core';
import { colorConverter } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(colorConverter);
export { generateMetadata };
export default Page;
