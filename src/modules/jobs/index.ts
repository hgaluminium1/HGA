export type JobName =
  | "trash-purge"
  | "scheduled-publish"
  | "preview-expire"
  | "webhook-retry";

export const JOB_NAMES: readonly JobName[] = [
  "trash-purge",
  "scheduled-publish",
  "preview-expire",
  "webhook-retry",
] as const;

export type JobResult = {
  ok: true;
  dryRun: boolean;
  name: JobName;
  stats: Record<string, number>;
};

export function isJobName(value: string): value is JobName {
  return (JOB_NAMES as readonly string[]).includes(value);
}

export async function runJob(
  name: JobName,
  options: { dryRun?: boolean } = {},
): Promise<JobResult> {
  const dryRun = options.dryRun ?? true;
  // Real purge/publish logic lands in Phase 6/10 — Phase 0 is a secured noop.
  return {
    ok: true,
    dryRun,
    name,
    stats: { processed: 0 },
  };
}
