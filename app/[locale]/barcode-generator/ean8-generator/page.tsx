import { createToolPage } from '@/core';
import { ean8Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(ean8Generator);
export { generateMetadata };
export default Page;
