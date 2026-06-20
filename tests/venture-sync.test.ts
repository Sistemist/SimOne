import assert from "node:assert/strict";
import { test } from "node:test";

import { createSampleVenture } from "../src/lib/simone-model.ts";
import { mergeVenturesByUpdatedAt } from "../src/lib/venture-sync.ts";

test("mergeVenturesByUpdatedAt keeps the newest version of each venture", () => {
  const local = createSampleVenture();
  const remote = {
    ...local,
    name: "Remote Course Studio",
    updatedAt: new Date(Date.parse(local.updatedAt) + 1000).toISOString(),
  };

  const merged = mergeVenturesByUpdatedAt([local], [remote]);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].name, "Remote Course Studio");
});

test("mergeVenturesByUpdatedAt sorts newest ventures first", () => {
  const older = createSampleVenture();
  const newer = {
    ...createSampleVenture(),
    updatedAt: new Date(Date.parse(older.updatedAt) + 2000).toISOString(),
  };

  const merged = mergeVenturesByUpdatedAt([older], [newer]);

  assert.equal(merged[0].id, newer.id);
  assert.equal(merged[1].id, older.id);
});
