import { createToolPage } from '@/core';
import { upcGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(upcGenerator);
export { generateMetadata };
export default Page;
