import { createToolPage } from '@/core';
import { sessionSecretGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(sessionSecretGenerator);
export { generateMetadata };
export default Page;
