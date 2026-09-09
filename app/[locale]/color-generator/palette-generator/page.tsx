import { createToolPage } from '@/core';
import { paletteGenerator } from '@/tools/color';

const { generateMetadata, Page } = createToolPage(paletteGenerator);
export { generateMetadata };
export default Page;
