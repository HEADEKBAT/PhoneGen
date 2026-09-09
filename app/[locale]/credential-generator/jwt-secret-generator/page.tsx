import { createToolPage } from '@/core';
import { jwtSecretGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(jwtSecretGenerator);
export { generateMetadata };
export default Page;
