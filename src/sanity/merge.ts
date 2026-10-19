import { defaultSettings } from "@/content/defaults";
import type { LinkItem, SiteSettings, VotingNotice } from "./types";

const usable = (links: LinkItem[] | null | undefined): LinkItem[] | undefined =>
  links?.filter((link) => link.label && link.href);

/**
 * The voting banner. Never set up in the CMS -> the built-in banner. Once an
 * editor has saved it, empty text falls back to the default wording, but an
 * empty end date means "no end date" and an unticked box hides it.
 */
function mergeVotingNotice(fetched: VotingNotice | null | undefined): VotingNotice | undefined {
  const fallback = defaultSettings.votingNotice ?? undefined;
  if (!fetched || !fallback) return fetched ?? fallback;
  const text = <K extends keyof VotingNotice>(key: K) => fetched[key] || fallback[key];
  return {
    show: fetched.show ?? fallback.show,
    headline: text("headline"),
    textBeforeLink: text("textBeforeLink"),
    linkText: text("linkText"),
    textAfterLink: text("textAfterLink"),
    linkUrl: text("linkUrl"),
    linkDescription: text("linkDescription"),
    expiresAt: fetched.expiresAt ?? null,
  };
}

/**
 * Combine "Site settings" from the CMS with the built-in defaults: an editor's
 * value wins, anything left empty falls back. A menu the editor has emptied on
 * purpose stays empty; only a menu that was never set falls back.
 */
export function mergeSettings(fetched: SiteSettings | null): SiteSettings {
  if (!fetched) return defaultSettings;
  const pick = <K extends keyof SiteSettings>(key: K) => fetched[key] ?? defaultSettings[key];
  return {
    name: pick("name") as string,
    office: pick("office") as string,
    tagline: pick("tagline"),
    email: pick("email"),
    phone: pick("phone"),
    donateUrl: pick("donateUrl"),
    disclaimer: pick("disclaimer"),
    navigation: usable(fetched.navigation) ?? defaultSettings.navigation,
    footerLinks: usable(fetched.footerLinks) ?? defaultSettings.footerLinks,
    votingNotice: mergeVotingNotice(fetched.votingNotice),
  };
}
