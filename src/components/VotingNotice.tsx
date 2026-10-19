import type { VotingNotice as VotingNoticeSettings } from "@/sanity/types";

// The high-visibility yellow banner above the header (early-voting dates and a
// link to polling places). Wording, link and on/off come from "Site settings"
// in the CMS. Static on purpose: no role="alert", no animation, not sticky —
// on a small phone it is too tall to pin without covering the page.

/** True when the banner is switched on, has something to say, and has not expired. */
export function isNoticeActive(notice: VotingNoticeSettings | null | undefined, now = new Date()): boolean {
  if (!notice?.show || !notice.headline) return false;
  if (!notice.expiresAt) return true;
  const expires = new Date(notice.expiresAt);
  return Number.isNaN(expires.getTime()) || now <= expires;
}

export function VotingNotice({
  notice,
  now,
}: {
  notice: VotingNoticeSettings | null | undefined;
  /** Override "now" (tests). */
  now?: Date;
}) {
  if (!notice || !isNoticeActive(notice, now)) return null;
  const { headline, textBeforeLink, linkText, textAfterLink, linkUrl, linkDescription } = notice;
  const hasLink = Boolean(linkUrl && linkText);

  return (
    <aside aria-label="Voting information" className="voting-notice">
      <p className="voting-notice__headline">{headline}</p>
      {(textBeforeLink || hasLink || textAfterLink) && (
        <p className="voting-notice__text">
          {textBeforeLink}{" "}
          {hasLink && (
            <a
              href={linkUrl!}
              className="voting-notice__button"
              // Starts with the visible word so voice control ("click HERE") still
              // works (WCAG 2.5.3), then says where it goes for screen readers.
              aria-label={linkDescription ? `${linkText}: ${linkDescription}` : undefined}
            >
              {linkText}
            </a>
          )}{" "}
          {textAfterLink}
        </p>
      )}
    </aside>
  );
}
