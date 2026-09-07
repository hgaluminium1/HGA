export const ROLES = ["superadmin", "editor", "viewer"] as const;

export type Role = (typeof ROLES)[number];

export type Permission =
  | "pages.read"
  | "pages.write"
  | "pages.publish"
  | "pages.delete"
  | "redirects.read"
  | "redirects.write"
  | "preview.create"
  | "trash.restore"
  | "trash.purge"
  | "catalog.read"
  | "catalog.write"
  | "catalog.publish"
  | "catalog.delete"
  | "dictionaries.read"
  | "dictionaries.write"
  | "media.read"
  | "media.write"
  | "media.delete"
  | "corporate.read"
  | "corporate.write"
  | "corporate.publish"
  | "corporate.delete"
  | "import.write";

const ALL_WRITE: Permission[] = [
  "pages.read",
  "pages.write",
  "pages.publish",
  "pages.delete",
  "redirects.read",
  "redirects.write",
  "preview.create",
  "trash.restore",
  "trash.purge",
  "catalog.read",
  "catalog.write",
  "catalog.publish",
  "catalog.delete",
  "dictionaries.read",
  "dictionaries.write",
  "media.read",
  "media.write",
  "media.delete",
  "corporate.read",
  "corporate.write",
  "corporate.publish",
  "corporate.delete",
  "import.write",
];

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  superadmin: ALL_WRITE,
  editor: ALL_WRITE.filter((p) => p !== "trash.purge"),
  viewer: [
    "pages.read",
    "redirects.read",
    "catalog.read",
    "dictionaries.read",
    "media.read",
    "corporate.read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
