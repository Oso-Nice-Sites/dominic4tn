// Shapes returned by the GROQ queries in ./queries.ts (already "projected":
// page links are resolved to plain `href` strings). Fields are nullable because
// GROQ returns null for anything the editor left empty.

import type { PortableTextProps } from "next-sanity";

export type Body = PortableTextProps["value"];

/** A Sanity image reference, as stored in a document. Turned into a URL by ./image.ts. */
export type ImageValue = {
  alt?: string | null;
  asset?: { _ref: string; _type?: string } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number; width: number; height: number } | null;
};

export type LinkItem = {
  _key?: string | null;
  label: string;
  /** Resolved destination; null when the linked page is not published. */
  href: string | null;
};

export type CtaButton = LinkItem & { style?: "primary" | "outline" | null };

type SectionBase = { _key: string; anchorId?: string | null };

export type HeroSection = SectionBase & {
  _type: "heroSection";
  eyebrow?: string | null;
  headline: string;
  /** Words within `headline` shown in the accent colour. */
  highlight?: string | null;
  primaryCta?: LinkItem | null;
  secondaryCta?: LinkItem | null;
};

export type TextSection = SectionBase & {
  _type: "textSection";
  heading?: string | null;
  body?: Body | null;
  variant?: "plain" | "callout" | null;
  image?: ImageValue | null;
  imagePosition?: "left" | "right" | null;
};

export type QuoteSection = SectionBase & {
  _type: "quoteSection";
  quote: string;
  attribution?: string | null;
};

export type StatsSection = SectionBase & {
  _type: "statsSection";
  heading?: string | null;
  stats: { _key: string; value: string; label: string }[];
};

export type CardsSection = SectionBase & {
  _type: "cardsSection";
  heading?: string | null;
  cards: { _key: string; topic?: string | null; title: string; body?: string | null }[];
};

export type CtaSection = SectionBase & {
  _type: "ctaSection";
  heading: string;
  body?: string | null;
  buttons?: CtaButton[] | null;
};

export type Section =
  | HeroSection
  | TextSection
  | QuoteSection
  | StatsSection
  | CardsSection
  | CtaSection;

export type PageData = {
  title: string;
  slug: string;
  description?: string | null;
  sections: Section[];
};

export type SiteSettings = {
  name: string;
  office: string;
  tagline?: string | null;
  email?: string | null;
  phone?: string | null;
  donateUrl?: string | null;
  disclaimer?: string | null;
  navigation?: LinkItem[] | null;
  footerLinks?: LinkItem[] | null;
};
