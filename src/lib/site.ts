/**
 * Canonical public origin for SEO metadata, sitemap and share links.
 *
 * Set VITE_SITE_URL (e.g. https://fayno.in) once the custom domain is live;
 * it falls back to the Lovable domain so nothing breaks before then.
 */
const configured =
  typeof import.meta.env.VITE_SITE_URL === "string" ? import.meta.env.VITE_SITE_URL : "";

export const SITE_URL = (configured || "https://fayno.lovable.app").replace(/\/+$/, "");

export function siteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Origin the visitor is actually on — use for share/invite links in the browser. */
export function currentOrigin(): string {
  return typeof window !== "undefined" ? window.location.origin : SITE_URL;
}
