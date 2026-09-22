import { defineArrayMember, defineField, defineType } from "sanity";
import { photoField } from "./objects";

// Page sections. Each one matches a design already used on the site; editors
// stack, reorder, and edit them to build any page.

const anchorId = defineField({
  name: "anchorId",
  title: "Menu link ID (optional)",
  type: "string",
  description:
    "Lets a menu link jump straight to this section. Example: type “priorities” here, then link to /#priorities. Lower-case letters, numbers, and dashes only.",
  validation: (rule) =>
    rule.custom((value) =>
      !value || /^[a-z0-9-]+$/.test(value) ? true : "Use only lower-case letters, numbers, and dashes.",
    ),
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Big banner (headline)",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small line above the headline",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
      rows: 2,
      description: "Press Enter to choose where the line breaks.",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "highlight",
      title: "Words to show in orange",
      type: "string",
      description: "Must be part of the headline, exactly as typed there (e.g. “Correct Call”).",
      validation: (rule) =>
        rule.custom((value, context) => {
          const headline = (context.parent as { headline?: string } | undefined)?.headline;
          if (!value || !headline || headline.includes(value)) return true;
          return "These words need to appear in the headline exactly as typed.";
        }),
    }),
    defineField({ name: "primaryCta", title: "Main button", type: "link" }),
    defineField({ name: "secondaryCta", title: "Second button (optional)", type: "link" }),
    anchorId,
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title, subtitle: "Big banner" }),
  },
});

export const textSection = defineType({
  name: "textSection",
  title: "Text (with optional photo)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({ name: "body", title: "Text", type: "blockContent" }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Plain text", value: "plain" },
          { title: "Highlighted box", value: "callout" },
        ],
        layout: "radio",
      },
      initialValue: "plain",
    }),
    photoField("image", "Photo (optional)", "Shown beside the text on wide screens, above it on phones."),
    defineField({
      name: "imagePosition",
      title: "Photo position",
      type: "string",
      options: {
        list: [
          { title: "Left of the text", value: "left" },
          { title: "Right of the text", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
      hidden: ({ parent }) => !(parent as { image?: unknown } | undefined)?.image,
    }),
    anchorId,
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({ title: title || "(No heading)", subtitle: "Text", media }),
  },
});

export const quoteSection = defineType({
  name: "quoteSection",
  title: "Big quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({ name: "attribution", title: "Who said it", type: "string" }),
    anchorId,
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Quote — ${subtitle ?? ""}` }),
  },
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Numbers strip",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading (read aloud by screen readers)",
      type: "string",
      initialValue: "At a Glance",
    }),
    defineField({
      name: "stats",
      title: "Numbers",
      type: "array",
      of: [defineArrayMember({ type: "stat" })],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    anchorId,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Numbers", subtitle: "Numbers strip" }),
  },
});

export const cardsSection = defineType({
  name: "cardsSection",
  title: "Cards (e.g. priorities)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [defineArrayMember({ type: "card" })],
      validation: (rule) => rule.required().min(1).max(6),
    }),
    anchorId,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Cards", subtitle: "Cards" }),
  },
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call to action (buttons)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({ name: "body", title: "Text", type: "text", rows: 3 }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      of: [defineArrayMember({ type: "ctaButton" })],
      validation: (rule) => rule.max(4),
    }),
    anchorId,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Call to action" }),
  },
});
