import { createToolPage } from '@/core';
import { qrCodeGenerator } from '@/tools/qr';

const { generateMetadata, Page } = createToolPage(qrCodeGenerator);
export { generateMetadata };
export default Page;
