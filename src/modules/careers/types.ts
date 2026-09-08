export type CareerOpeningDTO = {
  id: string;
  title: string;
  slug: string;
  department:
    | "operations"
    | "quality"
    | "maintenance"
    | "commercial"
    | "engineering"
    | "hr"
    | "other";
  location: string;
  employmentType: "full_time" | "contract" | "internship";
  summary: string;
  description: string;
  applyEmail: string | null;
  sortOrder: number;
  status: "draft" | "published";
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
