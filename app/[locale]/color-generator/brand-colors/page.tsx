import { createToolPage } from '@/core';
import { brandColors } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(brandColors);
export { generateMetadata };
export default Page;
