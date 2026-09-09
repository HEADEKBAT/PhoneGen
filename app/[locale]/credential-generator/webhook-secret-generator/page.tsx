import { createToolPage } from '@/core';
import { webhookSecretGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(webhookSecretGenerator);
export { generateMetadata };
export default Page;
