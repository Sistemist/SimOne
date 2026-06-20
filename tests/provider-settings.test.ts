import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getProviderSettingsStatus,
  maskProviderKey,
  normalizeProviderSettings,
} from "../src/lib/provider-settings.ts";

test("normalizeProviderSettings defaults OpenRouter BYOK fields", () => {
  assert.deepEqual(
    normalizeProviderSettings({
      apiKey: "  sk-or-v1-example  ",
      model: "",
      baseUrl: "",
    }),
    {
      provider: "openrouter",
      apiKey: "sk-or-v1-example",
      model: "openrouter/auto",
      baseUrl: "https://openrouter.ai/api/v1",
    },
  );
});

test("getProviderSettingsStatus prefers server readiness without exposing secrets", () => {
  assert.deepEqual(
    getProviderSettingsStatus(
      { ready: true, missing: [] },
      normalizeProviderSettings({ apiKey: "sk-or-local" }),
    ),
    {
      ready: true,
      source: "server",
      label: "Server configured",
      missing: [],
    },
  );
});

test("getProviderSettingsStatus accepts local BYOK when server env is missing", () => {
  assert.deepEqual(
    getProviderSettingsStatus(
      { ready: false, missing: ["OPENROUTER_API_KEY"] },
      normalizeProviderSettings({ apiKey: "sk-or-local" }),
    ),
    {
      ready: true,
      source: "local",
      label: "Local BYOK ready",
      missing: [],
    },
  );
});

test("getProviderSettingsStatus reports missing provider config", () => {
  assert.deepEqual(
    getProviderSettingsStatus(
      { ready: false, missing: ["OPENROUTER_API_KEY"] },
      normalizeProviderSettings({ apiKey: "" }),
    ),
    {
      ready: false,
      source: "missing",
      label: "Needs provider key",
      missing: ["OPENROUTER_API_KEY or local BYOK key"],
    },
  );
});

test("maskProviderKey keeps only a short safe preview", () => {
  assert.equal(maskProviderKey("sk-or-v1-abcdef123456"), "sk-o...3456");
  assert.equal(maskProviderKey("short"), "saved");
  assert.equal(maskProviderKey(""), "");
});
