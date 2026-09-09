import { createToolPage } from '@/core';
import { gradientGenerator } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(gradientGenerator);
export { generateMetadata };
export default Page;
