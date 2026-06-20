import assert from "node:assert/strict";
import { test } from "node:test";

import { getSessionOwnerEmail, normalizeAlphaCredentials } from "../src/lib/auth.ts";

test("normalizeAlphaCredentials trims identity and lowercases email", () => {
  assert.deepEqual(
    normalizeAlphaCredentials({
      email: " HAN@Example.COM ",
      name: " Han Builder ",
    }),
    {
      id: "han@example.com",
      email: "han@example.com",
      name: "Han Builder",
    },
  );
});

test("normalizeAlphaCredentials falls back to a builder name", () => {
  assert.deepEqual(normalizeAlphaCredentials({ email: "han@example.com", name: " " }), {
    id: "han@example.com",
    email: "han@example.com",
    name: "SimOne Builder",
  });
});

test("normalizeAlphaCredentials rejects invalid email", () => {
  assert.equal(normalizeAlphaCredentials({ email: "not-email" }), null);
  assert.equal(normalizeAlphaCredentials(undefined), null);
});

test("getSessionOwnerEmail returns the normalized session owner", () => {
  assert.equal(
    getSessionOwnerEmail({
      user: {
        email: " HAN@Example.COM ",
      },
    }),
    "han@example.com",
  );
  assert.equal(getSessionOwnerEmail({ user: { email: "not-email" } }), null);
  assert.equal(getSessionOwnerEmail(null), null);
});
