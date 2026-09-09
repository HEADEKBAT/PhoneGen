import { createLandingPage } from '@/core/landing-factory';
import { getLandingPage } from '@/lib/config/landingPages';

const { generateMetadata, Page } = createLandingPage(getLandingPage('gradient-palette-library'));

export { generateMetadata };
export default Page;
