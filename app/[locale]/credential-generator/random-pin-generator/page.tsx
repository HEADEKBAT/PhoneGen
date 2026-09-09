import { createToolPage } from '@/core';
import { randomPinGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(randomPinGenerator);
export { generateMetadata };
export default Page;
