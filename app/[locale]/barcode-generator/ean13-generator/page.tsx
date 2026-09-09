import { createToolPage } from '@/core';
import { ean13Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(ean13Generator);
export { generateMetadata };
export default Page;
