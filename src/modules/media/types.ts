export type LocalizedString = { en: string };

export type MediaKind = "image" | "video" | "pdf" | "profile_drawing";
export type MediaLocation = "hg_factory" | "metal_touch" | "office" | "other";

export type MediaDTO = {
  id: string;
  kind: MediaKind;
  tags: string[];
  alt: LocalizedString;
  caption: LocalizedString;
  videoUrl: string | null;
  location: MediaLocation;
  url: string;
  key: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  hash: string | null;
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
