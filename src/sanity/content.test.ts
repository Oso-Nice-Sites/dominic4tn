import { readFileSync } from "node:fs";
import { evaluate, parse } from "groq-js";
import { describe, expect, it } from "vitest";
import { defaultPages, defaultSettings } from "../content/defaults";
import { mergeSettings } from "./merge";
import { pageQuery, pageSlugsQuery, siteSettingsQuery } from "./queries";
import { buildSeedDocuments, toNdjson, type SeedDocument } from "./seed";
import type { SiteSettings } from "./types";

// These run the site's real GROQ queries (with Sanity's own query engine,
// groq-js) against the seed data — no network or Sanity project needed.

const seed = buildSeedDocuments();

async function run<T>(query: string, dataset: SeedDocument[], params: Record<string, unknown> = {}): Promise<T> {
  const result = await evaluate(parse(query), { dataset, params });
  return (await result.get()) as T;
}

/** GROQ returns null for empty fields; the built-in defaults simply omit them. */
function stripNulls<T>(value: T): T {
  if (Array.isArray(value)) return value.map(stripNulls) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNulls(v)]),
    ) as T;
  }
  return value;
}

describe("seed data", () => {
  it("is in sync with the built-in defaults (run `npm run seed:generate` if this fails)", () => {
    const onDisk = readFileSync(new URL("./seed.ndjson", import.meta.url), "utf8");
    expect(onDisk).toBe(toNdjson(seed));
  });

  it("uses unique IDs and unique keys within every array", () => {
    const ids = seed.map((doc) => doc._id);
    expect(new Set(ids).size).toBe(ids.length);

    const checkKeys = (value: unknown) => {
      if (Array.isArray(value)) {
        const keys = value.flatMap((item) => (item && typeof item === "object" && "_key" in item ? [item._key] : []));
        expect(new Set(keys).size, `duplicate _key in ${JSON.stringify(keys)}`).toBe(keys.length);
        value.forEach(checkKeys);
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(checkKeys);
      }
    };
    seed.forEach(checkKeys);
  });
});

describe("GROQ queries reproduce the built-in defaults from the seed data", () => {
  for (const slug of ["home", "privacy", "accessibility"]) {
    it(`page: ${slug}`, async () => {
      const page = await run(pageQuery, seed, { slug });
      expect(stripNulls(page)).toEqual(defaultPages[slug]);
    });
  }

  it("site settings", async () => {
    const settings = await run(siteSettingsQuery, seed);
    expect(stripNulls(settings)).toEqual(defaultSettings);
  });

  it("lists every page address", async () => {
    const slugs = await run<string[]>(pageSlugsQuery, seed);
    expect([...slugs].sort()).toEqual(["accessibility", "home", "privacy"]);
  });

  it("returns null for a page that does not exist", async () => {
    expect(await run(pageQuery, seed, { slug: "nope" })).toBeNull();
  });
});

describe("page links resolve to plain hrefs", () => {
  const reference = (id: string) => ({ _type: "reference", _ref: id });
  const dataset: SeedDocument[] = [
    { _id: "page-home", _type: "page", title: "Home", slug: { current: "home" } },
    { _id: "page-volunteer", _type: "page", title: "Volunteer", slug: { current: "volunteer" } },
    {
      _id: "siteSettings",
      _type: "siteSettings",
      navigation: [
        { _type: "link", _key: "a", label: "Volunteer", page: reference("page-volunteer") },
        { _type: "link", _key: "b", label: "Home", page: reference("page-home") },
        { _type: "link", _key: "c", label: "Donate", url: "https://example.com/donate" },
        { _type: "link", _key: "d", label: "Gone", page: reference("page-deleted") },
      ],
    },
  ];

  it("maps page references, the home page, external URLs, and missing pages", async () => {
    const settings = await run<SiteSettings>(siteSettingsQuery, dataset);
    expect(settings.navigation?.map((l) => [l.label, l.href])).toEqual([
      ["Volunteer", "/volunteer"],
      ["Home", "/"],
      ["Donate", "https://example.com/donate"],
      ["Gone", null],
    ]);
  });
});

describe("mergeSettings", () => {
  it("uses the defaults when nothing has been fetched", () => {
    expect(mergeSettings(null)).toEqual(defaultSettings);
  });

  it("prefers the editor's values and falls back for empty fields", () => {
    const merged = mergeSettings({
      name: "Someone Else",
      office: "State Senate",
      email: null,
      phone: "(615) 555-0100",
    });
    expect(merged.name).toBe("Someone Else");
    expect(merged.office).toBe("State Senate");
    expect(merged.phone).toBe("(615) 555-0100");
    expect(merged.email).toBe(defaultSettings.email); // left empty -> default
    expect(merged.donateUrl).toBe(defaultSettings.donateUrl);
  });

  it("keeps a menu the editor deliberately emptied, but defaults one never set", () => {
    const base = { name: "N", office: "O" };
    expect(mergeSettings({ ...base, navigation: [] }).navigation).toEqual([]);
    expect(mergeSettings({ ...base }).navigation).toEqual(defaultSettings.navigation);
  });

  it("drops links to unpublished pages", () => {
    const merged = mergeSettings({
      name: "N",
      office: "O",
      navigation: [
        { _key: "a", label: "Live", href: "/live" },
        { _key: "b", label: "Unpublished", href: null },
      ],
    });
    expect(merged.navigation).toEqual([{ _key: "a", label: "Live", href: "/live" }]);
  });
});
