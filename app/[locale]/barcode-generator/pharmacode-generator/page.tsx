import { createToolPage } from '@/core';
import { pharmacodeGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(pharmacodeGenerator);
export { generateMetadata };
export default Page;
