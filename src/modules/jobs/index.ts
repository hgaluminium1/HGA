import { dbConnect } from "@/lib/db/connect";
import { JobRun } from "./repositories/mongo/job-run.model";
import {
  runPreviewExpire,
  runScheduledPublish,
  runTrashPurge,
} from "./services/job-handlers";

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
  runId?: string;
};

export function isJobName(value: string): value is JobName {
  return (JOB_NAMES as readonly string[]).includes(value);
}

export async function runJob(
  name: JobName,
  options: { dryRun?: boolean } = {},
): Promise<JobResult> {
  const dryRun = options.dryRun ?? true;
  const conn = await dbConnect();
  if (!conn) throw new Error("MONGODB_URI is not configured");

  const startedAt = new Date();
  const run = await JobRun.create({
    name,
    startedAt,
    dryRun,
    status: "running",
    stats: {},
  });

  try {
    let stats: Record<string, number>;
    switch (name) {
      case "scheduled-publish":
        stats = await runScheduledPublish(dryRun);
        break;
      case "trash-purge":
        stats = await runTrashPurge(dryRun);
        break;
      case "preview-expire":
        stats = await runPreviewExpire(dryRun);
        break;
      case "webhook-retry":
        stats = { processed: 0 };
        break;
    }

    run.finishedAt = new Date();
    run.status = "ok";
    run.stats = stats;
    await run.save();

    return {
      ok: true,
      dryRun,
      name,
      stats,
      runId: String(run._id),
    };
  } catch (err) {
    run.finishedAt = new Date();
    run.status = "error";
    run.error = err instanceof Error ? err.message : String(err);
    await run.save();
    throw err;
  }
}
