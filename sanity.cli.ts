import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

// Lets `npx sanity …` commands (dev, build, deploy, dataset import, CORS, …)
// read the same .env.local the Next.js app uses.
loadEnvConfig(process.cwd());

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineCliConfig({
  api: { projectId, dataset },
  // The <name>.sanity.studio address the Studio is published at. Set it (or
  // answer the prompt on the first `npm run studio:deploy`) — see the README.
  studioHost: process.env.SANITY_STUDIO_HOST,
});
