import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, readToken } from "./env";

/**
 * Read-only client for published content. Uses Sanity's CDN (which is purged
 * when content is published) unless a token is set for a private dataset.
 */
export function getClient() {
  if (!projectId) {
    throw new Error("Sanity is not configured: NEXT_PUBLIC_SANITY_PROJECT_ID is missing.");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: !readToken,
    perspective: "published",
    token: readToken,
  });
}
