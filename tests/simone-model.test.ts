import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createSampleVenture,
  createVenture,
  drivers,
  engines,
  getWorkspaceEntryPath,
  removeVentureById,
} from "../src/lib/simone-model.ts";

test("getWorkspaceEntryPath sends an empty alpha workspace to onboarding", () => {
  assert.equal(getWorkspaceEntryPath([]), "/app/onboarding");
});

test("getWorkspaceEntryPath resumes the first saved venture", () => {
  const venture = createVenture({
    name: "Course Studio",
    idea: "A cohort product for systems builders",
    audience: "Founders learning SIM",
    intent: "Keep human judgment at the center",
  });

  assert.equal(getWorkspaceEntryPath([venture]), `/app/ventures/${venture.id}`);
});

test("removeVentureById removes one venture without mutating the rest", () => {
  const first = createSampleVenture();
  const second = createVenture({
    name: "Second",
    idea: "Another system",
    audience: "Builders",
    intent: "Keep it coherent",
  });

  assert.deepEqual(removeVentureById([first, second], first.id), [second]);
  assert.deepEqual(removeVentureById([first, second], "missing"), [first, second]);
});

test("createVenture maps all four engines and all four drivers for Sprint Zero", () => {
  const venture = createVenture({
    name: "Course Studio",
    idea: "A cohort product for systems builders",
    audience: "Founders learning SIM",
    intent: "Keep human judgment at the center",
  });

  assert.deepEqual(Object.keys(venture.engines).sort(), engines.map((engine) => engine.key).sort());
  assert.deepEqual(Object.keys(venture.drivers).sort(), drivers.map((driver) => driver.key).sort());

  for (const spec of [...Object.values(venture.engines), ...Object.values(venture.drivers)]) {
    assert.equal(spec.inputs, "");
    assert.equal(spec.process, "");
    assert.equal(spec.outputs, "");
    assert.equal(spec.feedback, "");
    assert.equal(spec.metrics, "");
    assert.equal(spec.status, "draft");
  }
});

test("createVenture scopes Sprint Zero assumptions and decision gates to engines or drivers", () => {
  const venture = createVenture({
    name: "Course Studio",
    idea: "A cohort product for systems builders",
    audience: "Founders learning SIM",
    intent: "Keep human judgment at the center",
  });
  const allowedScopes = new Set([...engines, ...drivers].map((item) => item.key));

  assert.ok(venture.assumptions.length >= 3);
  assert.ok(venture.decisionGates.length >= 3);

  for (const item of [...venture.assumptions, ...venture.decisionGates]) {
    assert.equal(typeof item.id, "string");
    assert.ok(allowedScopes.has(item.scope));
    assert.equal(typeof item.text, "string");
    assert.notEqual(item.text.trim(), "");
    assert.equal(item.status, "draft");
  }
});

test("createSampleVenture provides a course-ready Sprint Zero demo", () => {
  const venture = createSampleVenture();

  assert.equal(venture.name, "Course Studio");
  assert.match(venture.idea, /cohort/i);
  assert.notEqual(venture.engines.product.inputs.trim(), "");
  assert.notEqual(venture.engines.customer.metrics.trim(), "");
  assert.notEqual(venture.drivers.governance.process.trim(), "");
  assert.ok(venture.assumptions.some((item) => item.scope === "customer"));
  assert.ok(venture.decisionGates.some((item) => item.scope === "governance"));
  assert.match(venture.coherenceReview, /Meta-Controller/);
});
