import { defaultSettings } from "@/content/defaults";
import type { LinkItem, SiteSettings } from "./types";

const usable = (links: LinkItem[] | null | undefined): LinkItem[] | undefined =>
  links?.filter((link) => link.label && link.href);

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
  };
}
