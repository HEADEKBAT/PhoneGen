import { createToolPage } from '@/core';
import { codabarGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(codabarGenerator);
export { generateMetadata };
export default Page;
