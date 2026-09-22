import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "./env";
import type { ImageValue } from "./types";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/**
 * URL for a Sanity image, resized and served in a modern format from Sanity's
 * CDN. Returns null if the image is incomplete or Sanity isn't configured.
 */
export function imageUrl(image: ImageValue | null | undefined, width = 1200): string | null {
  if (!builder || !image?.asset) return null;
  return builder.image(image).width(width).auto("format").url();
}
