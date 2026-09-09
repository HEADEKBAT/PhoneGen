import { createToolPage } from '@/core';
import { passphraseGenerator } from '@/tools/credential';

const { generateMetadata, Page } = createToolPage(passphraseGenerator);
export { generateMetadata };
export default Page;
