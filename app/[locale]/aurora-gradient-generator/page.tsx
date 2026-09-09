import { createLandingPage } from '@/core/landing-factory';
import { getLandingPage } from '@/lib/config/landingPages';

const { generateMetadata, Page } = createLandingPage(getLandingPage('aurora-gradient-generator'));

export { generateMetadata };
export default Page;
