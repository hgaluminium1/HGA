/** Suggested Media tags — section-scoped use for editors. */
export const MEDIA_TAGS = [
  "home.hero",
  "home.mission",
  "contact.map",
  "person.photo",
  "category.tile",
  "product.hero",
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
