import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { DICTIONARY_KEYS, upsertDictionary } from "@/modules/catalog";
import { dictionarySeed } from "./specs.dictionary.seed";

async function main() {
  for (const key of DICTIONARY_KEYS) {
    const items = dictionarySeed[key].map((i) => ({
      ...i,
      active: true,
    }));
    await upsertDictionary({ key, items });
    console.log(`seeded dictionary ${key} (${items.length} items)`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect().catch(() => undefined);
    process.exit(0);
  });
