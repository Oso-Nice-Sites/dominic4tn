import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { SETTINGS_DOCUMENT_ID } from "./src/sanity/schemaTypes/documents";
import { structure } from "./src/sanity/structure";

// Studio configuration — the campaign's content editor. It runs as its own web
// app (`npm run studio` locally, `npm run studio:deploy` to publish it on
// Sanity's hosting), NOT inside the website: bundling it into the Cloudflare
// Worker would blow the Worker's size limit. Editors sign in with their Sanity
// account; who may edit is managed in the Sanity project.
//
// SANITY_STUDIO_* variables are the ones Sanity's tooling exposes to the Studio.
export default defineConfig({
  name: "default",
  title: "Dominic4TN Website",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    // Site settings is a single fixed document; don't offer "New site settings".
    templates: (templates) => templates.filter((template) => template.schemaType !== "siteSettings"),
  },
  document: {
    // ...and keep it from being deleted or duplicated.
    actions: (actions, { schemaType, documentId }) =>
      schemaType === "siteSettings" || documentId === SETTINGS_DOCUMENT_ID
        ? actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : actions,
  },
});
