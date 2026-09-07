import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { ensureSeedSuperadmin } from "@/modules/identity";

async function main() {
  const result = await ensureSeedSuperadmin();
  console.log(JSON.stringify(result, null, 2));
  if (result.reason === "missing_env") {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local before seeding.",
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}).then(async () => {
  const mongoose = await import("mongoose");
  await mongoose.default.disconnect().catch(() => undefined);
  process.exit(0);
});
