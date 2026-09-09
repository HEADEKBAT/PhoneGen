import { createToolPage } from '@/core';
import { passwordStrengthChecker } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(passwordStrengthChecker);
export { generateMetadata };
export default Page;
