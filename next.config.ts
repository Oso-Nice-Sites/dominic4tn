import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// GitHub Pages stakeholder preview (see .github/workflows/pages.yml).
// Opt-in: a normal build, `next dev`, and the Cloudflare Workers build are
// unaffected. Pages can only host static files, so this exports the current
// (static) pages and cannot run anything that needs a server or D1.
const isPagesPreview = process.env.GITHUB_PAGES === "true";
const pagesBasePath = process.env.PAGES_BASE_PATH ?? "/dominic4tn";

const nextConfig: NextConfig = isPagesPreview
  ? {
      output: "export",
      basePath: pagesBasePath,
      trailingSlash: true,
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_PREVIEW: "true" },
    }
  : {};

export default nextConfig;

if (!isPagesPreview) {
  // Exposes Cloudflare bindings (D1, etc.) to `next dev`.
  initOpenNextCloudflareForDev();
}
