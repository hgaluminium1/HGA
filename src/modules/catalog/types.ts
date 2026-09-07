export type LocalizedString = { en: string };

export type CategoryDTO = {
  id: string;
  name: LocalizedString;
  slug: string;
  parentId: string | null;
  ancestorIds: string[];
  level: number;
  path: string;
  description?: Partial<LocalizedString>;
  imageUrl?: string | null;
  order: number;
  status: "draft" | "published";
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  children?: CategoryDTO[];
  productCount?: number;
};

export type ProductDTO = {
  id: string;
  sku: string;
  name: LocalizedString;
  slug: string;
  categoryIds: string[];
  alloyGrades: string[];
  tempers: string[];
  surfaceFinishes: string[];
  anodizingColors: string[];
  ralColors: string[];
  toleranceStandards: string[];
  packaging: string[];
  maxLengthMm?: number | null;
  minLengthMm?: number | null;
  maxWidthMm?: number | null;
  weightPerMeterKg?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  imageMediaId?: string | null;
  drawingMediaIds: string[];
  blocks: unknown[];
  seo: { title?: string; description?: string };
  status: "draft" | "scheduled" | "published";
  scheduledPublishAt: string | null;
  publishedAt: string | null;
  publishedVersion: unknown | null;
  isUpcoming: boolean;
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DictionaryItemDTO = {
  value: string;
  label: LocalizedString;
  sortOrder: number;
  active: boolean;
};

export type DictionaryDTO = {
  id: string;
  key: string;
  items: DictionaryItemDTO[];
  version: number;
  updatedAt: string;
};
