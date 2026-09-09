import { createToolPage } from '@/core';
import { code93Generator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(code93Generator);
export { generateMetadata };
export default Page;
