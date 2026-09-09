import type { NextConfig } from "next";

/* ── Redirects: legacy standalone SEO pages → new tool pages ───────────────── */

/**
 * The slug lists and the redirect builder live in lib/config/legacyRedirects.ts
 * so that app/sitemap.ts can read the same data and keep the redirected URLs
 * out of the sitemap. A relative import is required here: next.config.ts is
 * evaluated outside the app's module graph, where the "@/" alias is not
 * resolved.
 */
import { buildLegacyRedirects } from "./lib/config/legacyRedirects";

const nextConfig: NextConfig = {
  async redirects() {
    return buildLegacyRedirects();
  },
};

export default nextConfig;
