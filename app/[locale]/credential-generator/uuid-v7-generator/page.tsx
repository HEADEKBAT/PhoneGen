import { createToolPage } from '@/core';
import { uuidV7Generator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(uuidV7Generator);
export { generateMetadata };
export default Page;
