import { createToolPage } from '@/core';
import { backgroundRemover } from '@/tools/image';

const { generateMetadata, Page } = createToolPage(backgroundRemover);
export { generateMetadata };
export default Page;
