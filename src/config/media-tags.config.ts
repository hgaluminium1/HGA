/** Suggested Media tags (§23.9) — editable config, not CMS required for Phase 5. */
export const MEDIA_TAGS = [
  "drone",
  "exterior",
  "furnace",
  "billet",
  "extrusion",
  "toolroom",
  "die",
  "profile-correction",
  "quality-lab",
  "finished-product",
  "dispatch",
  "anodizing",
  "powder-coating",
  "metal-touch",
  "director-portrait",
  "team-ppe",
] as const;

export type MediaTag = (typeof MEDIA_TAGS)[number];

export const MEDIA_MAX_BYTES = 15 * 1024 * 1024; // 15 MiB

export const MEDIA_ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
] as const;
