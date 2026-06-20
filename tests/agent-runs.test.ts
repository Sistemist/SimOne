import assert from "node:assert/strict";
import { test } from "node:test";

import {
  canStartAgentRun,
  createAgentRunDraft,
  normalizeAgentRunApiPayload,
} from "../src/lib/agent-runs.ts";
import {
  deserializeAgentRunRow,
  serializeAgentRunForDb,
} from "../src/lib/db/agent-run-mappers.ts";

test("createAgentRunDraft starts every agent task behind human approval", () => {
  const run = createAgentRunDraft({
    ventureId: "venture-1",
    scope: "product",
    task: "Summarize interview notes into product inputs.",
  });

  assert.equal(run.ventureId, "venture-1");
  assert.equal(run.scope, "product");
  assert.equal(run.status, "approval_required");
  assert.equal(run.humanApproval, "required");
  assert.equal(run.modelProvider, "openrouter");
  assert.equal(run.retrievalSource, "dify");
});

test("canStartAgentRun blocks execution until a human approves", () => {
  const run = createAgentRunDraft({
    ventureId: "venture-1",
    scope: "customer",
    task: "Draft interview questions.",
  });

  assert.deepEqual(canStartAgentRun(run), {
    ok: false,
    message: "Human approval is required before this agent task can run.",
  });

  assert.deepEqual(canStartAgentRun({ ...run, humanApproval: "approved", status: "approved" }), {
    ok: true,
  });
});

test("canStartAgentRun blocks empty tasks even after approval", () => {
  const run = createAgentRunDraft({
    ventureId: "venture-1",
    scope: "governance",
    task: " ",
  });

  assert.deepEqual(canStartAgentRun({ ...run, humanApproval: "approved", status: "approved" }), {
    ok: false,
    message: "Describe the bounded task before running an agent.",
  });
});

test("normalizeAgentRunApiPayload accepts a wrapped agent run", () => {
  const run = createAgentRunDraft({
    ventureId: "venture-1",
    scope: "skills",
    task: "Draft the skills engine learning loop.",
  });
  const result = normalizeAgentRunApiPayload({ agentRun: run });

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value.scope, "skills");
  assert.equal(result.value.humanApproval, "required");
  assert.equal(result.value.task, "Draft the skills engine learning loop.");
});

test("normalizeAgentRunApiPayload rejects malformed agent runs", () => {
  assert.deepEqual(normalizeAgentRunApiPayload(null), {
    ok: false,
    status: 400,
    message: "An agent run payload is required.",
  });

  assert.deepEqual(normalizeAgentRunApiPayload({ agentRun: { id: "missing-task" } }), {
    ok: false,
    status: 422,
    message: "The agent run payload is incomplete.",
  });
});

test("agent run persistence maps scope and trace fields", () => {
  const run = {
    ...createAgentRunDraft({
      ventureId: "venture-1",
      scope: "governance",
      task: "Check public-claim approval gates.",
    }),
    humanApproval: "approved" as const,
    status: "approved" as const,
  };
  const row = serializeAgentRunForDb(run);

  assert.equal(row.engineOrDriver, "governance");
  assert.equal(row.humanApproval, "approved");
  assert.deepEqual(row.trace, {
    events: [
      {
        type: "approval",
        status: "approved",
      },
    ],
  });

  const roundTrip = deserializeAgentRunRow({
    ...row,
    createdAt: new Date(run.createdAt),
    updatedAt: new Date(run.updatedAt),
  });

  assert.equal(roundTrip.id, run.id);
  assert.equal(roundTrip.scope, "governance");
  assert.equal(roundTrip.task, run.task);
  assert.equal(roundTrip.humanApproval, "approved");
});
