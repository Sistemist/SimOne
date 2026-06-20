import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeSignupPayload, parseWeb3FormsResponse } from "../src/lib/signup.ts";

test("normalizeSignupPayload trims fields and lowercases email", () => {
  const result = normalizeSignupPayload({
    email: " HAN@Example.COM ",
    name: " Han ",
    useCase: " Course alpha ",
    source: " landing ",
  });

  assert.deepEqual(result, {
    ok: true,
    value: {
      email: "han@example.com",
      name: "Han",
      useCase: "Course alpha",
      source: "landing",
    },
  });
});

test("normalizeSignupPayload rejects invalid email", () => {
  const result = normalizeSignupPayload({ email: "not-email" });

  assert.deepEqual(result, {
    ok: false,
    message: "Please enter a valid email address.",
  });
});

test("parseWeb3FormsResponse handles JSON and plain text errors", () => {
  assert.deepEqual(parseWeb3FormsResponse('{"success":true,"message":"OK"}'), {
    success: true,
    message: "OK",
  });

  assert.deepEqual(parseWeb3FormsResponse("upstream unavailable"), {
    success: false,
    message: "upstream unavailable",
  });
});
