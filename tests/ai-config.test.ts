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
    },
  );

  assert.deepEqual(getAiConfigStatusFromEnv({ DIFY_API_KEY: "key" }).dify, {
    ready: false,
    missing: ["DIFY_BASE_URL", "DIFY_SIM_KNOWLEDGE_ID"],
  });
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
