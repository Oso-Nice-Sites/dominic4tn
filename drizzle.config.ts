import { defineConfig } from "drizzle-kit";

// D1 is SQLite. Migrations are generated into ./drizzle and applied with
// `wrangler d1 migrations apply` (see the db:* scripts in package.json).
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
