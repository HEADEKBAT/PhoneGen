import { createToolPage } from '@/core';
import { code128Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(code128Generator);
export { generateMetadata };
export default Page;
