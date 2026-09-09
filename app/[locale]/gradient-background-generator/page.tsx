import { createLandingPage } from '@/core/landing-factory';
import { getLandingPage } from '@/lib/config/landingPages';

const { generateMetadata, Page } = createLandingPage(getLandingPage('gradient-background-generator'));

export { generateMetadata };
export default Page;
