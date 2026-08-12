import { pingMongo } from "@/lib/db/connect";
import { respondSuccess } from "@/lib/http/respond";
import { logger } from "@/lib/logger";

export async function GET() {
  const mongo = await pingMongo();
  logger.info("health.check", { action: "health", mongo });
  return respondSuccess({
    ok: true,
    mongo,
    ts: new Date().toISOString(),
  });
}
