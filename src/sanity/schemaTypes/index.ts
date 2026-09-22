import { page, siteSettings } from "./documents";
import { blockContent, card, ctaButton, link, stat } from "./objects";
import {
  cardsSection,
  ctaSection,
  heroSection,
  quoteSection,
  statsSection,
  textSection,
} from "./sections";

export const schemaTypes = [
  // Documents
  page,
  siteSettings,
  // Page sections
  heroSection,
  textSection,
  quoteSection,
  statsSection,
  cardsSection,
  ctaSection,
  // Building blocks
  link,
  ctaButton,
  stat,
  card,
  blockContent,
];
