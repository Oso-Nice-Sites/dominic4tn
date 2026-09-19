// Site-wide settings and homepage copy. Copy follows
// dominic4tn-homepage-copy-draft.md; when the Sanity editor is wired up these
// become the fallback/default values.

export const site = {
  name: "Dominic Howard",
  office: "State House · District 46",
  email: "campaign@dominic4tn.com",
  phone: "(615) 669-8272",
  phoneHref: "tel:+16156698272",
  donateUrl: "https://secure.actblue.com/donate/dominic4tn",
  // TODO(campaign): required campaign-finance disclaimer text is unconfirmed.
  disclaimer: "[Paid-for-by disclaimer pending campaign confirmation]",
} as const;

// Flip to true once the volunteer and yard-sign intake forms exist (Sprint 2).
export const GET_INVOLVED_FORMS_LIVE = false;

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Priorities", href: "/#priorities" },
  { label: "Get Involved", href: "/#get-involved" },
] as const;

export type Photo = { src: string; alt: string };

// Drop campaign photos in /public and set them here; the layout adapts to a
// two-column split automatically. Leave null until real photos are supplied.
export const homePhotos: { meet: Photo | null; why: Photo | null } = {
  meet: null,
  why: null,
};

export const home = {
  hero: {
    eyebrow: "Dominic Howard for State House",
    headline: ["The", "Correct Call", "for Tennessee Families"],
  },
  meet: {
    heading: "Meet Dominic",
    body: [
      "Dominic Howard is an advocate and community leader committed to strengthening neighborhoods, supporting families, and ensuring real leadership.",
      "With more than three decades as a professional sports official, he's used to making impartial calls regardless of who is at the plate — and he'll take that same unbiased approach in Nashville, making sure Tennessee families get the fair shots they deserve.",
    ],
  },
  quote: {
    text: "Tennessee families are hurting and they deserve better. They deserve a representative who puts them first over a party label or any special interest group.",
    attribution: "Dominic Howard",
  },
  why: {
    heading: "Why I'm Running",
    // Draft copy — pending campaign approval (see open items in the copy draft).
    body: "Dominic has spent his career showing up for his community — as an official making the tough calls fairly, and as a hands-on presence in maintenance and construction management, keeping the projects that hold neighborhoods together running. He's running for State House because District 46 deserves that same steady, fair-minded attention in Nashville.",
  },
  // Figures come from the existing bio; confirm exact numbers with Dominic before launch.
  glance: {
    heading: "At a Glance",
    stats: [
      { value: "30+", label: "years as a professional sports official" },
      { value: "20", label: "years in maintenance and construction management" },
      { value: "46", label: "District 46 · Wilson County" },
    ],
  },
  priorities: {
    heading: "Dominic's Priorities",
    items: [
      {
        topic: "Affordability",
        title: "Balancing the Family Budget",
        body: "Middle Tennessee is becoming more expensive by the day. Dominic believes that state government should be a partner in lowering costs, not a burden on your wallet.",
      },
      {
        topic: "Infrastructure",
        title: "Growth That Pays Its Own Way",
        body: "If you live in District 46, you know the frustration of sitting in traffic on roads that weren't built for this many cars. Dominic brings 20 years of maintenance and construction management experience to this problem.",
      },
      {
        topic: "Education",
        title: "Every Student, Every Path",
        body: 'Dominic believes our schools are the heart of the community. As someone who has worked with youth for decades, he knows that "one size fits all" doesn\'t work in the classroom or on the ballfield.',
      },
    ],
  },
  getInvolved: {
    heading: "Ready to Get Involved?",
    body: "Whether you're knocking doors, posting a yard sign, or spreading the word online, every bit of help moves District 46 forward.",
  },
} as const;
