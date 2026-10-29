import assert from "node:assert/strict";
import { test } from "vitest";
import { allowRequest } from "@/lib/rate-limit";

test("corta cuando se pasa el cupo de la ventana", () => {
  const key = `test-${Date.now()}`;
  assert.equal(allowRequest(key, 2, 60_000), true);
  assert.equal(allowRequest(key, 2, 60_000), true);
  assert.equal(allowRequest(key, 2, 60_000), false);
});
