import type { StructureResolver } from "sanity/structure";
import { SETTINGS_DOCUMENT_ID } from "./schemaTypes/documents";

// Studio sidebar: one fixed "Site settings" document, then the list of pages.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website")
    .items([
      S.listItem()
        .title("Site settings")
        .id(SETTINGS_DOCUMENT_ID)
        .child(
          S.document().schemaType("siteSettings").documentId(SETTINGS_DOCUMENT_ID).title("Site settings"),
        ),
      S.divider(),
      S.documentTypeListItem("page").title("Pages"),
    ]);
