import { createToolPage } from '@/core';
import { itf14Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(itf14Generator);
export { generateMetadata };
export default Page;
