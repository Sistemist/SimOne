import assert from "node:assert/strict";
import { test } from "node:test";

import { createSampleVenture } from "../src/lib/simone-model.ts";
import {
  createVentureExport,
  parseVentureExport,
} from "../src/lib/venture-transfer.ts";

test("createVentureExport wraps a venture with versioned metadata", () => {
  const venture = createSampleVenture();
  const exported = createVentureExport(venture);

  assert.equal(exported.version, 1);
  assert.equal(exported.kind, "simone.venture");
  assert.equal(exported.venture.id, venture.id);
  assert.match(exported.exportedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("parseVentureExport accepts a serialized venture export", () => {
  const venture = createSampleVenture();
  const payload = JSON.stringify(createVentureExport(venture));
  const result = parseVentureExport(payload);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.name, "Course Studio");
  assert.equal(result.value.assumptions[0].scope, "customer");
});

test("parseVentureExport rejects malformed imports", () => {
  assert.deepEqual(parseVentureExport("not json"), {
    ok: false,
    message: "Choose a valid SimOne venture export.",
  });

  assert.deepEqual(parseVentureExport(JSON.stringify({ kind: "other" })), {
    ok: false,
    message: "This file is not a SimOne venture export.",
  });
});
