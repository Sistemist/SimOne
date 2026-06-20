import assert from "node:assert/strict";
import { test } from "node:test";

import { createSampleVenture } from "../src/lib/simone-model.ts";
import {
  deserializeVentureRow,
  serializeVentureForDb,
} from "../src/lib/db/venture-mappers.ts";

test("venture persistence keeps owner and Sprint Zero structure intact", () => {
  const venture = createSampleVenture();
  const row = serializeVentureForDb("HAN@Example.COM", venture);

  assert.equal(row.ownerEmail, "han@example.com");
  assert.equal(row.id, venture.id);
  assert.equal(row.engines.product.inputs, venture.engines.product.inputs);
  assert.equal(row.assumptions[0].scope, "customer");

  const roundTrip = deserializeVentureRow({
    ...row,
    createdAt: new Date(venture.createdAt),
    updatedAt: new Date(venture.updatedAt),
  });

  assert.equal(roundTrip.id, venture.id);
  assert.equal(roundTrip.name, venture.name);
  assert.equal(roundTrip.engines.product.metrics, venture.engines.product.metrics);
  assert.equal(roundTrip.drivers.governance.process, venture.drivers.governance.process);
  assert.equal(roundTrip.assumptions[0].scope, "customer");
  assert.equal(roundTrip.decisionGates[2].scope, "governance");
});
