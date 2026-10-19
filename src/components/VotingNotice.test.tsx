// @vitest-environment jsdom
import axe from "axe-core";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { defaultSettings } from "@/content/defaults";
import { mergeSettings } from "@/sanity/merge";
import { isNoticeActive, VotingNotice } from "./VotingNotice";

const notice = defaultSettings.votingNotice!;
const beforeExpiry = new Date("2026-10-16T12:00:00-05:00");

function render(props: Parameters<typeof VotingNotice>[0]) {
  document.body.innerHTML = `<main>${renderToStaticMarkup(createElement(VotingNotice, props))}</main>`;
  return document.body;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("VotingNotice", () => {
  it("renders the wording verbatim with HERE as the link", () => {
    const body = render({ notice, now: beforeExpiry });
    const aside = body.querySelector("aside")!;
    expect(aside.getAttribute("aria-label")).toBe("Voting information");
    expect(aside.getAttribute("role")).toBeNull();
    expect(aside.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "Early Voting is until October 29th, 2026.Don't know where to vote? Click HERE for your voting location",
    );

    const link = aside.querySelector("a")!;
    expect(link.textContent).toBe("HERE");
    expect(link.getAttribute("href")).toBe("https://www.wilsontnvotes.gov/election-day-voting-locations/");
    expect(link.getAttribute("target")).toBeNull(); // same tab
    // WCAG 2.5.3: the accessible name contains (starts with) the visible text.
    expect(link.getAttribute("aria-label")).toMatch(/^HERE: find your voting location/);
  });

  it("has no axe-core violations", async () => {
    const body = render({ notice, now: beforeExpiry });
    const results = await axe.run(body, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] } });
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    expect(results.passes.length).toBeGreaterThan(0);
  });

  it("hides after 11:59 PM Central on October 29, 2026", () => {
    expect(isNoticeActive(notice, new Date("2026-10-29T23:58:00-05:00"))).toBe(true);
    expect(isNoticeActive(notice, new Date("2026-10-30T00:00:00-05:00"))).toBe(false);
    expect(render({ notice, now: new Date("2026-10-30T12:00:00Z") }).querySelector("aside")).toBeNull();
  });

  it("can be switched off, and stays up with no end date", () => {
    expect(isNoticeActive({ ...notice, show: false }, beforeExpiry)).toBe(false);
    expect(isNoticeActive({ ...notice, expiresAt: null }, new Date("2030-01-01"))).toBe(true);
  });
});

describe("mergeSettings: voting notice", () => {
  const base = { name: "N", office: "O" };

  it("uses the built-in banner until an editor saves one", () => {
    expect(mergeSettings(base).votingNotice).toEqual(notice);
  });

  it("keeps the editor's off switch and empty end date, and fills empty wording", () => {
    const merged = mergeSettings({ ...base, votingNotice: { show: false, headline: "Vote Nov 3!" } });
    expect(merged.votingNotice).toMatchObject({
      show: false,
      headline: "Vote Nov 3!",
      linkText: "HERE",
      linkUrl: notice.linkUrl,
      expiresAt: null,
    });
  });
});
