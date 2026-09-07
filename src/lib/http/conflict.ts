export class ConflictError extends Error {
  readonly code = "CONFLICT" as const;
  readonly status = 409;

  constructor(message = "Updated elsewhere — reload") {
    super(message);
    this.name = "ConflictError";
  }
}

export function assertVersionMatch(
  current: number | undefined | null,
  expected: number | undefined,
) {
  if (typeof expected !== "number") {
    throw new ConflictError("Version is required");
  }
  if ((current ?? 1) !== expected) {
    throw new ConflictError("Updated elsewhere — reload");
  }
}

export function isConflictError(err: unknown): err is ConflictError {
  return err instanceof ConflictError;
}
