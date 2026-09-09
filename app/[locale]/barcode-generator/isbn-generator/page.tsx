import { createToolPage } from '@/core';
import { isbnGenerator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(isbnGenerator);
export { generateMetadata };
export default Page;
