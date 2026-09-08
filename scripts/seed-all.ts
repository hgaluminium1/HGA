/**
 * Wipe all content, then seed realistic integrated data + home + CMS shells.
 * Usage: npm run seed:all
 */
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

function run(script: string) {
  console.log(`\n>>> ${script}`);
  const r = spawnSync(
    process.execPath,
    [resolve("node_modules/tsx/dist/cli.mjs"), resolve(script)],
    { stdio: "inherit", cwd: resolve("."), env: process.env },
  );
  if (r.status !== 0) process.exit(r.status ?? 1);
}

run("scripts/wipe-cms-data.ts");
run("scripts/seed-realistic-all.ts");
run("scripts/seed-home-page.ts");
run("scripts/seed-corporate-pages.ts");

console.log("\n=== seed:all complete ===");
