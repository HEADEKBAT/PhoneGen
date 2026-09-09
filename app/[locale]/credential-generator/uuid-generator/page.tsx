import { createToolPage } from '@/core';
import { uuidGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(uuidGenerator);
export { generateMetadata };
export default Page;
