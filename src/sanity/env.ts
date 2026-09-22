// Sanity connection settings. All optional: with no project ID the site simply
// runs on the built-in content in src/content/defaults.ts.
//
// NEXT_PUBLIC_* values are baked in at BUILD time, so they must be present in
// whatever environment runs `next build` (locally: .env.local; CI/Cloudflare:
// build variables). See the README.
//
// Note: read each variable directly (process.env.NAME) — Next only inlines
// literal accesses.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || undefined;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/** True once a Sanity project has been connected. */
export const isSanityConfigured = Boolean(projectId);

/**
 * Server-only. Needed only if the dataset is private; a public dataset (the
 * default) can be read without a token. Never expose this to the browser.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN || undefined;

/** True only for the throwaway GitHub Pages export (see next.config.ts). */
export const isStaticPreview = process.env.NEXT_PUBLIC_PREVIEW === "true";
