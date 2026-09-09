import { createToolPage } from '@/core';
import { apiKeyGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(apiKeyGenerator);
export { generateMetadata };
export default Page;
