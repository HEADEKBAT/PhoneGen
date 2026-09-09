import { createToolPage } from '@/core';
import { randomColorGenerator } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(randomColorGenerator);
export { generateMetadata };
export default Page;
