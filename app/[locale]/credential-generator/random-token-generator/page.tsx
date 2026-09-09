import { createToolPage } from '@/core';
import { randomTokenGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(randomTokenGenerator);
export { generateMetadata };
export default Page;
