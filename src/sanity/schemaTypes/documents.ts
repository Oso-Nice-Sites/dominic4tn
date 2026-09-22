import { defineArrayMember, defineField, defineType } from "sanity";

/** The Home page is an ordinary page whose address (slug) is "home". */
export const HOME_SLUG = "home";
export const HOME_DOCUMENT_ID = `page-${HOME_SLUG}`;
export const SETTINGS_DOCUMENT_ID = "siteSettings";

// Addresses the website itself already uses.
const RESERVED_SLUGS = ["studio", "api", "_next"];

const baseId = (id: string | undefined) => (id ?? "").replace(/^drafts\./, "");

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description: "Shown at the top of the page and in the browser tab.",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description:
        "The end of the page's address, e.g. “volunteer” makes the page /volunteer. Click Generate to make it from the title. (The Home page is fixed.)",
      options: { source: "title", maxLength: 60 },
      readOnly: ({ document }) => baseId(document?._id as string | undefined) === HOME_DOCUMENT_ID,
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const current = value?.current;
          if (!current) return true;
          const isHome = baseId(context.document?._id as string | undefined) === HOME_DOCUMENT_ID;
          if (current === HOME_SLUG && !isHome) {
            return "“home” is reserved for the Home page.";
          }
          if (RESERVED_SLUGS.includes(current)) return `“${current}” is used by the website itself.`;
          return true;
        }),
    }),
    defineField({
      name: "description",
      title: "Short description for Google and social media",
      type: "text",
      rows: 3,
      description: "One or two sentences. Around 150 characters works best.",
      validation: (rule) => rule.max(200).warning("Longer than 200 characters may be cut off."),
    }),
    defineField({
      name: "sections",
      title: "Page content",
      type: "array",
      description:
        "Build the page from sections. Drag to reorder; use the ⋯ menu to duplicate or delete.",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "textSection" }),
        defineArrayMember({ type: "quoteSection" }),
        defineArrayMember({ type: "statsSection" }),
        defineArrayMember({ type: "cardsSection" }),
        defineArrayMember({ type: "ctaSection" }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug === HOME_SLUG ? "/  (Home)" : `/${slug ?? ""}`,
    }),
  },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Candidate name",
      type: "string",
      description: "Shown in the header and footer.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "office",
      title: "Office and district line",
      type: "string",
      description: "Small line under the name, e.g. “State House · District 46”.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", title: "Footer tagline", type: "string" }),
    defineField({ name: "email", title: "Campaign email", type: "string" }),
    defineField({
      name: "phone",
      title: "Campaign phone",
      type: "string",
      description: "Shown in the footer and used for tap-to-call on phones.",
    }),
    defineField({
      name: "donateUrl",
      title: "Donation page address (ActBlue)",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "disclaimer",
      title: "“Paid for by” disclaimer",
      type: "text",
      rows: 2,
      description: "The legally required campaign-finance disclaimer shown at the bottom of every page.",
    }),
    defineField({
      name: "navigation",
      title: "Menu links (top of every page)",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "footerLinks",
      title: "Small links at the bottom (e.g. Privacy Policy)",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
