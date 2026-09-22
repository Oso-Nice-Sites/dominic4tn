// Built-in content: what the site shows when no Sanity project is configured,
// when a document has not been created yet, or if Sanity cannot be reached.
// It is also the source of the seed data (src/sanity/seed.ts), so a freshly
// created Sanity dataset starts out identical to the site as it stands.
//
// Copy follows dominic4tn-homepage-copy-draft.md. Once the campaign edits
// content in the Studio, the Studio wins — edit here only to change defaults.
//
// NOTE: relative imports with a `.ts` extension are deliberate — the seed
// script runs this file directly under Node's TypeScript support.

import type { Body, PageData, SiteSettings } from "../sanity/types.ts";

type PortableParagraph = {
  _type: "block";
  _key: string;
  style: "normal";
  markDefs: never[];
  children: { _type: "span"; _key: string; text: string; marks: never[] }[];
};

function paragraphs(prefix: string, ...texts: string[]): Body {
  const blocks: PortableParagraph[] = texts.map((text, i) => ({
    _type: "block",
    _key: `${prefix}-p${i + 1}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${prefix}-p${i + 1}-s`, text, marks: [] }],
  }));
  return blocks;
}

const donateUrl = "https://secure.actblue.com/donate/dominic4tn";
const email = "campaign@dominic4tn.com";

export const defaultSettings: SiteSettings = {
  name: "Dominic Howard",
  office: "State House · District 46",
  tagline: "The Correct Call for Tennessee Families.",
  email,
  donateUrl,
  // TODO(campaign): required campaign-finance disclaimer text is unconfirmed.
  disclaimer: "[Paid-for-by disclaimer pending campaign confirmation]",
  navigation: [
    { _key: "nav-about", label: "About", href: "/#about" },
    { _key: "nav-priorities", label: "Priorities", href: "/#priorities" },
    { _key: "nav-get-involved", label: "Get Involved", href: "/#get-involved" },
  ],
  footerLinks: [
    { _key: "footer-privacy", label: "Privacy Policy", href: "/privacy" },
    { _key: "footer-accessibility", label: "Accessibility Statement", href: "/accessibility" },
  ],
};

export const homeDescription =
  "Dominic Howard is running for Tennessee State House in District 46 — the correct call for Tennessee families.";

const home: PageData = {
  title: "Home",
  slug: "home",
  description: homeDescription,
  sections: [
    {
      _key: "hero",
      _type: "heroSection",
      eyebrow: "Dominic Howard for State House",
      // A newline is a deliberate line break in the big headline.
      headline: "The Correct Call\nfor Tennessee Families",
      highlight: "Correct Call",
      primaryCta: { label: "Donate Today", href: donateUrl },
      secondaryCta: { label: "Meet Dominic", href: "/#about" },
    },
    {
      _key: "meet",
      _type: "textSection",
      anchorId: "about",
      heading: "Meet Dominic",
      variant: "plain",
      imagePosition: "left",
      body: paragraphs(
        "meet",
        "Dominic Howard is an advocate and community leader committed to strengthening neighborhoods, supporting families, and ensuring real leadership.",
        "With more than three decades as a professional sports official, he's used to making impartial calls regardless of who is at the plate — and he'll take that same unbiased approach in Nashville, making sure Tennessee families get the fair shots they deserve.",
      ),
    },
    {
      _key: "quote",
      _type: "quoteSection",
      quote:
        "Tennessee families are hurting and they deserve better. They deserve a representative who puts them first over a party label or any special interest group.",
      attribution: "Dominic Howard",
    },
    {
      _key: "why",
      _type: "textSection",
      heading: "Why I'm Running",
      variant: "callout",
      imagePosition: "right",
      // Draft copy — pending campaign approval (see open items in the copy draft).
      body: paragraphs(
        "why",
        "Dominic has spent his career showing up for his community — as an official making the tough calls fairly, and as a hands-on presence in maintenance and construction management, keeping the projects that hold neighborhoods together running. He's running for State House because District 46 deserves that same steady, fair-minded attention in Nashville.",
      ),
    },
    {
      _key: "glance",
      _type: "statsSection",
      heading: "At a Glance",
      // Figures come from the existing bio; confirm exact numbers with Dominic before launch.
      stats: [
        { _key: "years-official", value: "30+", label: "years as a professional sports official" },
        {
          _key: "years-construction",
          value: "20",
          label: "years in maintenance and construction management",
        },
        { _key: "district", value: "46", label: "District 46 · Wilson County" },
      ],
    },
    {
      _key: "priorities",
      _type: "cardsSection",
      anchorId: "priorities",
      heading: "Dominic's Priorities",
      cards: [
        {
          _key: "affordability",
          topic: "Affordability",
          title: "Balancing the Family Budget",
          body: "Middle Tennessee is becoming more expensive by the day. Dominic believes that state government should be a partner in lowering costs, not a burden on your wallet.",
        },
        {
          _key: "infrastructure",
          topic: "Infrastructure",
          title: "Growth That Pays Its Own Way",
          body: "If you live in District 46, you know the frustration of sitting in traffic on roads that weren't built for this many cars. Dominic brings 20 years of maintenance and construction management experience to this problem.",
        },
        {
          _key: "education",
          topic: "Education",
          title: "Every Student, Every Path",
          body: 'Dominic believes our schools are the heart of the community. As someone who has worked with youth for decades, he knows that "one size fits all" doesn\'t work in the classroom or on the ballfield.',
        },
      ],
    },
    {
      _key: "get-involved",
      _type: "ctaSection",
      anchorId: "get-involved",
      heading: "Ready to Get Involved?",
      body: "Whether you're knocking doors, posting a yard sign, or spreading the word online, every bit of help moves District 46 forward.",
      // Add "Request a Yard Sign" / "Volunteer" buttons here once those forms exist.
      buttons: [
        { _key: "donate", label: "Donate", href: donateUrl, style: "primary" },
        { _key: "email", label: "Email the Campaign", href: `mailto:${email}`, style: "outline" },
      ],
    },
  ],
};

function placeholderPage(title: string, slug: string): PageData {
  return {
    title,
    slug,
    sections: [
      {
        _key: "body",
        _type: "textSection",
        variant: "plain",
        body: paragraphs(
          slug,
          "This page is being drafted and will be published before launch.",
        ),
      },
    ],
  };
}

export const defaultPages: Record<string, PageData> = {
  home,
  privacy: placeholderPage("Privacy Policy", "privacy"),
  accessibility: placeholderPage("Accessibility Statement", "accessibility"),
};
