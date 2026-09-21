import type { LinkItem } from "@/sanity/types";

export type ResolvedLink = { key: string; label: string; href: string };

/** Drops links with no label or destination (e.g. a link to an unpublished page). */
export function resolvedLinks(links: LinkItem[] | null | undefined): ResolvedLink[] {
  return (links ?? []).flatMap((link) =>
    link.href && link.label ? [{ key: link._key ?? link.label, label: link.label, href: link.href }] : [],
  );
}

/** "(615) 669-8272" -> "tel:+16156698272". Assumes US numbers when there are 10 digits. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${digits}`;
}
