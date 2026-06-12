import { SITE_URL } from "@/lib/site";

/**
 * Shared OpenGraph fields for subpages. Next.js fully replaces the parent
 * `openGraph` when a child segment defines its own, so each page must re-declare
 * these site-level fields. Spread `ogBase(path)` first, then the page-specific
 * title/description/images.
 */
export const ogBase = (path: string) => ({
  type: "website" as const,
  locale: "en_GB",
  siteName: "SierraZim Training Academy",
  url: `${SITE_URL}${path}`,
});
