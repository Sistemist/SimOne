import assert from "node:assert/strict";
import { test } from "node:test";

import { agentRuns, earlyAccessLeads } from "../src/lib/db/schema.ts";

test("earlyAccessLeads stores durable signup fields outside Web3Forms", () => {
  const columns = Object.keys(earlyAccessLeads);

  assert.ok(columns.includes("email"));
  assert.ok(columns.includes("name"));
  assert.ok(columns.includes("useCase"));
  assert.ok(columns.includes("source"));
  assert.ok(columns.includes("createdAt"));
});

test("agentRuns stores traceable human approval state", () => {
  const columns = Object.keys(agentRuns);

  assert.ok(columns.includes("ventureId"));
  assert.ok(columns.includes("engineOrDriver"));
  assert.ok(columns.includes("status"));
  assert.ok(columns.includes("humanApproval"));
  assert.ok(columns.includes("trace"));
  assert.ok(columns.includes("updatedAt"));
});
