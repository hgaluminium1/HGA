export type MediaRef = {
  imageUrl?: string | null;
  imageMediaId?: string | null;
};

/**
 * Resolve a public image URL from denormalized CMS fields.
 * Prefer imageUrl (set by MediaPicker). imageMediaId is reserved for
 * future media-module resolution without coupling lib → modules.
 */
export async function resolveMediaUrl(
  ref: MediaRef,
): Promise<string | null> {
  return resolveMediaUrlSync(ref);
}

/** Sync helper when URL is already denormalized (public render path). */
export function resolveMediaUrlSync(ref: MediaRef): string | null {
  return ref.imageUrl?.trim() || null;
}

/** Empty-state illustration when no CMS media is attached. */
export const CATALOGUE_PLACEHOLDER = "/products/placeholder.svg";
