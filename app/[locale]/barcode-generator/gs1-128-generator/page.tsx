import { createToolPage } from '@/core';
import { gs1128Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(gs1128Generator);
export { generateMetadata };
export default Page;
