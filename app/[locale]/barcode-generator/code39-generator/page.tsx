import { createToolPage } from '@/core';
import { code39Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(code39Generator);
export { generateMetadata };
export default Page;
