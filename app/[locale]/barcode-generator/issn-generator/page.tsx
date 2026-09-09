import { createToolPage } from '@/core';
import { issnGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(issnGenerator);
export { generateMetadata };
export default Page;
