import { getMediaById } from "@/modules/media";

export type MediaRef = {
  imageUrl?: string | null;
  imageMediaId?: string | null;
};

/**
 * Resolve a public image URL from CMS fields.
 * Prefer denormalized imageUrl; fall back to Media document via imageMediaId.
 */
export async function resolveMediaUrl(
  ref: MediaRef,
): Promise<string | null> {
  const direct = ref.imageUrl?.trim();
  if (direct) return direct;
  const id = ref.imageMediaId?.trim();
  if (!id) return null;
  const media = await getMediaById(id);
  return media?.url?.trim() || null;
}

/** Sync helper when URL is already denormalized (public render path). */
export function resolveMediaUrlSync(ref: MediaRef): string | null {
  return ref.imageUrl?.trim() || null;
}

/** Empty-state illustration when no CMS media is attached. */
export const CATALOGUE_PLACEHOLDER = "/products/placeholder.svg";
