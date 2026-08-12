import { isJobName, runJob } from "../src/modules/jobs/index";

async function main() {
  const name = process.argv[2];
  if (!name || !isJobName(name)) {
    console.error(
      "Usage: npm run jobs:run -- <trash-purge|scheduled-publish|preview-expire|webhook-retry>",
    );
    process.exit(1);
  }
  const result = await runJob(name, { dryRun: true });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
