import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("initial migration creates the durable early access lead table", () => {
  const migration = readFileSync("db/migrations/0001_simone_alpha_foundation.sql", "utf8");

  assert.match(migration, /create table if not exists early_access_leads/i);
  assert.match(migration, /email text not null/i);
  assert.match(migration, /notification_status text not null/i);
});

test("agent run migration preserves approval updates", () => {
  const migration = readFileSync("db/migrations/0002_agent_run_updates.sql", "utf8");

  assert.match(migration, /alter table agent_runs/i);
  assert.match(migration, /add column if not exists updated_at/i);
});
