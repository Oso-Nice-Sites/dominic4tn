// Turns the built-in defaults into Sanity documents so a brand-new dataset can be
// pre-filled with today's site content:
//
//   npm run seed:generate     # rewrites src/sanity/seed.ndjson from the defaults
//   npm run seed:import       # imports it into your dataset (never overwrites)
//
// Document IDs are fixed and unprefixed ("published"), so re-importing is safe.
// NOTE: relative `.ts` imports are deliberate (runs directly under Node).

import { defaultPages, defaultSettings } from "../content/defaults.ts";
import type { CtaButton, LinkItem, PageData, Section } from "./types.ts";

export type SeedDocument = { _id: string; _type: string; [field: string]: unknown };

function link(item: LinkItem) {
  return {
    _type: "link",
    ...(item._key ? { _key: item._key } : {}),
    label: item.label,
    url: item.href,
  };
}

function ctaButton(button: CtaButton) {
  return {
    _type: "ctaButton",
    _key: button._key,
    label: button.label,
    url: button.href,
    style: button.style,
  };
}

function seedSection(section: Section): Record<string, unknown> {
  switch (section._type) {
    case "heroSection":
      return {
        ...section,
        ...(section.primaryCta ? { primaryCta: link(section.primaryCta) } : {}),
        ...(section.secondaryCta ? { secondaryCta: link(section.secondaryCta) } : {}),
      };
    case "statsSection":
      return { ...section, stats: section.stats.map((s) => ({ _type: "stat", ...s })) };
    case "cardsSection":
      return { ...section, cards: section.cards.map((c) => ({ _type: "card", ...c })) };
    case "ctaSection":
      return { ...section, buttons: (section.buttons ?? []).map(ctaButton) };
    default:
      return { ...section };
  }
}

function seedPage(page: PageData): SeedDocument {
  return {
    _id: `page-${page.slug}`,
    _type: "page",
    title: page.title,
    slug: { _type: "slug", current: page.slug },
    ...(page.description ? { description: page.description } : {}),
    sections: page.sections.map(seedSection),
  };
}

export function buildSeedDocuments(): SeedDocument[] {
  const { navigation, footerLinks, ...settings } = defaultSettings;
  return [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      ...settings,
      navigation: (navigation ?? []).map(link),
      footerLinks: (footerLinks ?? []).map(link),
    },
    ...Object.values(defaultPages).map(seedPage),
  ];
}

export function toNdjson(documents: SeedDocument[]): string {
  return documents.map((doc) => JSON.stringify(doc)).join("\n") + "\n";
}
