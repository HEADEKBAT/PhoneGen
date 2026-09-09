import { createToolPage } from '@/core';
import { creditCardGenerator } from '@/tools/payment';

const { generateMetadata, Page } = createToolPage(creditCardGenerator);
export { generateMetadata };
export default Page;
