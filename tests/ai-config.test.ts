import assert from "node:assert/strict";
import { test } from "node:test";

import { getAiConfigStatusFromEnv } from "../src/lib/ai-config.ts";

test("getAiConfigStatusFromEnv marks Dify ready only when all retrieval settings exist", () => {
  assert.deepEqual(
    getAiConfigStatusFromEnv({
      DIFY_API_KEY: "key",
      DIFY_BASE_URL: "https://dify.example/v1",
      DIFY_SIM_KNOWLEDGE_ID: "knowledge",
    }).dify,
    {
      ready: true,
      missing: [],
      mode: "dedicated",
      knowledgeIdKey: "DIFY_SIM_KNOWLEDGE_ID",
      label: "Dedicated SimOne knowledge",
    },
  );

  assert.deepEqual(getAiConfigStatusFromEnv({ DIFY_API_KEY: "key" }).dify, {
    ready: false,
    missing: ["DIFY_BASE_URL", "DIFY_SIM_KNOWLEDGE_ID"],
    mode: "dedicated",
    knowledgeIdKey: null,
    label: "Dedicated SimOne knowledge",
  });
});

test("getAiConfigStatusFromEnv allows shared Dify knowledge for alpha", () => {
  assert.deepEqual(
    getAiConfigStatusFromEnv({
      DIFY_API_KEY: "key",
      DIFY_BASE_URL: "https://dify.example/v1",
      DIFY_KNOWLEDGE_MODE: "shared",
      DIFY_SHARED_KNOWLEDGE_ID: "shared-knowledge",
    }).dify,
    {
      ready: true,
      missing: [],
      mode: "shared",
      knowledgeIdKey: "DIFY_SHARED_KNOWLEDGE_ID",
      label: "Shared existing knowledge",
    },
  );
});

test("getAiConfigStatusFromEnv can reuse the SimOne knowledge variable in shared mode", () => {
  const status = getAiConfigStatusFromEnv({
    DIFY_API_KEY: "key",
    DIFY_BASE_URL: "https://dify.example/v1",
    DIFY_KNOWLEDGE_MODE: "shared",
    DIFY_SIM_KNOWLEDGE_ID: "existing-knowledge",
  }).dify;

  assert.equal(status.ready, true);
  assert.equal(status.knowledgeIdKey, "DIFY_SIM_KNOWLEDGE_ID");
  assert.equal(status.label, "Shared existing knowledge");
});

test("getAiConfigStatusFromEnv accepts existing Tissuu Dify variable names", () => {
  const status = getAiConfigStatusFromEnv({
    DIFY_KB_API_KEY: "kb-key",
    DIFY_API_URL: "https://dify.tissuu.ai/v1",
    DIFY_KNOWLEDGE_MODE: "shared",
    DIFY_DATASET_ID: "shared-dataset",
  }).dify;

  assert.equal(status.ready, true);
  assert.deepEqual(status.missing, []);
  assert.equal(status.knowledgeIdKey, "DIFY_DATASET_ID");
});

test("getAiConfigStatusFromEnv reports SimOne names when no Dify aliases exist", () => {
  const status = getAiConfigStatusFromEnv({ DIFY_KNOWLEDGE_MODE: "shared" }).dify;

  assert.deepEqual(status.missing, ["DIFY_API_KEY", "DIFY_BASE_URL", "DIFY_SHARED_KNOWLEDGE_ID"]);
});

test("getAiConfigStatusFromEnv reports OpenRouter and Neon readiness without secrets", () => {
  const status = getAiConfigStatusFromEnv({
    DATABASE_URL: "postgres://example",
    OPENROUTER_API_KEY: "sk-or-example",
  });

  assert.equal(status.neon.ready, true);
  assert.equal(status.openRouter.ready, true);
  assert.deepEqual(status.openRouter.missing, []);
});
