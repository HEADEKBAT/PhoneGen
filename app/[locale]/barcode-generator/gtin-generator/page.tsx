import { createToolPage } from '@/core';
import { gtinGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(gtinGenerator);
export { generateMetadata };
export default Page;
