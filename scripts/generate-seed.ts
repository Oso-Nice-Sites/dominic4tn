// Regenerates src/sanity/seed.ndjson from the built-in defaults.
// Run with: npm run seed:generate   (needs Node 22.18+ / 24 for TypeScript support)

import { writeFileSync } from "node:fs";
import { buildSeedDocuments, toNdjson } from "../src/sanity/seed.ts";

const out = new URL("../src/sanity/seed.ndjson", import.meta.url);
const documents = buildSeedDocuments();
writeFileSync(out, toNdjson(documents));
console.log(`Wrote ${documents.length} documents to src/sanity/seed.ndjson`);
