import { respondError, respondSuccess } from "@/lib/http/respond";
import { logger } from "@/lib/logger";
import { isJobName, runJob } from "@/modules/jobs";

function authorize(req: Request): boolean {
  const secret = process.env.JOBS_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice("Bearer ".length) === secret;
}

type RouteContext = { params: Promise<{ name: string }> };

async function handle(req: Request, context: RouteContext) {
  if (!authorize(req)) {
    return respondError("UNAUTHORIZED", "Invalid or missing JOBS_SECRET", 401);
  }

  const { name } = await context.params;
  if (!isJobName(name)) {
    return respondError("UNKNOWN_JOB", `Unknown job: ${name}`, 404);
  }

  const result = await runJob(name, { dryRun: true });
  logger.info("jobs.run", { action: "jobs.run", entity: name, dryRun: true });
  return respondSuccess(result);
}

export async function GET(req: Request, context: RouteContext) {
  return handle(req, context);
}

export async function POST(req: Request, context: RouteContext) {
  return handle(req, context);
}
