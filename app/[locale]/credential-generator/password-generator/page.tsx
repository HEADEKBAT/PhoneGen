import { createToolPage } from '@/core';
import { passwordGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(passwordGenerator);
export { generateMetadata };
export default Page;
