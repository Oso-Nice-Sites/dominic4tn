import { defineArrayMember, defineField, defineType } from "sanity";

// Anything a link may point to. Blocks `javascript:` and other odd schemes.
const ALLOWED_URL = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

function urlField() {
  return defineField({
    name: "url",
    title: "Web address",
    type: "string",
    description:
      "Use this for links away from this site, e.g. https://secure.actblue.com/… or mailto:name@example.com. To jump to a spot on the home page use /#about, /#priorities, etc.",
    validation: (rule) =>
      rule.custom((value) =>
        !value || ALLOWED_URL.test(value)
          ? true
          : "Must start with https://, http://, mailto:, tel:, / or #",
      ),
  });
}

function linkFields() {
  return [
    defineField({
      name: "label",
      title: "Text shown",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "page",
      title: "Link to a page on this site",
      type: "reference",
      to: [{ type: "page" }],
      description: "Pick one of your pages… (only published pages work)",
    }),
    urlField(),
  ];
}

// A link must point at a page OR a web address — not both, not neither.
function exactlyOneDestination(value: unknown): true | string {
  const link = value as { page?: unknown; url?: string } | undefined;
  if (!link) return true;
  const count = Number(Boolean(link.page)) + Number(Boolean(link.url?.trim()));
  return count === 1 ? true : "Choose either a page on this site or a web address — not both.";
}

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: linkFields(),
  validation: (rule) => rule.custom(exactlyOneDestination),
  preview: {
    select: { title: "label", page: "page.title", url: "url" },
    prepare: ({ title, page, url }) => ({ title, subtitle: page ? `Page: ${page}` : url }),
  },
});

export const ctaButton = defineType({
  name: "ctaButton",
  title: "Button",
  type: "object",
  fields: [
    ...linkFields(),
    defineField({
      name: "style",
      title: "Look",
      type: "string",
      options: {
        list: [
          { title: "Solid orange (main action)", value: "primary" },
          { title: "Outlined (secondary)", value: "outline" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  validation: (rule) => rule.custom(exactlyOneDestination),
  preview: {
    select: { title: "label", page: "page.title", url: "url" },
    prepare: ({ title, page, url }) => ({ title, subtitle: page ? `Page: ${page}` : url }),
  },
});

export const stat = defineType({
  name: "stat",
  title: "Number",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Big number or text",
      type: "string",
      description: 'e.g. "30+"',
      validation: (rule) => rule.required().max(12),
    }),
    defineField({
      name: "label",
      title: "What it means",
      type: "string",
      description: 'e.g. "years as a professional sports official"',
      validation: (rule) => rule.required().max(80),
    }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});

export const card = defineType({
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "topic",
      title: "Small heading above the title",
      type: "string",
      description: 'e.g. "Affordability"',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "text",
      rows: 4,
    }),
  ],
  preview: { select: { title: "title", subtitle: "topic" } },
});

// Rich text used in body copy.
export const blockContent = defineType({
  name: "blockContent",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Small heading", value: "h3" },
      ],
      lists: [
        { title: "Bulleted list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                title: "Web address",
                type: "string",
                validation: (rule) =>
                  rule.required().custom((value) =>
                    !value || ALLOWED_URL.test(value)
                      ? true
                      : "Must start with https://, http://, mailto:, tel:, / or #",
                  ),
              }),
            ],
          },
        ],
      },
    }),
  ],
});

/** A photo field that insists on alt text, so screen readers can describe it. */
export function photoField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Description of the photo",
        type: "string",
        description:
          "Required. Describe what's in the photo for people who can't see it, e.g. “Dominic Howard speaking with neighbors outside a community center.”",
        validation: (rule) => rule.required().max(200),
      }),
    ],
  });
}

// The yellow banner above the header on every page. Defaults match
// src/content/defaults.ts so a fresh banner starts out with today's wording.
export const votingNotice = defineType({
  name: "votingNotice",
  title: "Voting notice banner",
  type: "object",
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "show",
      title: "Show the banner",
      type: "boolean",
      description: "Untick to hide the banner on every page right away.",
      initialValue: true,
    }),
    defineField({
      name: "headline",
      title: "Headline (bold)",
      type: "string",
      initialValue: "Early Voting is until October 29th, 2026.",
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: "textBeforeLink",
      title: "Text before the button",
      type: "string",
      initialValue: "Don't know where to vote? Click",
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: "linkText",
      title: "Button text",
      type: "string",
      description: "Keep it short, e.g. HERE.",
      initialValue: "HERE",
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "textAfterLink",
      title: "Text after the button",
      type: "string",
      initialValue: "for your voting location",
      validation: (rule) => rule.max(90),
    }),
    defineField({
      name: "linkUrl",
      title: "Button web address",
      type: "url",
      initialValue: "https://www.wilsontnvotes.gov/election-day-voting-locations/",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "linkDescription",
      title: "What the button does (read aloud by screen readers)",
      type: "string",
      description:
        "Read after the button text, so “HERE” makes sense on its own. Mention the website it goes to.",
      initialValue: "find your voting location on the Wilson County Election Commission website",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "expiresAt",
      title: "Hide automatically after",
      type: "datetime",
      description:
        "The banner disappears after this date and time. Leave empty to keep it up until you untick “Show the banner”.",
      initialValue: "2026-10-29T23:59:00-05:00",
    }),
  ],
});
