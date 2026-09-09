import { createToolPage } from '@/core';
import { checkDigitCalculator } from '@/tools/barcode';

const { generateMetadata, Page } = createToolPage(checkDigitCalculator);
export { generateMetadata };
export default Page;
