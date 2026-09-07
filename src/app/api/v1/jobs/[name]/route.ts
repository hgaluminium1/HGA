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

function resolveDryRun(req: Request, body: { dryRun?: boolean } | null): boolean {
  const url = new URL(req.url);
  const q = url.searchParams.get("dryRun");
  if (q === "0" || q === "false") return false;
  if (q === "1" || q === "true") return true;
  if (body && typeof body.dryRun === "boolean") return body.dryRun;
  // GET defaults to dry-run; POST without flag defaults to commit
  return req.method === "GET";
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

  let body: { dryRun?: boolean } | null = null;
  if (req.method === "POST") {
    body = (await req.json().catch(() => ({}))) as { dryRun?: boolean };
  }

  const dryRun = resolveDryRun(req, body);
  const result = await runJob(name, { dryRun });
  logger.info("jobs.run", {
    action: "jobs.run",
    entity: name,
    dryRun,
    stats: result.stats,
  });
  return respondSuccess(result);
}

export async function GET(req: Request, context: RouteContext) {
  return handle(req, context);
}

export async function POST(req: Request, context: RouteContext) {
  return handle(req, context);
}
