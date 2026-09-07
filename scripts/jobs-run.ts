import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { isJobName, runJob } from "../src/modules/jobs/index";

async function main() {
  const args = process.argv.slice(2);
  const name = args.find((a) => !a.startsWith("--"));
  const commit = args.includes("--commit");
  const dryRunFlag = args.includes("--dry-run");
  const dryRun = commit ? false : dryRunFlag ? true : true;

  if (!name || !isJobName(name)) {
    console.error(
      "Usage: npm run jobs:run -- <trash-purge|scheduled-publish|preview-expire|webhook-retry> [--dry-run|--commit]",
    );
    process.exit(1);
  }
  const result = await runJob(name, { dryRun });
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
