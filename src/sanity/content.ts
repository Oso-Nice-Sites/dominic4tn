import { cache } from "react";
import { connection } from "next/server";
import { defaultPages } from "@/content/defaults";
import { getClient } from "./client";
import { isSanityConfigured, isStaticPreview } from "./env";
import { mergeSettings } from "./merge";
import { pageQuery, pageSlugsQuery, siteSettingsQuery } from "./queries";
import type { PageData, SiteSettings } from "./types";

// Content access for the site. Rules:
//  - Published content in Sanity wins; anything missing falls back to
//    src/content/defaults.ts, so the site works before Sanity is set up and if
//    Sanity is unreachable (the error is logged, the page still renders).
//  - Pages render per request (not baked in at build), so a publish in the
//    Studio shows up on the next page load with no redeploy.
//  - The throwaway GitHub Pages export is fully static, so it skips the above.

/** Opt the calling page out of build-time prerendering. */
async function renderPerRequest() {
  if (!isStaticPreview) await connection();
}

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;
  try {
    return await getClient().fetch<T>(query, params, {
      cache: isStaticPreview ? "force-cache" : "no-store",
    });
  } catch (error) {
    console.error("[sanity] Could not load content; using built-in defaults.", error);
    return null;
  }
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  await renderPerRequest();
  return mergeSettings(await safeFetch<SiteSettings | null>(siteSettingsQuery));
});

export const getPage = cache(async (slug: string): Promise<PageData | null> => {
  await renderPerRequest();
  const fetched = await safeFetch<PageData | null>(pageQuery, { slug });
  const page = fetched ?? defaultPages[slug] ?? null;
  return page ? { ...page, sections: page.sections ?? [] } : null;
});

/** Every page address we know about. Used to pre-build the static preview. */
export async function getPageSlugs(): Promise<string[]> {
  const slugs = new Set(Object.keys(defaultPages));
  for (const slug of (await safeFetch<string[]>(pageSlugsQuery)) ?? []) slugs.add(slug);
  return [...slugs];
}
