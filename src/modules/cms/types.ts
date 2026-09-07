export type PageDTO = {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: "draft" | "scheduled" | "published";
  scheduledPublishAt: string | null;
  publishedAt: string | null;
  publishedVersion: unknown | null;
  blocks: Array<{
    id: string;
    type: string;
    order: number;
    appearance: string;
    data: unknown;
  }>;
  seo: { title?: string; description?: string };
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RedirectDTO = {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
