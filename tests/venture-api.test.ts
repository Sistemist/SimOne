import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeVentureApiPayload } from "../src/lib/venture-api.ts";
import { createSampleVenture } from "../src/lib/simone-model.ts";

test("normalizeVentureApiPayload accepts a wrapped venture payload", () => {
  const venture = createSampleVenture();
  const result = normalizeVentureApiPayload({ venture });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.id, venture.id);
  assert.equal(result.value.name, "Course Studio");
  assert.equal(result.value.assumptions[0].scope, "customer");
});

test("normalizeVentureApiPayload rejects malformed venture payloads", () => {
  assert.deepEqual(normalizeVentureApiPayload(null), {
    ok: false,
    status: 400,
    message: "A venture payload is required.",
  });

  assert.deepEqual(normalizeVentureApiPayload({ venture: { id: "missing-system-map" } }), {
    ok: false,
    status: 422,
    message: "The venture payload is incomplete.",
  });
});
