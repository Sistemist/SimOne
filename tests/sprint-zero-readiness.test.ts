import assert from "node:assert/strict";
import { test } from "node:test";

import { createSampleVenture, createVenture } from "../src/lib/simone-model.ts";
import { summarizeSprintZeroReadiness } from "../src/lib/sprint-zero-readiness.ts";

test("summarizeSprintZeroReadiness reports an empty venture as unmapped", () => {
  const venture = createVenture({
    name: "Empty",
    idea: "Map a system",
    audience: "Builders",
    intent: "Keep judgment human",
  });
  const summary = summarizeSprintZeroReadiness(venture);

  assert.equal(summary.percent, 0);
  assert.equal(summary.completedComponents, 0);
  assert.equal(summary.totalComponents, 8);
  assert.match(summary.nextGaps[0], /Product.*inputs/i);
});

test("summarizeSprintZeroReadiness counts completed engine and driver specs", () => {
  const summary = summarizeSprintZeroReadiness(createSampleVenture());

  assert.equal(summary.percent, 38);
  assert.equal(summary.completedComponents, 3);
  assert.equal(summary.totalComponents, 8);
  assert.ok(summary.nextGaps.some((gap) => /Cash/i.test(gap)));
});
