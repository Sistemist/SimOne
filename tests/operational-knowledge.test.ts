import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("SimOne Operational knowledge defines agent boundaries", () => {
  const content = readFileSync("docs/simone-operational-knowledge.md", "utf8");

  assert.match(content, /Human remains Meta-Controller/i);
  assert.match(content, /SimOne is Supervisory Controller/i);
  assert.match(content, /agents are bounded Embodied Controllers/i);
  assert.match(content, /public claims/i);
  assert.match(content, /cash commitments/i);
  assert.match(content, /customer promises/i);
  assert.match(content, /cross-engine decisions/i);
});
